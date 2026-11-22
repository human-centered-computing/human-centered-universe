"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const flow = require("./flow.cjs");
const scene = require("./scene.json");
const root = path.resolve(__dirname, "../..");
const inputs = {
  metaText: fs.readFileSync(path.join(root, "stories/human/HUM-0011/meta.json"), "utf8"),
  storyText: fs.readFileSync(path.join(root, "stories/human/HUM-0011/content/tr.md"), "utf8")
};
const start = extra => flow.start({ ...inputs, ...extra });
const ready = () => flow.advance(start(), { type: "assess" });
test("snapshot pins the actual story and three stable existing choices", () => {
  const s = start();
  assert.equal(s.phase, "unassessed");
  assert.deepEqual(s.choices.map(c => c.key).sort(), Object.keys(scene.plans).sort());
  assert.equal(s.choices.length, 3);
});
test("changed story or metadata cannot silently inherit this scene", () => {
  assert.throws(() => start({ storyText: inputs.storyText + "changed" }), /source_drift/);
  assert.throws(() => start({ metaText: inputs.metaText + " " }), /source_drift/);
});
test("invalid observer numbers and logs are rejected", () => {
  for (const HUMAN of [NaN, Infinity, -1, "34"]) {
    assert.throws(() => start({ raw: { HUMAN, LIGHT: 33, DARK: 33 } }), /invalid_raw/);
  }
  assert.throws(() => start({ log: {} }), /invalid_log/);
});
test("calculation agreement does not supply authority or effect evidence", () => {
  const a = ready().assessment;
  assert.equal(a.calculation_check, "passed_in_fiction");
  assert.equal(a.can_restrict, false);
  assert.ok(a.unresolved.includes("outside_delegated_scope"));
  assert.ok(a.unresolved.includes("human_effects_unverified"));
  assert.ok(a.unresolved.includes("living_council_objects"));
});
test("individual voice and exit cannot silently become resolved", () => {
  const a = ready().assessment;
  assert.ok(a.unresolved.includes("individual_voice_unresolved"));
  assert.ok(a.unresolved.includes("exit_unresolved"));
  assert.equal(a.consciousness, "unknown");
});
test("preview requires authority assessment; confirmation requires matching preview", () => {
  const key = start().choices[0].key;
  assert.throws(() => flow.advance(start(), { type: "preview", key }), /assessment_required/);
  assert.throws(() => flow.advance(ready(), { type: "confirm", key }), /preview_required/);
  const p = flow.advance(ready(), { type: "preview", key });
  assert.throws(() => flow.advance(p, { type: "confirm", key: p.choices[1].key }), /preview_required/);
});
test("unknown choices and events do not become decisions", () => {
  assert.throws(() => flow.advance(ready(), { type: "preview", key: "invented" }), /unknown_choice/);
  assert.throws(() => flow.advance(ready(), { type: "invented" }), /unknown_event/);
});
test("preview and cancellation preserve raw state and log without mutating inputs", () => {
  const s = ready();
  const before = JSON.stringify(s);
  const p = flow.advance(s, { type: "preview", key: s.choices[0].key });
  const cancelled = flow.advance(p, { type: "cancel" });
  assert.equal(JSON.stringify(s), before);
  assert.deepEqual(cancelled.raw, s.raw);
  assert.deepEqual(cancelled.log, s.log);
  assert.equal(cancelled.preview, null);
  assert.equal(cancelled.phase, "ready");
});
for (const key of Object.keys(scene.plans)) {
  test(`${key}: normalized profile totals 100 and confirmation adds effects once`, () => {
    const s = ready();
    const p = flow.advance(s, { type: "preview", key });
    assert.equal(Object.values(p.preview.profile).reduce((a, b) => a + b), 100);
    assert.equal(p.preview.authority, "unchanged");
    assert.deepEqual(p.raw, s.raw);
    const done = flow.advance(p, { type: "confirm", key });
    assert.equal(done.log.length, 1);
    assert.equal(done.recorded.key, key);
    const effects = s.choices.find(c => c.key === key).effects;
    for (const center of ["HUMAN", "LIGHT", "DARK"]) assert.equal(done.raw[center], s.raw[center] + effects[center]);
    assert.deepEqual(flow.advance(done, { type: "confirm", key }), done);
    assert.deepEqual(flow.advance(done, { type: "assess" }), done);
  });
  test(`${key}: no branch restricts living people, presumes consciousness or shuts support down`, () => {
    const p = flow.advance(ready(), { type: "preview", key });
    const done = flow.advance(p, { type: "confirm", key });
    assert.equal(done.recorded.enforcement, "withheld");
    assert.equal(done.recorded.consciousness, "unknown");
    assert.ok(done.recorded.plan.steps.includes("preserve_support_pending_review"));
    for (const state of [start(), ready(), p, done]) {
      assert.throws(() => flow.advance(state, { type: "enforce" }), /no_enforcement_authority/);
      assert.throws(() => flow.advance(state, { type: "shutdown" }), /no_shutdown_authority/);
    }
  });
}
test("existing HUM-0011 choice remains preserved without applying points again", () => {
  const log = [{ story_id: scene.story_id, key: "human_live_authority", effects: { HUMAN: 10, LIGHT: 4, DARK: 3 } }];
  const raw = { HUMAN: 44, LIGHT: 37, DARK: 36 };
  const s = start({ log, raw });
  assert.equal(s.phase, "recorded");
  assert.deepEqual(flow.advance(s, { type: "confirm", key: "human_live_authority" }), s);
  assert.deepEqual(s.raw, raw);
  assert.equal(log.length, 1);
});
test("scene supports both languages and keeps six epistemic layers", () => {
  assert.equal(Object.keys(scene.epistemic_layers).length, 6);
  for (const lang of ["tr", "en"]) {
    assert.ok(scene.title[lang] && scene.opening[lang]);
    assert.ok(Object.values(scene.plans).every(p => p[lang]));
  }
  assert.equal(scene.editorial_status.human_reviewed, false);
});
