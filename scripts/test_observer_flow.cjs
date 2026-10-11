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
assert.deepEqual(engine.totalChoiceEffects(mixedLog), { HUMAN: 2, LIGHT: 2, DARK: 10 }, "intro interactions must not alter Observer State");

const trajectory = engine.observerTrajectory(mixedLog);
assert.equal(trajectory.length, 2, "the trail contains a baseline plus one narrative choice");
assert.deepEqual(trajectory[0].profile, baseline);
assert.deepEqual(trajectory[1].profile, { HUMAN: 31, LIGHT: 31, DARK: 38 });
trajectory.forEach(point => assert.equal(point.profile.HUMAN + point.profile.LIGHT + point.profile.DARK, 100));

const reconciledTrajectory = engine.observerTrajectory(mixedLog, { HUMAN: 90, LIGHT: 4, DARK: 6 });
assert.equal(reconciledTrajectory.length, 3);
assert.equal(reconciledTrajectory[2].kind, "current", "an unknown preserved state remains visible instead of being rewritten");
assert.deepEqual(reconciledTrajectory[2].profile, { HUMAN: 90, LIGHT: 4, DARK: 6 });

const validImportV3 = {
  schema: "hcu-observer-journey",
  version: 3,
  observer_model_version: 2,
  observer_profile: { HUMAN: 31, LIGHT: 38, DARK: 31 },
  observer_raw: { HUMAN: 36, LIGHT: 43, DARK: 35 },
  read_story_ids: ["A", "A"],
  quantum_path: ["BRG-0002", "A"],
  choices: log,
  observer_trajectory: engine.observerTrajectory(log, { HUMAN: 36, LIGHT: 43, DARK: 35 })
};
const importedV3 = engine.validateJourneyImport(validImportV3);
assert.equal(importedV3.ok, true);
assert.deepEqual(importedV3.value.observerProfile, { HUMAN: 31, LIGHT: 38, DARK: 31 });
assert.deepEqual(importedV3.value.readStoryIds, ["A"], "read IDs are de-duplicated");
assert.equal(importedV3.value.stateSource, "choice_log");

const validImportV2 = JSON.parse(JSON.stringify(validImportV3));
validImportV2.version = 2;
delete validImportV2.observer_trajectory;
assert.equal(engine.validateJourneyImport(validImportV2).ok, true, "schema v2 remains portable");

const wrongSchema = { ...validImportV3, schema: "untrusted-data" };
assert.equal(engine.validateJourneyImport(wrongSchema).reason, "invalid_schema");

const negativeEffects = JSON.parse(JSON.stringify(validImportV3));
negativeEffects.choices[0].effects.LIGHT = -1;
assert.equal(engine.validateJourneyImport(negativeEffects).reason, "invalid_choice");

const mismatchedProfile = JSON.parse(JSON.stringify(validImportV3));
mismatchedProfile.observer_profile = { HUMAN: 33, LIGHT: 33, DARK: 34 };
assert.equal(engine.validateJourneyImport(mismatchedProfile).reason, "observer_profile_mismatch");

const mismatchedTrajectory = JSON.parse(JSON.stringify(validImportV3));
mismatchedTrajectory.observer_trajectory.at(-1).raw.HUMAN = 99;
assert.equal(engine.validateJourneyImport(mismatchedTrajectory).reason, "trajectory_mismatch");

const preservedSnapshot = JSON.parse(JSON.stringify(validImportV3));
preservedSnapshot.observer_raw = { HUMAN: 90, LIGHT: 4, DARK: 6 };
preservedSnapshot.observer_profile = { HUMAN: 90, LIGHT: 4, DARK: 6 };
preservedSnapshot.observer_trajectory = engine.observerTrajectory(log, preservedSnapshot.observer_raw);
const preservedImport = engine.validateJourneyImport(preservedSnapshot);
assert.equal(preservedImport.ok, true);
assert.equal(preservedImport.value.stateSource, "preserved_snapshot", "valid legacy snapshots are not silently rewritten");

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
assert.match(appSource, /id="import-journey-file"/);
assert.match(appSource, /id="confirm-import"/);
assert.match(appSource, /MAX_JOURNEY_IMPORT_BYTES = 1024 \* 1024/);
const settingsSource = appSource.match(/function renderSettings\(\)\{[\s\S]*?\n\}\nfunction render\(/)?.[0] || "";
assert.match(settingsSource, /await file\.text\(\)/, "the journey file is read locally");
assert.doesNotMatch(settingsSource, /\bfetch\s*\(/, "import must not upload the journey");
assert.match(appSource, /event\.key!=="Enter"&&event\.key!==" "/);
assert.match(appSource, /class="observer-trail-line"/);
assert.match(appSource, /observer_trajectory:observerTrajectory\(\)/);
assert.match(appSource, /HUMAN \+ LIGHT \+ DARK = 100/);

console.log("Observer flow v2 tests passed.");
