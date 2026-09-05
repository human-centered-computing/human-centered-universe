(() => {
  const app = document.getElementById("app");
  if (!app) return;

  let library = null;
  let activeKey = "";
  let player = null;
  let audio = null;
  let saveTimer = null;

  const ctx = () => {
    const u = new URL(location.href);
    return {
      mode: u.searchParams.get("mode") || "read",
      story: u.searchParams.get("story") || "",
      lang: u.searchParams.get("lang") || document.documentElement.lang || "en"
    };
  };

  const posKey = id => `hcu.narrator.position.${id}:tr`;
  const rateKey = "hcu.narrator.rate";

  function time(v) {
    if (!Number.isFinite(v) || v < 0) v = 0;
    const n = Math.floor(v);
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
  }

  async function loadLibrary() {
    if (library) return library;
    try {
      const r = await fetch("./assets/audio/tr/manifest.json", { cache: "no-store" });
      if (!r.ok) return null;
      library = await r.json();
      return library;
    } catch (_) {
      return null;
    }
  }

  function entryFor(id) {
    return library?.chapters?.find(x => x.id === id) || null;
  }

  function save() {
    if (audio && activeKey && Number.isFinite(audio.currentTime)) {
      localStorage.setItem(posKey(activeKey), String(audio.currentTime));
    }
  }

  function destroy() {
    if (saveTimer) clearInterval(saveTimer);
    saveTimer = null;
    if (audio) {
      save();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    player?.remove();
    player = null;
    audio = null;
    activeKey = "";
  }

  function update() {
    if (!player || !audio) return;
    player.querySelector("[data-n-play]").textContent = audio.paused ? "▶ Dinle" : "⏸ Duraklat";
    player.querySelector("[data-n-now]").textContent = time(audio.currentTime);
    player.querySelector("[data-n-end]").textContent = time(audio.duration);

    const bar = player.querySelector("[data-n-range]");
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      bar.max = audio.duration;
      if (!bar.matches(":active")) bar.value = audio.currentTime;
    }

    const status = player.querySelector("[data-n-status]");
    if (audio.error) status.textContent = "Ses dosyası yüklenemedi.";
    else if (!audio.paused) status.textContent = "🎧 Anlatıcı okunuyor";
    else if (audio.currentTime > 0) status.textContent = "Duraklatıldı · kaldığın yer kaydedildi";
    else status.textContent = "GitHub üzerinde üretilmiş Türkçe anlatıcı kaydı";
  }

  function build(entry, storyContent) {
    const section = document.createElement("section");
    section.className = "narrator-player";
    section.innerHTML = `
      <div class="narrator-head">
        <div>
          <strong>🎧 Anlatıcı Modu</strong>
          <small>Piper · Türkçe</small>
        </div>
        <span class="narrator-badge">GitHub TTS</span>
      </div>
      <div class="narrator-title"></div>
      <div class="narrator-controls">
        <button type="button" class="narrator-button primary" data-n-play>▶ Dinle</button>
        <button type="button" class="narrator-button" data-n-back>↶ 15 sn</button>
        <button type="button" class="narrator-button" data-n-forward>15 sn ↷</button>
        <label class="narrator-rate">
          <span>Hız</span>
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
        <input type="range" min="0" max="1" step="0.1" value="0" data-n-range aria-label="Ses kaydı konumu">
        <span data-n-end>0:00</span>
      </div>
      <div class="narrator-status" data-n-status aria-live="polite">GitHub üzerinde üretilmiş Türkçe anlatıcı kaydı</div>
    `;
    section.querySelector(".narrator-title").textContent = entry.title;

    const quick = app.querySelector(".audio-reader");
    if (quick) quick.insertAdjacentElement("beforebegin", section);
    else storyContent.insertAdjacentElement("beforebegin", section);

    player = section;
    activeKey = entry.id;
    audio = new Audio(`./assets/audio/tr/${entry.id}.mp3`);
    audio.preload = "metadata";

    const rate = section.querySelector("[data-n-rate]");
    const savedRate = localStorage.getItem(rateKey) || "1";
    rate.value = [...rate.options].some(o => o.value === savedRate) ? savedRate : "1";
    audio.playbackRate = Number(rate.value);

    audio.addEventListener("loadedmetadata", () => {
      const saved = Number(localStorage.getItem(posKey(entry.id)) || 0);
      if (saved > 0 && saved < audio.duration - 2) audio.currentTime = saved;
      update();
    });
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("play", update);
    audio.addEventListener("pause", () => { save(); update(); });
    audio.addEventListener("ended", () => {
      localStorage.removeItem(posKey(entry.id));
      update();
    });
    audio.addEventListener("error", update);

    section.querySelector("[data-n-play]").addEventListener("click", async () => {
      if (audio.paused) {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        try { await audio.play(); } catch (_) { update(); }
      } else {
        audio.pause();
      }
    });

    section.querySelector("[data-n-back]").addEventListener("click", () => {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
      save(); update();
    });

    section.querySelector("[data-n-forward]").addEventListener("click", () => {
      audio.currentTime = Number.isFinite(audio.duration)
        ? Math.min(audio.duration, audio.currentTime + 15)
        : audio.currentTime + 15;
      save(); update();
    });

    rate.addEventListener("change", () => {
      audio.playbackRate = Number(rate.value);
      localStorage.setItem(rateKey, rate.value);
    });

    const range = section.querySelector("[data-n-range]");
    range.addEventListener("input", () => {
      audio.currentTime = Number(range.value);
      update();
    });
    range.addEventListener("change", save);

    saveTimer = setInterval(save, 5000);
    update();
  }

  async function ensure() {
    const c = ctx();

    if (c.mode !== "read" || c.lang !== "tr") {
      if (activeKey) destroy();
      return;
    }

    const storyContent = app.querySelector(".story-content");
    if (!storyContent) return;

    await loadLibrary();
    const entry = entryFor(c.story);

    if (!entry) {
      if (activeKey) destroy();
      return;
    }

    if (activeKey === entry.id && player?.isConnected) return;
    if (activeKey) destroy();
    build(entry, storyContent);
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(async () => {
      scheduled = false;
      await ensure();
    });
  };

  new MutationObserver(schedule).observe(app, { childList: true, subtree: true });
  addEventListener("pagehide", save);
  addEventListener("beforeunload", save);
  schedule();
})();
