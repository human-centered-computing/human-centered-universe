/*
 * Human-Centered Universe
 * Runtime localization hotfix v0.5.2
 *
 * Loaded before app.js. These helpers are intentionally declared as classic
 * global functions because app.js calls them at render time.
 */

function storyTitle(story) {
  const content = story?.content?.[state.locale];
  if (content) {
    const match = content.match(/^#\s+(.+)$/m);
    if (match) return match[1].trim();
  }

  return story?.localized?.[state.locale]?.title
    || (state.locale === "tr" ? story?.original_title : null)
    || story?.title
    || story?.id
    || "";
}

function storySummary(story) {
  return story?.localized?.[state.locale]?.summary
    || story?.summary
    || "";
}

function linkNote(sourceStory, link) {
  return sourceStory?.localized?.[state.locale]?.link_notes?.[link.target]
    || link?.note
    || "";
}

function linkTypeLabel(type) {
  return t(`link_${type}`, type);
}

function localizedCore(core) {
  const data = state.data?.cores?.[core] || {};
  const local = data.localized?.[state.locale] || {};

  return {
    ...data,
    name: local.name || data.name || coreLabel(core),
    principles: local.principles || data.principles || [],
    shadow: local.shadow || data.shadow || []
  };
}

function updateStaticUi() {
  document.documentElement.lang = state.locale;

  const projectName = t("project_name", "Human-Centered Universe");
  document.title = projectName;

  const brandTitle = document.querySelector(".brand strong");
  if (brandTitle) brandTitle.textContent = projectName;

  modeButtons.forEach(button => {
    button.textContent = t(button.dataset.mode, button.textContent);
  });

  const liveStatus = document.getElementById("live-status");
  if (liveStatus) {
    liveStatus.textContent = t("live_canon", "Live canon");
  }

  if (languageSelect) {
    languageSelect.setAttribute("aria-label", t("language", "Language"));
  }

  const footerSpans = document.querySelectorAll("footer span");
  if (footerSpans[0]) footerSpans[0].textContent = projectName;
  if (footerSpans[2]) {
    footerSpans[2].textContent = t(
      "creation_unfinished",
      "Creation is unfinished."
    );
  }
}
