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

  function isObserverChoice(entry) {
    return Boolean(entry) && !String(entry.source || "").startsWith("first_vibration_intro");
  }

  function totalChoiceEffects(choiceLog = []) {
    return choiceLog
      .filter(isObserverChoice)
      .reduce((total, entry) => add(total, entry.effects), { HUMAN: 0, LIGHT: 0, DARK: 0 });
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
    return entry?.story_id === storyId && isObserverChoice(entry);
  }

  function storyChoice(choiceLog = [], storyId) {
    return [...choiceLog].reverse().find(entry => isStoryChoice(entry, storyId)) || null;
  }

  function observerTrajectory(choiceLog = [], currentRaw = null) {
    let running = { ...BASELINE };
    const points = [{
      index: 0,
      kind: "baseline",
      story_id: null,
      key: "baseline",
      source: "observer_baseline_v2",
      chosen_at: null,
      effects: { HUMAN: 0, LIGHT: 0, DARK: 0 },
      raw: { ...running },
      profile: normalize(running)
    }];

    choiceLog.filter(isObserverChoice).forEach(entry => {
      const effects = raw(entry.effects);
      running = add(running, effects);
      points.push({
        index: points.length,
        kind: "choice",
        story_id: entry.story_id || null,
        key: entry.key || null,
        source: entry.source || null,
        chosen_at: entry.chosen_at || null,
        effects,
        raw: { ...running },
        profile: normalize(running)
      });
    });

    if (currentRaw) {
      const current = raw(currentRaw);
      if (!equal(current, running)) {
        points.push({
          index: points.length,
          kind: "current",
          story_id: null,
          key: "current_state",
          source: "preserved_observer_state",
          chosen_at: null,
          effects: null,
          raw: current,
          profile: normalize(current)
        });
      }
    }
    return points;
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

  function importFailure(reason) {
    return { ok: false, reason };
  }

  function validatedCenterMap(value, maximum = 1000000000) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const result = {};
    for (const center of CENTERS) {
      const number = value[center];
      if (typeof number !== "number" || !Number.isFinite(number) || number < 0 || number > maximum) return null;
      result[center] = number;
    }
    return result;
  }

  function validatedString(value, maximum, required = false) {
    if (value === null || value === undefined || value === "") return required ? null : "";
    if (typeof value !== "string" || value.length > maximum) return null;
    return value;
  }

  function validatedIdList(value, maximumEntries, unique = false) {
    if (!Array.isArray(value) || value.length > maximumEntries) return null;
    const result = [];
    const seen = new Set();
    for (const item of value) {
      const id = validatedString(item, 200, true);
      if (id === null) return null;
      if (!unique || !seen.has(id)) result.push(id);
      seen.add(id);
    }
    return result;
  }

  function validateJourneyImport(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return importFailure("invalid_payload");
    if (payload.schema !== "hcu-observer-journey") return importFailure("invalid_schema");

    const version = Number(payload.version);
    if (!Number.isInteger(version) || ![2, 3].includes(version)) return importFailure("unsupported_version");

    const modelVersion = Number(payload.observer_model_version ?? MODEL_VERSION);
    if (!Number.isInteger(modelVersion) || modelVersion < 1 || modelVersion > MODEL_VERSION) return importFailure("unsupported_model");

    if (!Array.isArray(payload.choices) || payload.choices.length > 5000) return importFailure("invalid_choices");
    const choices = [];
    for (const entry of payload.choices) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return importFailure("invalid_choice");
      const storyId = validatedString(entry.story_id, 200, true);
      const key = validatedString(entry.key, 200, true);
      const label = validatedString(entry.label, 2000);
      const source = validatedString(entry.source, 200);
      const chosenAt = validatedString(entry.chosen_at, 80);
      const effects = validatedCenterMap(entry.effects, 1000000);
      if (storyId === null || key === null || label === null || source === null || chosenAt === null || !effects) return importFailure("invalid_choice");
      choices.push({ story_id: storyId, key, label, effects, source, chosen_at: chosenAt || null });
    }

    const readStoryIds = validatedIdList(payload.read_story_ids, 10000, true);
    const quantumPath = validatedIdList(payload.quantum_path, 10000, false);
    if (!readStoryIds || !quantumPath) return importFailure("invalid_collections");

    const observerRaw = validatedCenterMap(payload.observer_raw);
    const suppliedProfile = validatedCenterMap(payload.observer_profile, 100);
    if (!observerRaw) return importFailure("invalid_observer_raw");
    if (!suppliedProfile) return importFailure("invalid_observer_profile");

    const observerProfile = normalize(observerRaw);
    if (!equal(suppliedProfile, observerProfile)) return importFailure("observer_profile_mismatch");
    if (CENTERS.reduce((sum, center) => sum + observerProfile[center], 0) !== 100) return importFailure("observer_profile_total");

    if (version === 3) {
      if (!Array.isArray(payload.observer_trajectory) || !payload.observer_trajectory.length || payload.observer_trajectory.length > 5001) return importFailure("invalid_trajectory");
      const finalRaw = validatedCenterMap(payload.observer_trajectory[payload.observer_trajectory.length - 1]?.raw);
      if (!finalRaw || !equal(finalRaw, observerRaw)) return importFailure("trajectory_mismatch");
    }

    const reconstructedRaw = add(BASELINE, totalChoiceEffects(choices));
    return {
      ok: true,
      value: {
        schema: "hcu-observer-journey",
        version,
        observer_model_version: MODEL_VERSION,
        observerRaw,
        observerProfile,
        readStoryIds,
        quantumPath,
        choices,
        stateSource: equal(reconstructedRaw, observerRaw) ? "choice_log" : "preserved_snapshot"
      }
    };
  }

  return { CENTERS, BASELINE, MODEL_VERSION, raw, add, equal, normalize, totalChoiceEffects, migrateObserverRaw, storyChoice, observerTrajectory, distance, rankRecommendations, validateJourneyImport };
});
