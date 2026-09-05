(() => {
  const app = document.getElementById("app");
  if (!app) return;

  let player = null;
  let audio = null;
  let active = "";
  let manifestCache = new Map();
  let saveTimer = null;

  function context() {
    const u = new URL(location.href);
    return {
      mode: u.searchParams.get("mode") || "read",
      story: u.searchParams.get("story") || "",
      lang: u.searchParams.get("lang") || document.documentElement.lang || "en"
    };
  }

  const key = c => `${c.lang}:${c.story}`;
  const posKey = c => `hcu.narrator.position.${c.lang}.${c.story}`;
  const rateKey = "hcu.narrator.rate";

  function uiText(lang) {
    if (lang === "tr") {
      return {
        title: "🎧 Anlatıcı Modu",
        badge: "GitHub TTS",
        speed: "Hız",
        ready: "GitHub üzerinde üretilmiş anlatıcı kaydı",
        playing: "🎧 Anlatıcı okunuyor",
        paused: "Duraklatıldı · kaldığın yer kaydedildi",
        error: "Ses dosyası yüklenemedi.",
        pending: "Ses hazırlanıyor. GitHub Actions tamamlandığında burada kitap gibi dinleyebileceksin.",
        pendingBadge: "Hazırlanıyor",
        unavailable: "Bu bölüm için henüz ses kaydı oluşturulmadı."
      };
    }
    return {
      title: "🎧 Narrator",
      badge: "GitHub TTS",
      speed: "Speed",
      ready: "GitHub-generated narration",
      playing: "🎧 Narration playing",
      paused: "Paused · position saved",
      error: "Narration audio could not be loaded.",
      pending: "Narration is being prepared. It will appear here when GitHub Actions finishes.",
      pendingBadge: "Preparing",
      unavailable: "Narration has not been generated for this chapter yet."
    };
  }

  function time(v) {
    if (!Number.isFinite(v) || v < 0) v = 0;
    const n = Math.floor(v);
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
  }

  async function manifest(lang, force = false) {
    if (force) manifestCache.delete(lang);
    if (manifestCache.has(lang)) return manifestCache.get(lang);
    try {
      const r = await fetch(`./assets/audio/${encodeURIComponent(lang)}/manifest.json?t=${Date.now()}`, { cache: "no-store" });
      if (!r.ok) {
        manifestCache.set(lang, null);
        return null;
      }
      const data = await r.json();
      manifestCache.set(lang, data);
      return data;
    } catch (_) {
      manifestCache.set(lang, null);
      return null;
    }
  }

  function save(c) {
    if (audio && Number.isFinite(audio.currentTime)) {
      localStorage.setItem(posKey(c), String(audio.currentTime));
    }
  }

  function destroy(c = context()) {
    if (saveTimer) clearInterval(saveTimer);
    saveTimer = null;
    if (audio) {
      save(c);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    player?.remove();
    player = null;
    audio = null;
    active = "";
  }

  function insertPanel(section, storyContent) {
    const quick = app.querySelector(".audio-reader");
    if (quick) quick.insertAdjacentElement("beforebegin", section);
    else storyContent.insertAdjacentElement("beforebegin", section);
  }

  function chapterTitle(storyContent, fallback) {
    return storyContent.querySelector("h1")?.textContent?.trim() || fallback;
  }

  function buildPending(c, storyContent) {
    const t = uiText(c.lang);
    const section = document.createElement("section");
    section.className = "narrator-player narrator-pending";
    section.innerHTML = `
      <div class="narrator-head">
        <div>
          <strong>${t.title}</strong>
          <small>${c.lang.toUpperCase()} · Piper</small>
        </div>
        <span class="narrator-badge">${t.pendingBadge}</span>
      </div>
      <div class="narrator-title"></div>
      <div class="narrator-pending-message">${t.pending}</div>
      <div class="narrator-controls">
        <button type="button" class="narrator-button primary" data-n-retry>↻ ${c.lang === "tr" ? "Tekrar kontrol et" : "Check again"}</button>
      </div>
    `;
    section.querySelector(".narrator-title").textContent = chapterTitle(storyContent, c.story);
    insertPanel(section, storyContent);

    player = section;
    active = key(c);

    section.querySelector("[data-n-retry]").addEventListener("click", async () => {
      const mf = await manifest(c.lang, true);
      const entry = mf?.chapters?.find(x => x.id === c.story);
      if (entry) {
        destroy(c);
        build(c, entry, mf, storyContent);
      } else {
        const msg = section.querySelector(".narrator-pending-message");
        msg.textContent = t.unavailable;
      }
    });
  }

  function update(c) {
    if (!player || !audio) return;
    const t = uiText(c.lang);
    player.querySelector("[data-n-play]").textContent = audio.paused ? "▶" : "⏸";
    player.querySelector("[data-n-now]").textContent = time(audio.currentTime);
    player.querySelector("[data-n-end]").textContent = time(audio.duration);

    const bar = player.querySelector("[data-n-range]");
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      bar.max = audio.duration;
      if (!bar.matches(":active")) bar.value = audio.currentTime;
    }

    const status = player.querySelector("[data-n-status]");
    if (audio.error) status.textContent = t.error;
    else if (!audio.paused) status.textContent = t.playing;
    else if (audio.currentTime > 0) status.textContent = t.paused;
    else status.textContent = t.ready;
  }

  function build(c, entry, mf, storyContent) {
    const t = uiText(c.lang);
    const section = document.createElement("section");
    section.className = "narrator-player";
    section.innerHTML = `
      <div class="narrator-head">
        <div>
          <strong>${t.title}</strong>
          <small></small>
        </div>
        <span class="narrator-badge">${t.badge}</span>
      </div>
      <div class="narrator-title"></div>
      <div class="narrator-controls">
        <button type="button" class="narrator-button primary" data-n-play>▶</button>
        <button type="button" class="narrator-button" data-n-back>↶ 15s</button>
        <button type="button" class="narrator-button" data-n-forward>15s ↷</button>
        <label class="narrator-rate">
          <span>${t.speed}</span>
          <select data-n-rate>
            <option value="0.8">0.8×</option>
            <option value="1">1×</option>
            <option value="1.2">1.2×</option>
            <option value="1.5">1.5×</option>
          </select>
        </label>
      </div>
      <div class="narrator-progress-row">
        <span data-n-now>0:00</span>
        <input type="range" min="0" max="1" step="0.1" value="0" data-n-range>
        <span data-n-end>0:00</span>
      </div>
      <div class="narrator-status" data-n-status aria-live="polite">${t.ready}</div>
    `;

    section.querySelector(".narrator-head small").textContent = `${mf.label || c.lang} · Piper`;
    section.querySelector(".narrator-title").textContent = entry.title || chapterTitle(storyContent, c.story);
    insertPanel(section, storyContent);

    player = section;
    active = key(c);
    audio = new Audio(`./assets/audio/${encodeURIComponent(c.lang)}/${encodeURIComponent(c.story)}.mp3`);
    audio.preload = "metadata";

    const rate = section.querySelector("[data-n-rate]");
    const savedRate = localStorage.getItem(rateKey) || "1";
    rate.value = [...rate.options].some(o => o.value === savedRate) ? savedRate : "1";
    audio.playbackRate = Number(rate.value);

    audio.addEventListener("loadedmetadata", () => {
      const saved = Number(localStorage.getItem(posKey(c)) || 0);
      if (saved > 0 && saved < audio.duration - 2) audio.currentTime = saved;
      update(c);
    });
    audio.addEventListener("timeupdate", () => update(c));
    audio.addEventListener("play", () => update(c));
    audio.addEventListener("pause", () => { save(c); update(c); });
    audio.addEventListener("ended", () => {
      localStorage.removeItem(posKey(c));
      update(c);
    });
    audio.addEventListener("error", () => update(c));

    section.querySelector("[data-n-play]").addEventListener("click", async () => {
      if (audio.paused) {
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        try { await audio.play(); } catch (_) { update(c); }
      } else audio.pause();
    });

    section.querySelector("[data-n-back]").addEventListener("click", () => {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
      save(c); update(c);
    });
    section.querySelector("[data-n-forward]").addEventListener("click", () => {
      audio.currentTime = Number.isFinite(audio.duration)
        ? Math.min(audio.duration, audio.currentTime + 15)
        : audio.currentTime + 15;
      save(c); update(c);
    });
    rate.addEventListener("change", () => {
      audio.playbackRate = Number(rate.value);
      localStorage.setItem(rateKey, rate.value);
    });
    const range = section.querySelector("[data-n-range]");
    range.addEventListener("input", () => {
      audio.currentTime = Number(range.value);
      update(c);
    });
    range.addEventListener("change", () => save(c));

    saveTimer = setInterval(() => save(c), 5000);
    update(c);
  }

  async function ensure() {
    const c = context();
    if (c.mode !== "read") {
      if (active) destroy(c);
      return;
    }

    const storyContent = app.querySelector(".story-content");
    if (!storyContent) return;

    const currentKey = key(c);
    if (active === currentKey && player?.isConnected) return;
    if (active) destroy(c);

    const mf = await manifest(c.lang);
    const entry = mf?.chapters?.find(x => x.id === c.story);

    if (entry) build(c, entry, mf, storyContent);
    else buildPending(c, storyContent);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(async () => {
      scheduled = false;
      await ensure();
    });
  }

  new MutationObserver(schedule).observe(app, { childList: true, subtree: true });
  addEventListener("pagehide", () => save(context()));
  addEventListener("beforeunload", () => save(context()));
  schedule();
})();
