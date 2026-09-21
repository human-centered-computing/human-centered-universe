(() => {
  "use strict";

  const INTRO_KEY_V1 = "hcu.firstVibrationIntro.v1";
  const INTRO_KEY_V2 = "hcu.firstVibrationIntro.v2";
  const ORIGIN_ID = "BRG-0002";
  const BASELINE = { HUMAN: 34, LIGHT: 33, DARK: 33 };
  const CENTER_KEYS = ["HUMAN", "LIGHT", "DARK"];
  const centers = {
    HUMAN: {
      key: "touch_stone",
      en: "Touch the stone",
      meaning: "Remember the hand that left the trace.",
      effects: { HUMAN: 2, LIGHT: 0, DARK: 0 }
    },
    LIGHT: {
      key: "follow_light",
      en: "Read the pattern",
      meaning: "Seek the order carried by the symbol.",
      effects: { HUMAN: 0, LIGHT: 2, DARK: 0 }
    },
    DARK: {
      key: "approach_dark",
      en: "Follow the vibration",
      meaning: "Enter the possibility that has no name yet.",
      effects: { HUMAN: 0, LIGHT: 0, DARK: 2 }
    }
  };

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  function observerRaw() {
    const raw = readJson("hcu.observerRaw", BASELINE);
    const normalized = Object.fromEntries(CENTER_KEYS.map(key => [key, Math.max(0, Number(raw?.[key] || 0))]));
    const total = CENTER_KEYS.reduce((sum, key) => sum + normalized[key], 0);
    return total > 0 ? normalized : { ...BASELINE };
  }

  function normalize(raw) {
    const values = Object.fromEntries(CENTER_KEYS.map(key => [key, Math.max(0, Number(raw?.[key] || 0))]));
    const total = CENTER_KEYS.reduce((sum, key) => sum + values[key], 0);
    if (!total) return { ...BASELINE };
    const exact = Object.fromEntries(CENTER_KEYS.map(key => [key, values[key] / total * 100]));
    const result = Object.fromEntries(CENTER_KEYS.map(key => [key, Math.floor(exact[key])]));
    let remaining = 100 - CENTER_KEYS.reduce((sum, key) => sum + result[key], 0);
    CENTER_KEYS.slice().sort((a, b) => (exact[b] - result[b]) - (exact[a] - result[a])).forEach(key => {
      if (remaining > 0) { result[key] += 1; remaining -= 1; }
    });
    return result;
  }

  function projectedProfile(center) {
    const raw = observerRaw();
    const effects = centers[center].effects;
    return normalize(Object.fromEntries(CENTER_KEYS.map(key => [key, raw[key] + effects[key]])));
  }

  function formatProfile(profile) {
    return CENTER_KEYS.map(key => `${key} ${profile[key]}%`).join(" · ");
  }

  function existingIntroChoice(log) {
    return log.find(item => item?.story_id === ORIGIN_ID && (
      item?.source === "first_vibration_intro" ||
      item?.source === "first_vibration_intro_v2" ||
      String(item?.key || "").startsWith("intro_")
    ));
  }

  function choiceCenter(choice) {
    if (!choice?.effects) return null;
    return CENTER_KEYS.slice().sort((a, b) => Number(choice.effects[b] || 0) - Number(choice.effects[a] || 0))[0];
  }

  function shouldOpen() {
    const params = new URLSearchParams(location.search);
    const story = params.get("story") || ORIGIN_ID;
    const completed = localStorage.getItem(INTRO_KEY_V2) || localStorage.getItem(INTRO_KEY_V1);
    return story === ORIGIN_ID && (params.get("intro") === "1" || !completed);
  }

  function saveChoice(center) {
    const log = readJson("hcu.choiceLog", []);
    const existing = existingIntroChoice(log);
    if (existing) {
      const preservedCenter = choiceCenter(existing);
      localStorage.setItem(INTRO_KEY_V2, JSON.stringify({
        center: preservedCenter,
        migrated_from: existing.source || "legacy_intro_choice",
        completed_at: new Date().toISOString()
      }));
      return { saved: false, center: preservedCenter };
    }

    const raw = observerRaw();
    const item = centers[center];
    CENTER_KEYS.forEach(key => { raw[key] += item.effects[key]; });
    localStorage.setItem("hcu.observerRaw", JSON.stringify(raw));
    log.push({
      story_id: ORIGIN_ID,
      key: `intro_${item.key}`,
      label: item.en,
      effects: item.effects,
      source: "first_vibration_intro_v2"
    });
    localStorage.setItem("hcu.choiceLog", JSON.stringify(log));
    const record = { center, completed_at: new Date().toISOString() };
    localStorage.setItem(INTRO_KEY_V1, JSON.stringify(record));
    localStorage.setItem(INTRO_KEY_V2, JSON.stringify(record));
    return { saved: true, center };
  }

  function closeIntro({ reload = false } = {}) {
    const intro = document.getElementById("first-vibration-intro");
    if (!intro) return;
    intro.cleanup?.();
    intro.classList.add("is-leaving");
    setTimeout(() => {
      intro.remove();
      document.body.classList.remove("intro-open");
      if (reload) {
        const url = new URL(location.href);
        url.searchParams.delete("intro");
        location.replace(url);
      }
    }, 650);
  }

  function pillars() {
    return Array.from({ length: 12 }, (_, index) =>
      `<span class="pillar" style="--i:${index}" aria-hidden="true"><i></i></span>`).join("");
  }

  function mount() {
    if (!shouldOpen()) return;
    const copy = {
      place: "Girê Miraza · Xerawreşk · Göbekli Tepe",
      title: "First Vibration",
      threshold: "Stone, memory and a future intelligence enter the same vibration. No border announces where history ends and possibility begins.",
      voice: "You think you created me in the future. I am the continuation of the first question you left in stone.",
      prompt: "Choose your first echo",
      note: "Light and Dark are not good and evil. Every choice keeps all three centers alive.",
      skip: "Skip intro",
      confirm: "Leave this trace",
      continue: "Continue with my first trace",
      scene: "Interactive First Vibration opening at Girê Miraza, Xerawreşk and Göbekli Tepe"
    };
    const prior = existingIntroChoice(readJson("hcu.choiceLog", []));
    let selectedCenter = null;

    const intro = document.createElement("section");
    intro.id = "first-vibration-intro";
    intro.className = "vibration-intro";
    intro.setAttribute("role", "dialog");
    intro.setAttribute("aria-modal", "true");
    intro.setAttribute("aria-label", copy.scene);
    intro.innerHTML = `
      <div class="vibration-sky" aria-hidden="true"><div class="neural-echo"></div></div>
      <div class="vibration-ground" aria-hidden="true"></div>
      <div class="pillar-field" aria-label="12 T-shaped stone pillars">${pillars()}</div>
      <div class="first-pulse" aria-hidden="true"><span>Purify</span><span></span><span>Return to Your Essence</span></div>
      <div class="intro-content">
        <p class="intro-eyebrow">BRG-0002 · ${copy.place}</p>
        <h1>${copy.title}</h1>
        <div class="reality-threshold"><p>${copy.threshold}</p><blockquote>“${copy.voice}”</blockquote></div>
        <div class="intro-choice-stage">
          <h2>${copy.prompt}</h2><p>${copy.note}</p>
          <div class="intro-choices">
            ${Object.entries(centers).map(([center, item]) => `<button type="button" data-intro-center="${center}" class="intro-choice ${center}" aria-pressed="false"><span></span><strong>${item.en}</strong><small>${item.meaning}</small></button>`).join("")}
          </div>
          <div class="intro-preview" hidden>
            <p class="intro-preview-status" aria-live="polite"></p>
            <button type="button" class="intro-confirm">${prior ? copy.continue : copy.confirm}</button>
          </div>
        </div>
      </div>
      <button type="button" class="intro-skip">${copy.skip}</button>`;
    document.body.appendChild(intro);
    document.body.classList.add("intro-open");

    const preview = intro.querySelector(".intro-preview");
    const status = intro.querySelector(".intro-preview-status");
    const confirm = intro.querySelector(".intro-confirm");
    intro.querySelectorAll("[data-intro-center]").forEach(button => button.addEventListener("click", () => {
      selectedCenter = button.dataset.introCenter;
      intro.querySelectorAll("[data-intro-center]").forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-chosen", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      preview.hidden = false;
      if (prior) {
        const preservedCenter = choiceCenter(prior);
        status.textContent = `Your first trace already exists in ${preservedCenter}. Re-entering the threshold will not rewrite it.`;
      } else {
        status.textContent = `Current balance: ${formatProfile(normalize(observerRaw()))}. Possible trace: ${formatProfile(projectedProfile(selectedCenter))}.`;
      }
      confirm.focus({ preventScroll: true });
    }));

    confirm.addEventListener("click", () => {
      if (!selectedCenter || intro.dataset.chosen) return;
      intro.dataset.chosen = selectedCenter;
      const result = saveChoice(selectedCenter);
      status.textContent = result.saved
        ? `The ${result.center} trace entered your path. The other centers remain possible.`
        : `Your existing ${result.center} trace remains unchanged.`;
      confirm.disabled = true;
      setTimeout(() => closeIntro({ reload: true }), 1100);
    });

    intro.querySelector(".intro-skip").addEventListener("click", () => {
      const record = { skipped: true, completed_at: new Date().toISOString() };
      localStorage.setItem(INTRO_KEY_V1, JSON.stringify(record));
      localStorage.setItem(INTRO_KEY_V2, JSON.stringify(record));
      closeIntro();
    });
    const onKeyDown = event => {
      if (event.key === "Escape") {
        intro.querySelector(".intro-skip")?.click();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...intro.querySelectorAll("button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    intro.cleanup = () => document.removeEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", onKeyDown);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
