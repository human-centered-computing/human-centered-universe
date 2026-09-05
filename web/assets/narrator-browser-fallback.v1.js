(() => {
  const app = document.getElementById("app");
  const synth = window.speechSynthesis;
  const supported = !!(synth && window.SpeechSynthesisUtterance);
  if (!app) return;

  let panel = null;
  let blocks = [];
  let index = 0;
  let speaking = false;
  let paused = false;
  let token = 0;

  const ctx = () => {
    const u = new URL(location.href);
    return {
      story: u.searchParams.get("story") || "",
      lang: u.searchParams.get("lang") || document.documentElement.lang || "en"
    };
  };

  const T = {
    tr: {
      title: "🔊 Metin Seslendirme",
      note: "Profesyonel ses hazır olana kadar tarayıcındaki sesle hikâyeyi dinleyebilirsin. API anahtarı gerekmez.",
      play: "Tarayıcıyla Seslendir",
      pause: "Duraklat",
      resume: "Devam Et",
      stop: "Durdur",
      prev: "Önceki",
      next: "Sonraki",
      voice: "Ses",
      speed: "Hız",
      ready: "Metin seslendirme hazır.",
      reading: "Okunuyor",
      paused: "Duraklatıldı.",
      done: "Bölüm tamamlandı.",
      unsupported: "Bu tarayıcı metin seslendirmeyi desteklemiyor.",
      empty: "Seslendirilecek hikâye metni bulunamadı.",
      part: "Paragraf",
      defaultVoice: "Varsayılan ses",
      error: "Metin seslendirme başlatılamadı."
    },
    en: {
      title: "🔊 Text to Speech",
      note: "Listen with a browser voice while professional narration is being prepared. No API key required.",
      play: "Read with Browser",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      prev: "Previous",
      next: "Next",
      voice: "Voice",
      speed: "Speed",
      ready: "Text to speech is ready.",
      reading: "Reading",
      paused: "Paused.",
      done: "Chapter complete.",
      unsupported: "This browser does not support text to speech.",
      empty: "No story text was found to read.",
      part: "Paragraph",
      defaultVoice: "Default voice",
      error: "Text to speech could not start."
    }
  };

  const text = lang => T[lang] || T.en;
  const stateKey = c => `hcu.browserTts.index.${c.lang}.${c.story}`;
  const voiceKey = lang => `hcu.browserTts.voice.${lang}`;
  const rateKey = "hcu.browserTts.rate";

  function cancel() {
    token++;
    speaking = false;
    paused = false;
    if (supported) synth.cancel();
  }

  function storyBlocks() {
    const story = app.querySelector(".story-content");
    if (!story) return [];

    const result = [];
    const seen = new Set();

    story.querySelectorAll("h1,h2,h3,p,blockquote,li").forEach(node => {
      if (node.closest("figure,figcaption,.story-media,.media-card,.media-figure,.media-gallery,.media-slot,.media-caption,.hcu-media,[data-media]")) return;

      const value = (node.innerText || node.textContent || "")
        .replace(/\s+/g, " ")
        .trim();

      if (!value || seen.has(value)) return;
      seen.add(value);
      result.push(value);
    });

    return result;
  }

  function languagePrefixes(lang) {
    return ({
      tr: ["tr-TR", "tr"],
      en: ["en-US", "en-GB", "en"],
      de: ["de-DE", "de"],
      fr: ["fr-FR", "fr"],
      es: ["es-ES", "es"],
      it: ["it-IT", "it"]
    })[lang] || [lang];
  }

  function voicesFor(lang) {
    if (!supported) return [];
    const all = synth.getVoices();
    const prefixes = languagePrefixes(lang).map(x => x.toLowerCase());
    const matches = all.filter(v =>
      prefixes.some(p => (v.lang || "").toLowerCase().startsWith(p))
    );
    return matches.length ? matches : all;
  }

  function fillVoices(select, lang, t) {
    if (!select) return;

    const saved = localStorage.getItem(voiceKey(lang)) || "";
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = t.defaultVoice;
    select.appendChild(first);

    voicesFor(lang).forEach(v => {
      const option = document.createElement("option");
      option.value = `${v.name}|||${v.lang}`;
      option.textContent = `${v.name} (${v.lang})`;
      if (option.value === saved) option.selected = true;
      select.appendChild(option);
    });
  }

  function selectedVoice(select, lang) {
    if (!select?.value) return null;
    const [name, voiceLang] = select.value.split("|||");

    return synth.getVoices().find(v => v.name === name && v.lang === voiceLang)
      || voicesFor(lang).find(v => v.name === name)
      || null;
  }

  function setStatus(message) {
    const target = panel?.querySelector("[data-btts-status]");
    if (target) target.textContent = message;
  }

  function update(c, message) {
    if (!panel) return;

    const t = text(c.lang);
    const play = panel.querySelector("[data-btts-play]");
    const stop = panel.querySelector("[data-btts-stop]");
    const pos = panel.querySelector("[data-btts-pos]");

    if (play) {
      play.textContent = speaking
        ? (paused ? `▶ ${t.resume}` : `⏸ ${t.pause}`)
        : `▶ ${t.play}`;
      play.disabled = !supported || !blocks.length;
    }

    if (stop) stop.disabled = !speaking && !paused;

    if (pos) {
      pos.textContent = blocks.length
        ? `${t.part} ${Math.min(index + 1, blocks.length)}/${blocks.length}`
        : "";
    }

    setStatus(message || (supported ? t.ready : t.unsupported));
  }

  function speak(c, i) {
    const t = text(c.lang);

    if (!supported) return update(c, t.unsupported);
    if (!blocks.length) return update(c, t.empty);

    index = Math.max(0, Math.min(i, blocks.length - 1));
    localStorage.setItem(stateKey(c), String(index));

    const myToken = ++token;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(blocks[index]);
    const voiceSelect = panel.querySelector("[data-btts-voice]");
    const rateSelect = panel.querySelector("[data-btts-rate]");
    const voice = selectedVoice(voiceSelect, c.lang);

    if (voice) utter.voice = voice;
    utter.lang = voice?.lang || languagePrefixes(c.lang)[0];
    utter.rate = Number(rateSelect?.value || 1);

    utter.onstart = () => {
      if (myToken !== token) return;
      speaking = true;
      paused = false;
      update(c, `${t.reading} · ${t.part} ${index + 1}/${blocks.length}`);
    };

    utter.onend = () => {
      if (myToken !== token) return;

      if (index < blocks.length - 1) {
        speak(c, index + 1);
      } else {
        speaking = false;
        paused = false;
        index = 0;
        localStorage.removeItem(stateKey(c));
        update(c, t.done);
      }
    };

    utter.onerror = e => {
      if (myToken !== token || e.error === "canceled" || e.error === "interrupted") return;
      speaking = false;
      paused = false;
      update(c, t.error);
    };

    try {
      synth.speak(utter);
    } catch (_) {
      speaking = false;
      paused = false;
      update(c, t.error);
    }
  }

  function mount(target) {
    if (!target || target.querySelector("[data-browser-tts]")) return;

    if (panel && panel !== target) cancel();

    panel = target;
    const c = ctx();
    const t = text(c.lang);

    blocks = storyBlocks();

    const savedIndex = Number(localStorage.getItem(stateKey(c)) || 0);
    index = Number.isInteger(savedIndex) &&
            savedIndex >= 0 &&
            savedIndex < blocks.length
      ? savedIndex
      : 0;

    const box = document.createElement("div");
    box.className = "narrator-browser-tts";
    box.dataset.browserTts = "1";

    box.innerHTML = `
      <div class="narrator-subhead">
        <strong>${t.title}</strong>
        <small>${t.note}</small>
      </div>

      <div class="narrator-controls">
        <button type="button" class="narrator-button primary" data-btts-play>
          ▶ ${t.play}
        </button>

        <button type="button" class="narrator-button" data-btts-stop>
          ■ ${t.stop}
        </button>

        <button type="button" class="narrator-button" data-btts-prev>
          ← ${t.prev}
        </button>

        <button type="button" class="narrator-button" data-btts-next>
          ${t.next} →
        </button>

        <label class="narrator-rate narrator-voice">
          <span>${t.voice}</span>
          <select data-btts-voice></select>
        </label>

        <label class="narrator-rate">
          <span>${t.speed}</span>
          <select data-btts-rate>
            <option value="0.75">0.75×</option>
            <option value="1">1×</option>
            <option value="1.15">1.15×</option>
            <option value="1.3">1.3×</option>
            <option value="1.5">1.5×</option>
          </select>
        </label>
      </div>

      <div class="narrator-browser-status-row">
        <span data-btts-status></span>
        <span data-btts-pos></span>
      </div>
    `;

    const pendingMessage = target.querySelector(".narrator-pending-message");

    if (pendingMessage) {
      pendingMessage.insertAdjacentElement("afterend", box);
    } else {
      target.appendChild(box);
    }

    const voiceSelect = box.querySelector("[data-btts-voice]");
    const rateSelect = box.querySelector("[data-btts-rate]");

    rateSelect.value = localStorage.getItem(rateKey) || "1";

    const loadVoices = () => fillVoices(voiceSelect, c.lang, t);
    loadVoices();

    if (supported) {
      synth.addEventListener?.("voiceschanged", loadVoices, { once: true });
    }

    voiceSelect.addEventListener("change", () => {
      localStorage.setItem(voiceKey(c.lang), voiceSelect.value);
      if (speaking || paused) speak(c, index);
    });

    rateSelect.addEventListener("change", () => {
      localStorage.setItem(rateKey, rateSelect.value);
      if (speaking || paused) speak(c, index);
    });

    box.querySelector("[data-btts-play]").addEventListener("click", () => {
      if (!supported) return update(c, t.unsupported);
      if (!blocks.length) return update(c, t.empty);

      if (speaking && !paused) {
        synth.pause();
        paused = true;
        return update(c, t.paused);
      }

      if (speaking && paused) {
        synth.resume();
        paused = false;
        return update(c, `${t.reading} · ${t.part} ${index + 1}/${blocks.length}`);
      }

      speak(c, index);
    });

    box.querySelector("[data-btts-stop]").addEventListener("click", () => {
      cancel();
      update(c, t.ready);
    });

    box.querySelector("[data-btts-prev]").addEventListener("click", () => {
      const next = Math.max(0, index - 1);

      if (speaking || paused) {
        speak(c, next);
      } else {
        index = next;
        localStorage.setItem(stateKey(c), String(index));
        update(c);
      }
    });

    box.querySelector("[data-btts-next]").addEventListener("click", () => {
      const next = Math.min(Math.max(blocks.length - 1, 0), index + 1);

      if (speaking || paused) {
        speak(c, next);
      } else {
        index = next;
        localStorage.setItem(stateKey(c), String(index));
        update(c);
      }
    });

    update(c);
  }

  function scan() {
    const pending = app.querySelector(".narrator-player.narrator-pending");

    if (pending) {
      mount(pending);
    } else if (panel && !panel.isConnected) {
      cancel();
      panel = null;
      blocks = [];
      index = 0;
    }
  }

  new MutationObserver(scan).observe(app, {
    childList: true,
    subtree: true
  });

  addEventListener("pagehide", cancel);
  addEventListener("beforeunload", cancel);

  scan();
})();