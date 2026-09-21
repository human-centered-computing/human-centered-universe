const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("../web/assets/observer-engine.v2.js");

const baseline = { HUMAN: 34, LIGHT: 33, DARK: 33 };
const log = [{ story_id: "A", key: "light", effects: { HUMAN: 2, LIGHT: 10, DARK: 2 } }];

const legacy = engine.migrateObserverRaw({ HUMAN: 2, LIGHT: 10, DARK: 2 }, log, 0);
assert.deepEqual(legacy.value, { HUMAN: 36, LIGHT: 43, DARK: 35 });
assert.equal(legacy.reason, "legacy_without_baseline");

const reconstructed = engine.migrateObserverRaw(null, log, 0);
assert.deepEqual(reconstructed.value, { HUMAN: 36, LIGHT: 43, DARK: 35 });
assert.equal(reconstructed.reason, "reconstructed_from_log");

const current = engine.migrateObserverRaw({ HUMAN: 36, LIGHT: 43, DARK: 35 }, log, 0);
assert.deepEqual(current.value, { HUMAN: 36, LIGHT: 43, DARK: 35 });
assert.equal(current.reason, "baseline_already_present");

const unknown = engine.migrateObserverRaw({ HUMAN: 90, LIGHT: 4, DARK: 6 }, log, 0);
assert.deepEqual(unknown.value, { HUMAN: 90, LIGHT: 4, DARK: 6 });
assert.equal(unknown.reason, "preserved_unknown_state");

const profile = engine.normalize(engine.add(baseline, { HUMAN: 2, LIGHT: 10, DARK: 2 }));
assert.equal(profile.HUMAN + profile.LIGHT + profile.DARK, 100);

const mixedLog = [
  { story_id: "BRG-0002", key: "intro_touch_stone", source: "first_vibration_intro_v2", effects: { HUMAN: 2, LIGHT: 0, DARK: 0 } },
  { story_id: "BRG-0002", key: "story_choice", source: "story_observer_choice_v2", effects: { HUMAN: 2, LIGHT: 2, DARK: 10 } }
];
assert.equal(engine.storyChoice(mixedLog.slice(0, 1), "BRG-0002"), null);
assert.equal(engine.storyChoice(mixedLog, "BRG-0002").key, "story_choice");

const stories = [
  { id: "CURRENT", center_weights: { HUMAN: 34, LIGHT: 33, DARK: 33 }, links: [{ target: "LINKED" }], observation_order: 1 },
  { id: "EXACT", primary_center: "HUMAN", center_weights: { HUMAN: 70, LIGHT: 15, DARK: 15 }, observation_order: 2 },
  { id: "LINKED", primary_center: "HUMAN", center_weights: { HUMAN: 66, LIGHT: 19, DARK: 15 }, observation_order: 3 },
  { id: "DIVERSE", primary_center: "LIGHT", center_weights: { HUMAN: 65, LIGHT: 20, DARK: 15 }, observation_order: 4 }
];
const linked = engine.rankRecommendations({ stories, currentId: "CURRENT", profile: { HUMAN: 70, LIGHT: 15, DARK: 15 }, path: [] });
assert.equal(linked[0].story.id, "LINKED", "an explicit story link should explainably influence a close match");

const diverse = engine.rankRecommendations({ stories: stories.map(story => ({ ...story, links: [] })), currentId: "CURRENT", profile: { HUMAN: 70, LIGHT: 15, DARK: 15 }, path: ["EXACT", "EXACT", "EXACT"] });
assert.equal(diverse[0].story.id, "DIVERSE", "recent center repetition should allow a close, more diverse node to surface");

const appSource = fs.readFileSync(path.join(__dirname, "../web/assets/app.js"), "utf8");
assert.match(appSource, /if\(recordedStoryChoice\(story\.id\)\) return false/);
assert.doesNotMatch(appSource.match(/function applyChoice[\s\S]*?\n}/)?.[0] || "", /setStory\(/, "committing a choice must not auto-open the recommendation");
assert.match(appSource, /id="export-journey"/);
assert.match(appSource, /event\.key!=="Enter"&&event\.key!==" "/);

console.log("Observer flow v2 tests passed.");
