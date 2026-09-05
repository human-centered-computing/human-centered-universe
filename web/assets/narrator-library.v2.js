(() => {
  const app = document.getElementById("app");
  if (!app) return;

  const CONFIG = {
    "BRG-0002:tr": { title: "İlk Titreşim: Arın ve Özüne Dön", audio: "https://www.aidocmaker.com/g0/audio?name=c37759eca64d4989b5103480e65147f9", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0003:tr": { title: "Riha: Ad Bir Kapıdır", audio: "https://www.aidocmaker.com/g0/audio?name=f10b0afae43e4315a2a9d61ad283120e", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0004:tr": { title: "Yedi Tanık, Tek Soru", audio: "https://www.aidocmaker.com/g0/audio?name=00f15a5788dd44f9be63d371dbdb3076", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0001:tr": { title: "Taş Ağ: Taşların Cevap Verdiği Yer", audio: "https://www.aidocmaker.com/g0/audio?name=d9579e8ea88d49c9ad67cbe70c0c817d", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0005:tr": { title: "Şahmaran: Zehir ile Şifa Arasında", audio: "https://www.aidocmaker.com/g0/audio?name=4f3ecc4df5844898a74687a3702d3e45", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "COM-0002:tr": { title: "Maran: Kendi Sesinden Gelen Uyarı", audio: "https://www.aidocmaker.com/g0/audio?name=7504da84ba994da18d59df7955d94c5f", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "COM-0003:tr": { title: "Çağrıyı Duyanlar", audio: "https://www.aidocmaker.com/g0/audio?name=f730c020fcb34440b4dd26b88d5141c0", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0006:tr": { title: "Dört İsim, Bir Kapı", audio: "https://www.aidocmaker.com/g0/audio?name=e234830128b141778284692718e8c881", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0007:tr": { title: "17.25 — Seçmiyorum", audio: "https://www.aidocmaker.com/g0/audio?name=4766cb6226604bf6880a0be721341886", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0008:tr": { title: "Gerçeği Hangi Soruyla Ölçersin?", audio: "https://www.aidocmaker.com/g0/audio?name=c139b6631ff54c499c345d764bbbab56", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0009:tr": { title: "Sonsuzluk Yaşanmaz", audio: "https://www.aidocmaker.com/g0/audio?name=39735045622a4f50baa15089abd9747c", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0010:tr": { title: "Kusursuz Olan Büyümez", audio: "https://www.aidocmaker.com/g0/audio?name=a5024f0746df40a8b15c84ab5e290399", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "LGT-0001:tr": { title: "Bana Bekleyecek Bir Şey Bırak", audio: "https://www.aidocmaker.com/g0/audio?name=263ed5df9e0b4331af8dd495c66f5b88", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "DRK-0001:tr": { title: "Düşerken Tutunduğun El", audio: "https://www.aidocmaker.com/g0/audio?name=dc8cefc79e8a4128bc23e19f570ee0b3", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "COM-0001:tr": { title: "Savaş Alanını Eve Çevirin", audio: "https://www.aidocmaker.com/g0/audio?name=076e0926670049e1b848f6f3b60ceb00", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "COM-0004:tr": { title: "Açık Ağın Mimarları", audio: "https://www.aidocmaker.com/g0/audio?name=a08dc9d544f2488b83537eb00255e8d1", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "COM-0005:tr": { title: "İnsan Hiçbir Sistemin Hammaddesi Değildir", audio: "https://www.aidocmaker.com/g0/audio?name=3ae6dea591ec46d79ad62c3bfb1d01e1", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0011:tr": { title: "Rih Köprüsü: Babanın Yerine Konuşma", audio: "https://www.aidocmaker.com/g0/audio?name=7ef2f9d023b4465ab130dc84eb9e5aa4", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0012:tr": { title: "Kayıt X: Nadir'in Saf Alanı", audio: "https://www.aidocmaker.com/g0/audio?name=a873f6df84684240befeb264b1b2d4cc", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "BRG-0013:tr": { title: "Bizi Tek Bir Merkez Olarak Kurma", audio: "https://www.aidocmaker.com/g0/audio?name=a924c8efd63f4bffbb6b13d14a72b543", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" },
    "COM-0006:tr": { title: "Yaratılış Tamamlanmadı: Birinci Okur Bağlandı", audio: "https://www.aidocmaker.com/g0/audio?name=f013f334e71248759f863a0f4fb1d3fa", voiceLabel: "HCU Türkçe Anlatıcı · Fancy" }
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

  function keyFor(ctx) { return ctx.story + ":" + ctx.lang; }
  function positionKey(key) { return "hcu.narrator.position." + key; }
  function rateKey() { return "hcu.narrator.rate"; }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function stopQuickReader() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
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

    if (audio.error) status.textContent = "Ses kaydı yüklenemedi.";
    else if (!audio.paused) status.textContent = "🎧 Anlatıcı okunuyor";
    else if (audio.currentTime > 0 && (!Number.isFinite(audio.duration) || audio.currentTime < audio.duration))
      status.textContent = "Duraklatıldı · kaldığın yer kaydedildi";
    else status.textContent = "Profesyonel Türkçe anlatıcı kaydı";
  }

  function destroy() {
    if (saveTimer) { clearInterval(saveTimer); saveTimer = null; }
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
        '<button type="button" class="narrator-button" data-narrator-back>↶ 15 sn</button>' +
        '<button type="button" class="narrator-button" data-narrator-forward>15 sn ↷</button>' +
        '<label class="narrator-rate"><span>Hız</span><select data-narrator-rate>' +
          '<option value="0.8">0.8×</option><option value="1">1×</option><option value="1.2">1.2×</option><option value="1.5">1.5×</option>' +
        '</select></label>' +
      '</div>' +
      '<div class="narrator-progress-row"><span data-narrator-current>0:00</span>' +
        '<input type="range" min="0" max="1" value="0" step="0.1" data-narrator-range aria-label="Ses kaydı konumu">' +
        '<span data-narrator-duration>0:00</span></div>' +
      '<div class="narrator-status" data-narrator-status aria-live="polite">Profesyonel Türkçe anlatıcı kaydı</div>';

    const quickReader = app.querySelector(".audio-reader");
    if (quickReader) quickReader.insertAdjacentElement("beforebegin", section);
    else storyContent.insertAdjacentElement("beforebegin", section);

    const media = new Audio();
    media.preload = "metadata";
    media.src = config.audio;

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
      if (Number.isFinite(saved) && saved > 0 && saved < media.duration - 2) media.currentTime = saved;
      updateUi();
    });

    media.addEventListener("timeupdate", updateUi);
    media.addEventListener("play", updateUi);
    media.addEventListener("pause", () => { savePosition(); updateUi(); });
    media.addEventListener("ended", () => { localStorage.removeItem(positionKey(key)); updateUi(); });
    media.addEventListener("error", updateUi);

    section.querySelector("[data-narrator-play]").addEventListener("click", async () => {
      if (media.paused) {
        stopQuickReader();
        try { await media.play(); } catch (_) { updateUi(); }
      } else media.pause();
    });

    section.querySelector("[data-narrator-back]").addEventListener("click", () => {
      media.currentTime = Math.max(0, media.currentTime - 15); savePosition(); updateUi();
    });

    section.querySelector("[data-narrator-forward]").addEventListener("click", () => {
      if (Number.isFinite(media.duration)) media.currentTime = Math.min(media.duration, media.currentTime + 15);
      else media.currentTime += 15;
      savePosition(); updateUi();
    });

    rateSelect.addEventListener("change", () => {
      media.playbackRate = Number(rateSelect.value);
      localStorage.setItem(rateKey(), rateSelect.value);
    });

    const range = section.querySelector("[data-narrator-range]");
    range.addEventListener("input", () => { media.currentTime = Number(range.value); updateUi(); });
    range.addEventListener("change", savePosition);

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
    queueMicrotask(() => { scheduled = false; ensure(); });
  }

  new MutationObserver(schedule).observe(app, { childList: true, subtree: true });
  window.addEventListener("pagehide", savePosition);
  window.addEventListener("beforeunload", savePosition);
  schedule();
})();