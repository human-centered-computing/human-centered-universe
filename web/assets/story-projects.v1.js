/* Optional software projects associated with story metadata. */
(() => {
  "use strict";
  function normalizeGitHubRepoUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.hostname !== "github.com" ||
          url.username || url.password || url.port || url.search || url.hash) return null;
      const match = url.pathname.match(/^\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]+)\/?$/);
      if (!match || match[1].endsWith("-") || match[2] === "." || match[2] === "..") return null;
      return "https://github.com/" + match[1] + "/" + match[2];
    } catch {
      return null;
    }
  }
  function localized(value, language) {
    if (typeof value === "string") return value.trim();
    if (!value || typeof value !== "object" || Array.isArray(value)) return "";
    const result = value[language] || value.en || value.tr || "";
    return typeof result === "string" ? result.trim() : "";
  }
  function renderStoryProjects(story, language, translate, escapeHtml) {
    if (!Array.isArray(story?.projects)) return "";
    const seen = new Set();
    const cards = [];
    for (const project of story.projects) {
      if (!project || typeof project !== "object") continue;
      const url = normalizeGitHubRepoUrl(project.github_url);
      const name = localized(project.name, language);
      if (!url || !name || seen.has(url.toLowerCase())) continue;
      seen.add(url.toLowerCase());
      const description = localized(project.description, language);
      cards.push(
        '<a class="story-project-link" href="' + escapeHtml(url) +
        '" target="_blank" rel="noopener noreferrer">' +
        '<span class="story-project-body"><strong>' + escapeHtml(name) +
        '</strong>' + (description ? '<small>' + escapeHtml(description) + '</small>' : "") +
        '</span><span class="story-project-action">' +
        escapeHtml(translate("open_github_project", "Open on GitHub")) +
        ' <span aria-hidden="true">↗</span></span></a>'
      );
    }
    if (!cards.length) return "";
    return '<section class="story-projects" aria-labelledby="story-projects-heading">' +
      '<h2 id="story-projects-heading">' +
      escapeHtml(translate("story_projects_heading", "Related software projects")) +
      '</h2><p>' +
      escapeHtml(translate("story_projects_description", "Explore the open-source software connected to this story.")) +
      '</p><div class="story-project-list">' + cards.join("") + '</div></section>';
  }
  window.HCUStoryProjects = Object.freeze({ normalizeGitHubRepoUrl, renderStoryProjects });
})();
