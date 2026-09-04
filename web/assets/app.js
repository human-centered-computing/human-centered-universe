const state = {
  data: null,
  locale: "en",
  mode: "read",
  storyId: null,
  readIds: new Set(JSON.parse(localStorage.getItem("hcu.readIds") || "[]"))
};

const app = document.getElementById("app");
const languageSelect = document.getElementById("language-select");
const githubLink = document.getElementById("github-link");
const modeButtons = [...document.querySelectorAll(".mode-button")];

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(value) {
  let s = escapeHtml(value);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/`(.+?)`/g, "<code>$1</code>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return s;
}

function markdownToHtml(md = "") {
  const lines = md.replace(/\r/g, "").split("\n");
  const out = [];
  let para = [];

  const flush = () => {
    if (!para.length) return;
    out.push(`<p>${inlineMarkdown(para.join(" "))}</p>`);
    para = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    if (line.startsWith("# ")) {
      flush(); out.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`); continue;
    }
    if (line.startsWith("## ")) {
      flush(); out.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`); continue;
    }
    if (line.startsWith("### ")) {
      flush(); out.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`); continue;
    }
    if (line.startsWith("> ")) {
      flush(); out.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`); continue;
    }
    para.push(line.trim());
  }
  flush();
  return out.join("\n");
}

function t(key, fallback = key) {
  return state.data?.locales?.[state.locale]?.[key]
    || state.data?.locales?.en?.[key]
    || fallback;
}

function storyById(id) {
  return state.data.stories.find(s => s.id === id);
}

function sortedStories() {
  return [...state.data.stories].sort((a,b) =>
    (a.book_order ?? 9999) - (b.book_order ?? 9999) || a.id.localeCompare(b.id)
  );
}

function liveOrderedStories() {
  return sortedStories().filter(s => (s.book_order ?? 9999) < 9999);
}

function currentStory() {
  return storyById(state.storyId) || sortedStories()[0];
}

function coreLabel(core) {
  if (core === "LIGHT") return t("light_center", "Light Center");
  if (core === "DARK") return t("dark_center", "Dark Center");
  if (core === "COMMON") return t("common_center", "Common Center");
  return t("bridge", "Bridge");
}

function setUrl() {
  const url = new URL(location.href);
  url.searchParams.set("mode", state.mode);
  if (state.storyId) url.searchParams.set("story", state.storyId);
  url.searchParams.set("lang", state.locale);
  history.replaceState({}, "", url);
}

function setMode(mode) {
  state.mode = mode;
  modeButtons.forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  setUrl();
  render();
}

function setStory(id) {
  if (!storyById(id)) return;
  state.storyId = id;
  localStorage.setItem("hcu.lastStory", id);
  state.mode = "read";
  modeButtons.forEach(b => b.classList.toggle("active", b.dataset.mode === "read"));
  setUrl();
  render();
  window.scrollTo({top: 0, behavior: "smooth"});
}

function translationStatus(story, lang) {
  const status = story.translations?.[lang]?.status;
  if (!status) return "";
  if (status === "canonical") return t("canonical", "Canonical");
  if (status === "reviewed") return t("reviewed_translation", "Reviewed Translation");
  if (status === "community") return t("community_translation", "Community Translation");
  return status;
}

function markRead(id) {
  if (state.readIds.has(id)) state.readIds.delete(id);
  else state.readIds.add(id);
  localStorage.setItem("hcu.readIds", JSON.stringify([...state.readIds]));
  render();
}

function renderRead() {
  const stories = sortedStories();
  const story = currentStory();
  state.storyId = story.id;

  const canonStories = liveOrderedStories();
  const canonIndex = canonStories.findIndex(s => s.id === story.id);
  const prev = canonIndex > 0 ? canonStories[canonIndex - 1] : null;
  const next = canonIndex >= 0 && canonIndex < canonStories.length - 1 ? canonStories[canonIndex + 1] : null;
  const progress = canonIndex >= 0 && canonStories.length
    ? Math.round(((canonIndex + 1) / canonStories.length) * 100)
    : 0;

  const requestedContent = story.content?.[state.locale];
  const content = requestedContent || story.content?.en || "";
  const fallback = !requestedContent && state.locale !== "en";

  const related = (story.links || [])
    .map(link => ({link, story: storyById(link.target)}))
    .filter(x => x.story);

  const list = canonStories.map(s => `
    <button class="${s.id === story.id ? "current" : ""} ${state.readIds.has(s.id) ? "done" : ""}"
      data-story="${s.id}">
      <small>${escapeHtml(s.id)}</small><br>
      ${escapeHtml(storyTitle(s))}
    </button>
  `).join("");

  const connections = related.length ? related.map(({link, story: target}) => `
    <button class="connection" data-story="${target.id}">
      <span class="badge ${target.core}">${escapeHtml(linkTypeLabel(link.type))}</span>
      <strong>${escapeHtml(storyTitle(target))}</strong>
      <small>${escapeHtml(linkNote(story, link))}</small>
    </button>
  `).join("") : `<p class="muted">${t("no_results", "No matching stories.")}</p>`;

  app.innerHTML = `
    <section class="reader-layout">
      <aside class="side-card">
        <strong>${t("book_progress", "Canon progress")}</strong>
        <div class="progress"><span style="width:${progress}%"></span></div>
        <div class="story-list">${list}</div>
      </aside>

      <article class="reader-card">
        ${fallback ? `<div class="fallback">${t("translation_unavailable")}</div>` : ""}
        <div class="story-kicker">
          <span class="badge ${story.core}">${coreLabel(story.core)}</span>
          <span>${escapeHtml(story.id)}</span>
          <span>·</span>
          <span>${translationStatus(story, requestedContent ? state.locale : "en")}</span>
        </div>

        <div class="story-content">${markdownToHtml(content)}</div>

        <div class="reader-toolbar">
          <button class="action-button" id="prev-story" ${!prev ? "disabled" : ""}>
            ← ${t("previous", "Previous")}
          </button>
          <button class="action-button ${state.readIds.has(story.id) ? "" : "primary"}" id="mark-read">
            ${state.readIds.has(story.id) ? t("read_again", "Read again") : t("mark_read", "Mark as read")}
          </button>
          <button class="action-button" id="next-story" ${!next ? "disabled" : ""}>
            ${t("next", "Next")} →
          </button>
        </div>
      </article>

      <aside class="side-card">
        <strong>${t("story_connections", "Story connections")}</strong>
        <div class="connection-list">${connections}</div>
      </aside>
    </section>
  `;

  app.querySelectorAll("[data-story]").forEach(el =>
    el.addEventListener("click", () => setStory(el.dataset.story))
  );
  document.getElementById("prev-story")?.addEventListener("click", () => prev && setStory(prev.id));
  document.getElementById("next-story")?.addEventListener("click", () => next && setStory(next.id));
  document.getElementById("mark-read")?.addEventListener("click", () => markRead(story.id));
}

function renderExplore() {
  const cores = ["LIGHT","COMMON","DARK"];
  const coreCards = cores.map(core => {
    const data = localizedCore(core);
    const desc = data.description || (data.principles ? data.principles.join(" · ") : "");
    return `
      <article class="core-card ${core}">
        <span class="badge ${core}">${escapeHtml(coreLabel(core))}</span>
        <h2>${escapeHtml(data.name || coreLabel(core))}</h2>
        <p>${escapeHtml(desc)}</p>
      </article>
    `;
  }).join("");

  const nodeCard = s => `
    <article class="story-node" data-story="${s.id}">
      <span class="node-id">${escapeHtml(s.id)}</span>
      <span class="badge ${s.core}">${coreLabel(s.core)}</span>
      <h3>${escapeHtml(storyTitle(s))}</h3>
      <p>${escapeHtml(storySummary(s))}</p>
    </article>
  `;

  const sections = ["BRIDGE","LIGHT","COMMON","DARK"].map(core => {
    const stories = sortedStories().filter(s => s.core === core);
    if (!stories.length) return "";
    return `
      <section class="node-section" data-section="${core}">
        <h2><span class="badge ${core}">${coreLabel(core)}</span></h2>
        <div class="node-grid">${stories.map(nodeCard).join("")}</div>
      </section>
    `;
  }).join("");

  app.innerHTML = `
    <section>
      <div class="explore-head">
        <div>
          <h1>${t("explore", "Explore")}</h1>
          <p>${t("story_connections", "Story connections")}: ${coreLabel("LIGHT")} · ${coreLabel("DARK")} · ${coreLabel("COMMON")} · ${t("bridge", "Bridge")}</p>
        </div>
        <input id="story-search" class="search-box" type="search" placeholder="${t("search", "Search stories")}">
      </div>
      <div class="core-grid">${coreCards}</div>
      <div id="node-sections">${sections}</div>
    </section>
  `;

  app.querySelectorAll("[data-story]").forEach(el =>
    el.addEventListener("click", () => setStory(el.dataset.story))
  );

  document.getElementById("story-search").addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".story-node").forEach(node => {
      const id = node.dataset.story;
      const s = storyById(id);
      const hay = `${s.id} ${storyTitle(s)} ${storySummary(s)} ${s.title || ""} ${s.summary || ""}`.toLowerCase();
      node.style.display = !q || hay.includes(q) ? "" : "none";
    });
  });
}

function renderCreate() {
  const repo = state.data.repository;
  app.innerHTML = `
    <section>
      <div class="explore-head">
        <div>
          <h1>${t("create", "Create")}</h1>
          <p>${t("create_intro")}</p>
        </div>
      </div>
      <div class="create-grid">
        <article class="create-card">
          <h2>${t("open_repository", "Open repository")}</h2>
          <p>GitHub is the production space of the universe. Commits preserve contribution history; branches preserve possibilities.</p>
          <div class="create-actions">
            <a class="action-button primary" href="${repo}" target="_blank" rel="noopener">${t("open_repository")}</a>
            <a class="action-button" href="${repo}/fork" target="_blank" rel="noopener">${t("fork_universe")}</a>
          </div>
        </article>
        <article class="create-card">
          <h2>${t("contribution_guide", "Contribution guide")}</h2>
          <p>Translations remain the same story ID. Cultural reinterpretations become new nodes connected to the universe.</p>
          <div class="create-actions">
            <a class="action-button primary" href="${repo}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">${t("contribution_guide")}</a>
            <a class="action-button" href="${repo}/issues" target="_blank" rel="noopener">${t("issues", "Issues")}</a>
          </div>
        </article>
      </div>
    </section>
  `;
}

function render() {
  if (!state.data) return;
  updateStaticUi();
  if (state.mode === "explore") renderExplore();
  else if (state.mode === "create") renderCreate();
  else renderRead();
  setUrl();
}

async function boot() {
  const response = await fetch("./data/universe.json", {cache: "no-store"});
  if (!response.ok) throw new Error("Universe data could not be loaded.");
  state.data = await response.json();
  githubLink.href = state.data.repository;

  const params = new URLSearchParams(location.search);
  const storedLang = localStorage.getItem("hcu.lang");
  const initialLang = params.get("lang") || storedLang || state.data.canonical_language || "en";
  state.locale = state.data.locales[initialLang] ? initialLang : "en";

  languageSelect.innerHTML = Object.entries(state.data.locales)
    .map(([code, locale]) => `<option value="${code}">${escapeHtml(locale.language_name || code)}</option>`)
    .join("");
  languageSelect.value = state.locale;
  languageSelect.addEventListener("change", () => {
    state.locale = languageSelect.value;
    localStorage.setItem("hcu.lang", state.locale);
    render();
  });

  const requestedStory = params.get("story");
  const lastStory = localStorage.getItem("hcu.lastStory");
  state.storyId = storyById(requestedStory)?.id
    || storyById(lastStory)?.id
    || sortedStories()[0]?.id;

  const requestedMode = params.get("mode");
  state.mode = ["read","explore","create"].includes(requestedMode) ? requestedMode : "read";

  modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  updateStaticUi();
  render();
}

boot().catch(error => {
  console.error(error);
  app.innerHTML = `<section class="empty-card">${escapeHtml(error.message)}</section>`;
});
