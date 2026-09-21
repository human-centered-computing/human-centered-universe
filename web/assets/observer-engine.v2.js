(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HCUObserverEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CENTERS = ["HUMAN", "LIGHT", "DARK"];
  const BASELINE = Object.freeze({ HUMAN: 34, LIGHT: 33, DARK: 33 });
  const MODEL_VERSION = 2;

  function raw(value) {
    return Object.fromEntries(CENTERS.map(center => [center, Math.max(0, Number(value?.[center] || 0))]));
  }

  function add(a, b) {
    const left = raw(a); const right = raw(b);
    return Object.fromEntries(CENTERS.map(center => [center, left[center] + right[center]]));
  }

  function equal(a, b) {
    const left = raw(a); const right = raw(b);
    return CENTERS.every(center => left[center] === right[center]);
  }

  function normalize(value) {
    const values = raw(value);
    const total = CENTERS.reduce((sum, center) => sum + values[center], 0);
    if (!total) return { ...BASELINE };
    const exact = Object.fromEntries(CENTERS.map(center => [center, values[center] / total * 100]));
    const result = Object.fromEntries(CENTERS.map(center => [center, Math.floor(exact[center])]));
    let remaining = 100 - CENTERS.reduce((sum, center) => sum + result[center], 0);
    [...CENTERS]
      .sort((a, b) => (exact[b] - result[b]) - (exact[a] - result[a]) || CENTERS.indexOf(a) - CENTERS.indexOf(b))
      .slice(0, remaining)
      .forEach(center => result[center]++);
    return result;
  }

  function totalChoiceEffects(choiceLog = []) {
    return choiceLog.reduce((total, entry) => add(total, entry?.effects), { HUMAN: 0, LIGHT: 0, DARK: 0 });
  }

  function migrateObserverRaw(storedRaw, choiceLog = [], storedVersion = 0) {
    if (!storedRaw) return { value: add(BASELINE, totalChoiceEffects(choiceLog)), migrated: true, reason: "reconstructed_from_log" };
    const value = raw(storedRaw);
    if (Number(storedVersion) >= MODEL_VERSION) return { value, migrated: false, reason: "current_model" };
    const effects = totalChoiceEffects(choiceLog);
    if (equal(value, effects)) return { value: add(BASELINE, value), migrated: true, reason: "legacy_without_baseline" };
    if (equal(value, add(BASELINE, effects))) return { value, migrated: true, reason: "baseline_already_present" };
    return { value, migrated: false, reason: "preserved_unknown_state" };
  }

  function isStoryChoice(entry, storyId) {
    return entry?.story_id === storyId && !String(entry?.source || "").startsWith("first_vibration_intro");
  }

  function storyChoice(choiceLog = [], storyId) {
    return [...choiceLog].reverse().find(entry => isStoryChoice(entry, storyId)) || null;
  }

  function distance(a, b) {
    const left = normalize(a); const right = normalize(b);
    return Math.sqrt(CENTERS.reduce((sum, center) => sum + (left[center] - right[center]) ** 2, 0));
  }

  function primaryCenter(story) {
    if (CENTERS.includes(story?.primary_center)) return story.primary_center;
    const weights = normalize(story?.center_weights);
    return [...CENTERS].sort((a, b) => weights[b] - weights[a] || CENTERS.indexOf(a) - CENTERS.indexOf(b))[0];
  }

  function rankRecommendations({ stories = [], currentId, readIds = [], profile = BASELINE, path = [] }) {
    const read = new Set(readIds);
    const byId = new Map(stories.map(story => [story.id, story]));
    const current = byId.get(currentId);
    const linkedIds = new Set((current?.links || []).map(link => link.target));
    const recentCenters = path.slice(-3).map(id => byId.get(id)).filter(Boolean).map(primaryCenter);
    return stories
      .filter(story => story.id !== currentId && !read.has(story.id))
      .map(story => {
        const center = primaryCenter(story);
        const profileDistance = distance(profile, story.center_weights);
        const linked = linkedIds.has(story.id);
        const repeatCount = recentCenters.filter(recent => recent === center).length;
        const diversityPenalty = repeatCount * 4;
        const linkBonus = linked ? 8 : 0;
        return { story, profileDistance, linked, diversityPenalty, score: profileDistance + diversityPenalty - linkBonus };
      })
      .sort((a, b) => a.score - b.score || a.profileDistance - b.profileDistance || (a.story.observation_order ?? 9999) - (b.story.observation_order ?? 9999));
  }

  return { CENTERS, BASELINE, MODEL_VERSION, raw, add, normalize, totalChoiceEffects, migrateObserverRaw, storyChoice, distance, rankRecommendations };
});
