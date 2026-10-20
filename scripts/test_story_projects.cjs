const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../web/assets/story-projects.v1.js"), "utf8");
const sandbox = { window: {}, URL };
vm.runInNewContext(source, sandbox, { filename: "story-projects.v1.js" });
const { normalizeGitHubRepoUrl, renderStoryProjects } = sandbox.window.HCUStoryProjects;
const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const translate = (key, fallback) => ({ story_projects_heading: "İlgili Bilişim Projeleri", open_github_project: "GitHub'da Aç" }[key] || fallback);
assert.equal(normalizeGitHubRepoUrl("https://github.com/human-centered-computing/human-centered-universe"), "https://github.com/human-centered-computing/human-centered-universe");
for (const url of ["http://github.com/owner/repo", "https://evil.example/owner/repo", "https://github.com/owner/repo/tree/main", "https://github.com/owner/repo?x=1", "https://github.com/owner/repo#heading", "https://github.com/owner", "javascript:alert(1)"]) {
  assert.equal(normalizeGitHubRepoUrl(url), null, url);
}
assert.equal(renderStoryProjects({ projects: [] }, "tr", translate, escapeHtml), "");
assert.equal(renderStoryProjects({}, "tr", translate, escapeHtml), "");
assert.equal(renderStoryProjects({ projects: [{ name: "No repo", github_url: "https://example.org/foo" }] }, "tr", translate, escapeHtml), "");
const story = { projects: [
  { name: "Next Example", github_url: "https://github.com/owner/project", description: { tr: "Açıklama", en: "Description" } },
  { name: "Duplicated", github_url: "https://github.com/owner/project" },
  { name: '<img src=x onerror=alert(1)>', github_url: "https://github.com/owner/other" }
]};
const html = renderStoryProjects(story, "tr", translate, escapeHtml);
assert.match(html, /İlgili Bilişim Projeleri/);
assert.match(html, /Açıklama/);
assert.match(html, /GitHub'da Aç/);
assert.match(html, /target="_blank" rel="noopener noreferrer"/);
assert.equal((html.match(/class="story-project-link"/g) || []).length, 2);
assert.doesNotMatch(html, /<img/);
assert.match(html, /&lt;img/);
assert.match(renderStoryProjects(story, "de", translate, escapeHtml), /Description/);
console.log("OK: story GitHub project links render, deduplicate and reject unsafe URLs.");
