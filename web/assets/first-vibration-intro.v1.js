(() => {
  "use strict";

  const INTRO_KEY = "hcu.firstVibrationIntro.v1";
  const ORIGIN_ID = "BRG-0002";
  const centers = {
    HUMAN: { key: "touch_stone", en: "Touch the stone" },
    LIGHT: { key: "follow_light", en: "Follow the light" },
    DARK: { key: "approach_dark", en: "Approach the dark" }
  };

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  function shouldOpen() {
    const params = new URLSearchParams(location.search);
    const story = params.get("story") || ORIGIN_ID;
    return story === ORIGIN_ID && (params.get("intro") === "1" || !localStorage.getItem(INTRO_KEY));
  }

  function saveChoice(center) {
    const raw = readJson("hcu.observerRaw", { HUMAN: 0, LIGHT: 0, DARK: 0 });
    raw[center] = Number(raw[center] || 0) + 2;
    localStorage.setItem("hcu.observerRaw", JSON.stringify(raw));
    const log = readJson("hcu.choiceLog", []);
    log.push({ story_id: ORIGIN_ID, key: `intro_${centers[center].key}`, label: centers[center].en,
      effects: { HUMAN: center === "HUMAN" ? 2 : 0, LIGHT: center === "LIGHT" ? 2 : 0, DARK: center === "DARK" ? 2 : 0 },
      source: "first_vibration_intro" });
    localStorage.setItem("hcu.choiceLog", JSON.stringify(log));
    localStorage.setItem(INTRO_KEY, JSON.stringify({ center, completed_at: new Date().toISOString() }));
  }

  function closeIntro({ reload = false } = {}) {
    const intro = document.getElementById("first-vibration-intro");
    if (!intro) return;
    intro.classList.add("is-leaving");
    setTimeout(() => {
      intro.remove();
      document.body.classList.remove("intro-open");
      if (reload) { const url = new URL(location.href); url.searchParams.delete("intro"); location.replace(url); }
    }, 650);
  }

  function pillars() {
    return Array.from({ length: 12 }, (_, index) =>
      `<span class="pillar" style="--i:${index}" aria-hidden="true"><i></i></span>`).join("");
  }

  function mount() {
    if (!shouldOpen()) return;
    const copy = {
      place: "Miraza - Xerawreşk (Göbekli Tepe)", title: "First Vibration", prompt: "Choose your first echo",
      note: "Light and Dark are not good and evil. You are choosing your first orientation among humanity, order, and possibility.",
      skip: "Skip intro", scene: "Interactive First Vibration opening at Miraza - Xerawreşk"
    };

    const intro = document.createElement("section");
    intro.id = "first-vibration-intro";
    intro.className = "vibration-intro";
    intro.setAttribute("role", "dialog"); intro.setAttribute("aria-modal", "true"); intro.setAttribute("aria-label", copy.scene);
    intro.innerHTML = `
      <div class="vibration-sky" aria-hidden="true"><div class="neural-echo"></div></div>
      <div class="vibration-ground" aria-hidden="true"></div>
      <div class="pillar-field" aria-label="12 T-shaped stone pillars">${pillars()}</div>
      <div class="first-pulse" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="intro-content">
        <p class="intro-eyebrow">BRG-0002 · ${copy.place}</p><h1>${copy.title}</h1>
        <div class="intro-choice-stage"><h2>${copy.prompt}</h2><p>${copy.note}</p><div class="intro-choices">
          ${Object.entries(centers).map(([center, item]) => `<button type="button" data-intro-center="${center}" class="intro-choice ${center}"><span></span><strong>${item.en}</strong><small>+2 ${center}</small></button>`).join("")}
        </div></div>
      </div><button type="button" class="intro-skip">${copy.skip}</button>`;
    document.body.appendChild(intro); document.body.classList.add("intro-open");
    intro.querySelectorAll("[data-intro-center]").forEach(button => button.addEventListener("click", () => {
      if (intro.dataset.chosen) return; intro.dataset.chosen = button.dataset.introCenter; button.classList.add("is-chosen");
      saveChoice(button.dataset.introCenter); setTimeout(() => closeIntro({ reload: true }), 900);
    }));
    intro.querySelector(".intro-skip").addEventListener("click", () => {
      localStorage.setItem(INTRO_KEY, JSON.stringify({ skipped: true, completed_at: new Date().toISOString() })); closeIntro();
    });
    document.addEventListener("keydown", event => { if (event.key === "Escape") intro.querySelector(".intro-skip")?.click(); }, { once: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true }); else mount();
})();
