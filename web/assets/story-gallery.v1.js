(() => {
  const app = document.getElementById("app");
  if (!app) return;

  let data = null;
  let scheduled = false;

  function currentContext() {
    const url = new URL(window.location.href);
    return {
      mode: url.searchParams.get("mode") || "read",
      story: url.searchParams.get("story") || "",
      lang: url.searchParams.get("lang") || document.documentElement.lang || "en"
    };
  }

  function buildGallery(story, lang) {
    const items = Array.isArray(story?.story_gallery) ? story.story_gallery : [];
    if (!items.length) return null;

    const root = document.createElement("section");
    root.className = "story-slide-gallery";
    root.dataset.storyGallery = story.id;
    root.setAttribute("aria-label", lang === "tr" ? "Hikâye görselleri" : "Story visuals");

    const stage = document.createElement("div");
    stage.className = "story-slide-stage";

    const slides = items.map((item, index) => {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt?.[lang] || item.alt?.en || "";
      img.loading = index === 0 ? "eager" : "lazy";
      img.decoding = "async";
      img.className = index === 0 ? "active" : "";
      img.dataset.slideIndex = String(index);
      stage.appendChild(img);
      return img;
    });

    root.appendChild(stage);

    if (slides.length > 1) {
      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "story-slide-nav prev";
      prev.textContent = "‹";
      prev.setAttribute("aria-label", lang === "tr" ? "Önceki görsel" : "Previous image");

      const next = document.createElement("button");
      next.type = "button";
      next.className = "story-slide-nav next";
      next.textContent = "›";
      next.setAttribute("aria-label", lang === "tr" ? "Sonraki görsel" : "Next image");

      stage.append(prev, next);

      const dots = document.createElement("div");
      dots.className = "story-slide-dots";
      const dotButtons = slides.map((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = i === 0 ? "active" : "";
        b.setAttribute("aria-label", `${lang === "tr" ? "Görsel" : "Image"} ${i + 1}`);
        dots.appendChild(b);
        return b;
      });
      root.appendChild(dots);

      let index = 0;
      const show = nextIndex => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((img, i) => img.classList.toggle("active", i === index));
        dotButtons.forEach((b, i) => b.classList.toggle("active", i === index));
      };

      prev.addEventListener("click", () => show(index - 1));
      next.addEventListener("click", () => show(index + 1));
      dotButtons.forEach((b, i) => b.addEventListener("click", () => show(i)));

      const timer = window.setInterval(() => {
        if (!root.isConnected) {
          window.clearInterval(timer);
          return;
        }
        show(index + 1);
      }, 5000);
    }

    return root;
  }

  function applyGallery() {
    scheduled = false;
    if (!data) return;

    const ctx = currentContext();
    if (ctx.mode !== "read" || !ctx.story) return;

    const card = app.querySelector(".reader-card");
    const profile = card?.querySelector(".story-profile");
    if (!card || !profile) return;

    if (card.querySelector(`[data-story-gallery="${CSS.escape(ctx.story)}"]`)) return;
    card.querySelector(".story-slide-gallery")?.remove();

    const story = data.stories?.find(item => item.id === ctx.story);
    const gallery = buildGallery(story, ctx.lang);
    if (!gallery) return;

    const hero = card.querySelector(".story-hero");
    if (hero) hero.replaceWith(gallery);
    else profile.insertAdjacentElement("afterend", gallery);
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(applyGallery);
  }

  new MutationObserver(scheduleApply).observe(app, { childList: true, subtree: true });

  fetch("./data/universe.json", { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error(`Universe data could not be loaded: ${response.status}`);
      return response.json();
    })
    .then(json => {
      data = json;
      scheduleApply();
    })
    .catch(error => console.warn("Story gallery disabled:", error));
})();
