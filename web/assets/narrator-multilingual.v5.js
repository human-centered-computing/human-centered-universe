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

  function time(v) {
    if (!Number.isFinite(v) || v < 0) v = 0;
    const n = Math.floor(v);
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
  }

  async function manifest(lang) {
    if (manifestCache.has(lang)) return manifestCache.get(lang);
    try {
      const r = await fetch(`./assets/audio/${encodeURIComponent(lang)}/manifest.json`, { cache: "no-store" });
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

  function update() {
    if (!player || !audio) return;
    player.querySelector("[data-n-play]").textContent = audio.paused ? "▶" : "⏸";
    player.querySelector("[data-n-now]").textContent = time(audio.currentTime);
    player.querySelector("[data-n-end]").textContent = time(audio.duration);

    const bar = player.querySelector("[data-n-range]");
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      bar.max = audio.duration;
      if (!bar.matches(":active")) bar.value = audio.currentTime;
    }

    const status = player.querySelector("[data-n-status]");
    if (audio.error) status.textContent = "Narration audio could not be loaded.";
    else if (!audio.paused) status.textContent = "🎧 Narration playing";
    else if (audio.currentTime > 0) status.textContent = "Paused · position saved";
    else status.textContent = "GitHub-generated narration";
  }

  function build(c, entry, mf, storyContent) {
    const section = document.createElement("section");
    section.className = "narrator-player";
    section.innerHTML = `
      <div class="narrator-head">
        <div>
          <strong>🎧 Narrator</strong>
          <small></small>
        </div>
        <span class="narrator-badge">GitHub TTS</span>
      </div>
      <div class="narrator-title"></div>
      <div class="narrator-controls">
        <button type="button" class="narrator-button primary" data-n-play>▶</button>
        <button type="button" class="narrator-button" data-n-back>↶ 15s</button>
        <button type="button" class="narrator-button" data-n-forward>15s ↷</button>
        <label class="narrator-rate">
          <span>Speed</span>
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
      <div class="narrator-status" data-n-status aria-live="polite">GitHub-generated narration</div>
    `;

    section.querySelector(".narrator-head small").textContent = `${mf.label || c.lang} · Piper`;
    section.querySelector(".narrator-title").textContent = entry.title || c.story;

    const quick = app.querySelector(".audio-reader");
    if (quick) quick.insertAdjacentElement("beforebegin", section);
    else storyContent.insertAdjacentElement("beforebegin", section);

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
      update();
    });
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("play", update);
    audio.addEventListener("pause", () => { save(c); update(); });
    audio.addEventListener("ended", () => {
      localStorage.removeItem(posKey(c));
      update();
    });
    audio.addEventListener("error", update);

    section.querySelector("[data-n-play]").addEventListener("click", async () => {
      if (audio.paused) {
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        try { await audio.play(); } catch (_) { update(); }
      } else audio.pause();
    });

    section.querySelector("[data-n-back]").addEventListener("click", () => {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
      save(c); update();
    });
    section.querySelector("[data-n-forward]").addEventListener("click", () => {
      audio.currentTime = Number.isFinite(audio.duration)
        ? Math.min(audio.duration, audio.currentTime + 15)
        : audio.currentTime + 15;
      save(c); update();
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
    range.addEventListener("change", () => save(c));

    saveTimer = setInterval(() => save(c), 5000);
    update();
  }

  async function ensure() {
    const c = context();
    if (c.mode !== "read") {
      if (active) destroy(c);
      return;
    }

    const storyContent = app.querySelector(".story-content");
    if (!storyContent) return;

    const mf = await manifest(c.lang);
    const entry = mf?.chapters?.find(x => x.id === c.story);

    if (!entry) {
      if (active) destroy(c);
      return;
    }

    if (active === key(c) && player?.isConnected) return;
    if (active) destroy(c);
    build(c, entry, mf, storyContent);
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
