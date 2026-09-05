(() => {
  const app = document.getElementById("app");
  if (!app) return;

  function language() {
    const u = new URL(location.href);
    return u.searchParams.get("lang") || document.documentElement.lang || "en";
  }

  function labels(lang) {
    if (lang === "tr") {
      return {
        copy: "📋 Hikâyeyi Kopyala",
        copied: "✓ Kopyalandı",
        failed: "Kopyalanamadı"
      };
    }
    return {
      copy: "📋 Copy Story",
      copied: "✓ Copied",
      failed: "Copy failed"
    };
  }

  function storyText() {
    const story = app.querySelector(".story-content");
    if (!story) return "";

    const clone = story.cloneNode(true);

    clone.querySelectorAll([
      "figure",
      "figcaption",
      "img",
      "picture",
      "video",
      "audio",
      "button",
      "script",
      "style",
      ".story-media",
      ".media-card",
      ".media-figure",
      ".media-gallery",
      ".media-slot",
      ".media-caption",
      ".hcu-media",
      "[data-media]"
    ].join(",")).forEach(el => el.remove());

    return (clone.innerText || clone.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();

    if (!ok) throw new Error("copy failed");
  }

  function addButton(panel) {
    if (!panel || panel.querySelector("[data-copy-story]")) return;

    const controls = panel.querySelector(".narrator-controls");
    if (!controls) return;

    const lang = language();
    const t = labels(lang);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "narrator-button";
    button.dataset.copyStory = "1";
    button.textContent = t.copy;
    button.setAttribute("aria-label", t.copy);

    button.addEventListener("click", async () => {
      const text = storyText();
      if (!text) {
        button.textContent = t.failed;
        setTimeout(() => { button.textContent = t.copy; }, 1600);
        return;
      }

      try {
        await writeClipboard(text);
        button.textContent = t.copied;
        button.classList.add("copy-success");
      } catch (_) {
        button.textContent = t.failed;
      }

      setTimeout(() => {
        button.textContent = t.copy;
        button.classList.remove("copy-success");
      }, 1800);
    });

    controls.appendChild(button);
  }

  function scan() {
    app.querySelectorAll(".narrator-player").forEach(addButton);
  }

  new MutationObserver(scan).observe(app, {
    childList: true,
    subtree: true
  });

  scan();
})();