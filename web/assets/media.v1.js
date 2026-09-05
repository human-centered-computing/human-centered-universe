(() => {
  const app = document.getElementById("app");
  if (!app) return;

  const MEDIA_MANIFEST = "./assets/photos/gobekli-tepe/manifest.json";
  const MEDIA_ROOT = "./assets/photos/gobekli-tepe/";
  let manifest = null;
  let scheduled = false;

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalize(value = "") {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function currentContext() {
    const url = new URL(window.location.href);
    return {
      mode: url.searchParams.get("mode") || "read",
      story: url.searchParams.get("story") || "",
      lang: url.searchParams.get("lang") || document.documentElement.lang || "en"
    };
  }

  function buildFigure(storyId, placement, photo, lang) {
    const figure = document.createElement("figure");
    figure.className = "story-media-figure";
    figure.dataset.mediaId = `${storyId}:${placement.photo}:${lang}`;

    const link = document.createElement("a");
    link.className = "story-media-link";
    link.href = MEDIA_ROOT + photo.filename;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", photo.alt?.[lang] || photo.alt?.en || placement.caption || "Field photograph");

    const img = document.createElement("img");
    img.src = MEDIA_ROOT + photo.filename;
    img.alt = photo.alt?.[lang] || photo.alt?.en || "";
    img.loading = "lazy";
    img.decoding = "async";
    link.appendChild(img);

    const caption = document.createElement("figcaption");
    const label = document.createElement("span");
    label.className = "story-media-label";
    label.textContent = placement.label || (lang === "tr" ? "GERÇEK SAHA FOTOĞRAFI" : "REAL FIELD PHOTOGRAPH");

    const text = document.createElement("span");
    text.className = "story-media-caption";
    text.innerHTML = escapeHtml(placement.caption || "");

    caption.append(label, text);
    figure.append(link, caption);
    return figure;
  }

  function applyStoryMedia() {
    scheduled = false;
    if (!manifest) return;

    const context = currentContext();
    if (context.mode !== "read" || !context.story) return;

    const storyContent = app.querySelector(".story-content");
    if (!storyContent) return;

    const storyPlacements = manifest.placements?.[context.story];
    if (!storyPlacements) return;

    const placements = storyPlacements[context.lang] || storyPlacements.en || [];
    const paragraphs = [...storyContent.querySelectorAll("p")];

    for (const placement of placements) {
      const mediaId = `${context.story}:${placement.photo}:${context.lang}`;
      if (storyContent.querySelector(`[data-media-id="${CSS.escape(mediaId)}"]`)) continue;

      const targetText = normalize(placement.after_text || "");
      if (!targetText) continue;

      const anchor = paragraphs.find(p => normalize(p.textContent).startsWith(targetText));
      if (!anchor) continue;

      const photo = manifest.photos?.[placement.photo];
      if (!photo?.filename) continue;

      anchor.insertAdjacentElement("afterend", buildFigure(context.story, placement, photo, context.lang));
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(applyStoryMedia);
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(app, { childList: true, subtree: true });

  fetch(MEDIA_MANIFEST, { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error(`Media manifest could not be loaded: ${response.status}`);
      return response.json();
    })
    .then(data => {
      manifest = data;
      scheduleApply();
    })
    .catch(error => {
      console.warn("HCU media layer disabled:", error);
    });
})();
