(() => {
  const app = document.getElementById("app");
  if (!app) return;

  const CONFIG = {
    "BRG-0002:tr": {
      title: "İlk Titreşim — Anlatıcı Modu",
      audio: "https://www.aidocmaker.com/g0/audio?name=c37759eca64d4989b5103480e65147f9",
      voiceLabel: "HCU Türkçe Anlatıcı · Fancy"
    }
  };

  let activeKey = "";
  let player = null;
  let audio = null;
  let saveTimer = null;

  function context() {
    const u = new URL(window.location.href);
    return {
      mode: u.searchParams.get("mode") || "read",
      story: u.searchParams.get("story") || "",
      lang: u.searchParams.get("lang") || document.documentElement.lang || "en"
    };
  }

  function keyFor(ctx) {
    return ctx.story + ":" + ctx.lang;
  }

  function positionKey(key) {
    return "hcu.narrator.position." + key;
  }

  function rateKey() {
    return "hcu.narrator.rate";
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function stopQuickReader() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function savePosition() {
    if (!audio || !activeKey || !Number.isFinite(audio.currentTime)) return;
    localStorage.setItem(positionKey(activeKey), String(audio.currentTime));
  }

  function updateUi() {
    if (!player || !audio) return;

    const play = player.querySelector("[data-narrator-play]");
    const current = player.querySelector("[data-narrator-current]");
    const duration = player.querySelector("[data-narrator-duration]");
    const range = player.querySelector("[data-narrator-range]");
    const status = player.querySelector("[data-narrator-status]");

    play.textContent = audio.paused ? "▶ Dinle" : "⏸ Duraklat";
    current.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      range.max = String(audio.duration);
      if (!range.matches(":active")) range.value = String(audio.currentTime);
    }

    if (audio.error) {
      status.textContent = "Ses kaydı yüklenemedi.";
    } else if (!audio.paused) {
      status.textContent = "🎧 Anlatıcı okunuyor";
    } else if (audio.currentTime > 0 && (!Number.isFinite(audio.duration) || audio.currentTime < audio.duration)) {
      status.textContent = "Duraklatıldı · kaldığın yer kaydedildi";
    } else {
      status.textContent = "Profesyonel Türkçe anlatıcı kaydı";
    }
  }

  function destroy() {
    if (saveTimer) {
      clearInterval(saveTimer);
      saveTimer = null;
    }
    if (audio) {
      savePosition();
      audio.pause();
      audio.src = "";
      audio.load();
    }
    if (player) player.remove();
    player = null;
    audio = null;
    activeKey = "";
  }

  function build(config, key, storyContent) {
    const section = document.createElement("section");
    section.className = "narrator-player";
    section.setAttribute("aria-label", "Anlatıcı Modu");

    section.innerHTML =
      '<div class="narrator-head">' +
        '<div><strong>🎧 Anlatıcı Modu</strong><small>' + config.voiceLabel + '</small></div>' +
        '<span class="narrator-badge">Sesli kitap</span>' +
      '</div>' +
      '<div class="narrator-title">' + config.title + '</div>' +
      '<div class="narrator-controls">' +
        '<button type="button" class="narrator-button primary" data-narrator-play>▶ Dinle</button>' +
        '<button type="button" class="narrator-button" data-narrator-back aria-label="15 saniye geri">↶ 15 sn</button>' +
        '<button type="button" class="narrator-button" data-narrator-forward aria-label="15 saniye ileri">15 sn ↷</button>' +
        '<label class="narrator-rate"><span>Hız</span><select data-narrator-rate>' +
          '<option value="0.8">0.8×</option>' +
          '<option value="1">1×</option>' +
          '<option value="1.2">1.2×</option>' +
          '<option value="1.5">1.5×</option>' +
        '</select></label>' +
      '</div>' +
      '<div class="narrator-progress-row">' +
        '<span data-narrator-current>0:00</span>' +
        '<input type="range" min="0" max="1" value="0" step="0.1" data-narrator-range aria-label="Ses kaydı konumu">' +
        '<span data-narrator-duration>0:00</span>' +
      '</div>' +
      '<div class="narrator-status" data-narrator-status aria-live="polite">Profesyonel Türkçe anlatıcı kaydı</div>';

    const quickReader = app.querySelector(".audio-reader");
    if (quickReader) quickReader.insertAdjacentElement("beforebegin", section);
    else storyContent.insertAdjacentElement("beforebegin", section);

    const media = new Audio();
    media.preload = "metadata";
    media.src = config.audio;
    media.crossOrigin = "anonymous";

    player = section;
    audio = media;
    activeKey = key;

    const savedRate = localStorage.getItem(rateKey()) || "1";
    const rateSelect = section.querySelector("[data-narrator-rate]");
    if ([...rateSelect.options].some(o => o.value === savedRate)) {
      rateSelect.value = savedRate;
      media.playbackRate = Number(savedRate);
    }

    media.addEventListener("loadedmetadata", () => {
      const saved = Number(localStorage.getItem(positionKey(key)) || "0");
      if (Number.isFinite(saved) && saved > 0 && saved < media.duration - 2) {
        media.currentTime = saved;
      }
      updateUi();
    });

    media.addEventListener("timeupdate", updateUi);
    media.addEventListener("play", updateUi);
    media.addEventListener("pause", () => {
      savePosition();
      updateUi();
    });
    media.addEventListener("ended", () => {
      localStorage.removeItem(positionKey(key));
      updateUi();
    });
    media.addEventListener("error", updateUi);

    section.querySelector("[data-narrator-play]").addEventListener("click", async () => {
      if (media.paused) {
        stopQuickReader();
        try {
          await media.play();
        } catch (_) {
          updateUi();
        }
      } else {
        media.pause();
      }
    });

    section.querySelector("[data-narrator-back]").addEventListener("click", () => {
      media.currentTime = Math.max(0, media.currentTime - 15);
      savePosition();
      updateUi();
    });

    section.querySelector("[data-narrator-forward]").addEventListener("click", () => {
      if (Number.isFinite(media.duration)) {
        media.currentTime = Math.min(media.duration, media.currentTime + 15);
      } else {
        media.currentTime += 15;
      }
      savePosition();
      updateUi();
    });

    rateSelect.addEventListener("change", () => {
      media.playbackRate = Number(rateSelect.value);
      localStorage.setItem(rateKey(), rateSelect.value);
    });

    const range = section.querySelector("[data-narrator-range]");
    range.addEventListener("input", () => {
      media.currentTime = Number(range.value);
      updateUi();
    });
    range.addEventListener("change", savePosition);

    // Hızlı "Sesli Oku" başlatılırsa anlatıcıyı duraklat.
    app.addEventListener("click", event => {
      const quickPlay = event.target.closest?.(".audio-reader [data-audio-play]");
      if (quickPlay && audio && !audio.paused) audio.pause();
    }, true);

    saveTimer = setInterval(savePosition, 5000);
    updateUi();
  }

  function ensure() {
    const ctx = context();
    const key = keyFor(ctx);
    const config = CONFIG[key];

    if (ctx.mode !== "read" || !config) {
      if (activeKey) destroy();
      return;
    }

    const storyContent = app.querySelector(".story-content");
    if (!storyContent) return;

    if (activeKey === key && player?.isConnected) return;
    if (activeKey && activeKey !== key) destroy();

    build(config, key, storyContent);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      ensure();
    });
  }

  new MutationObserver(schedule).observe(app, { childList: true, subtree: true });
  window.addEventListener("pagehide", savePosition);
  window.addEventListener("beforeunload", savePosition);
  schedule();
})();