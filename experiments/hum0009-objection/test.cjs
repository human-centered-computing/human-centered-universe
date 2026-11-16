"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { start, advance, profile } = require("./flow.cjs");
const scene = require("./scene.json");
const meta = require("../../stories/human/HUM-0009/meta.json");
function ready(raw, log) {
  return scene.evidence.reduce((s, e) => advance(s, { type: "open", id: e.id }), start(meta, raw, log));
}
test("preview needs both evidence cards; opening is not proof of comprehension", () => {
  let s = start(meta);
  assert.throws(() => advance(s, { type: "preview", key: meta.observer_choices[0].key }), /evidence_not_opened/);
  s = advance(s, { type: "open", id: "claim" });
  assert.throws(() => advance(s, { type: "preview", key: meta.observer_choices[0].key }), /evidence_not_opened/);
  assert.equal(advance(s, { type: "open", id: "objection" }).phase, "ready");
});
test("opening twice is idempotent; unknown evidence is rejected", () => {
  const a = advance(start(meta), { type: "open", id: "claim" });
  assert.deepEqual(advance(a, { type: "open", id: "claim" }), a);
  assert.throws(() => advance(a, { type: "open", id: "other" }), /unknown_evidence/);
});
test("preview, switch and back do not award effects or mutate inputs", () => {
  const s = ready(); const original = structuredClone(s);
  const a = advance(s, { type: "preview", key: meta.observer_choices[0].key });
  const b = advance(a, { type: "preview", key: meta.observer_choices[1].key });
  assert.deepEqual(s, original); assert.deepEqual(b.raw, s.raw); assert.deepEqual(b.log, []);
  const c = advance(b, { type: "back" });
  assert.equal(c.phase, "ready"); assert.equal(c.preview, null);
});
test("confirm must match preview", () => {
  const s = ready();
  assert.throws(() => advance(s, { type: "confirm", key: meta.observer_choices[0].key }), /preview_required/);
  const p = advance(s, { type: "preview", key: meta.observer_choices[0].key });
  assert.throws(() => advance(p, { type: "confirm", key: meta.observer_choices[1].key }), /preview_required/);
  assert.throws(() => advance(s, { type: "preview", key: "invented" }), /unknown_choice/);
});
for (const choice of meta.observer_choices) {
  test(choice.key + ": exactly one effect; profile total 100", () => {
    const s = ready();
    const p = advance(s, { type: "preview", key: choice.key });
    const c = advance(p, { type: "confirm", key: choice.key });
    assert.deepEqual(profile(c), p.preview.profile);
    for (const center of ["HUMAN", "LIGHT", "DARK"])
      assert.equal(c.raw[center], s.raw[center] + choice.effects[center]);
    assert.equal(Object.values(profile(c)).reduce((a,b) => a+b, 0), 100);
    assert.equal(c.log.length, 1);
    assert.deepEqual(advance(c, { type: "confirm", key: choice.key }), c);
    assert.deepEqual(advance(c, { type: "preview", key: meta.observer_choices[0].key }), c);
  });
}
test("existing story choice cannot be scored again, including legacy source entries", () => {
  const record = { story_id: "HUM-0009", key: meta.observer_choices[0].key,
    effects: meta.observer_choices[0].effects, source: "reader_choice" };
  const raw = { HUMAN: 44, LIGHT: 37, DARK: 35 };
  const s = start(meta, raw, [record]);
  assert.equal(s.phase, "recorded");
  assert.deepEqual(advance(s, { type: "confirm", key: record.key }), s);
  assert.deepEqual(s.raw, raw);
});
test("prior choices and custom raw profile are preserved", () => {
  const log = [{ story_id: "HUM-0008", key: "prior", effects: { HUMAN: 1, LIGHT: 2, DARK: 3 } }];
  const s = ready({ HUMAN: 80, LIGHT: 7, DARK: 13 }, log);
  const c = advance(advance(s, { type: "preview", key: meta.observer_choices[2].key }),
    { type: "confirm", key: meta.observer_choices[2].key });
  assert.deepEqual(c.log[0], log[0]); assert.equal(c.log.length, 2);
  assert.equal(Object.values(profile(c)).reduce((a,b) => a+b, 0), 100);
});
test("revision drift and non-finite raw values fail closed", () => {
  assert.throws(() => start({ ...meta, revision: { version: 5 } }), /source_revision_mismatch/);
  for (const n of [NaN, Infinity, -1]) assert.throws(() => start(meta, { HUMAN: n, LIGHT: 33, DARK: 33 }), /invalid_raw/);
});
test("TR and EN evidence plus all six epistemic layers are present", () => {
  for (const lang of ["tr", "en"]) {
    assert.ok(scene.opening[lang]); assert.ok(scene.confirmation[lang]);
    for (const e of scene.evidence) assert.ok(e.title[lang] && e.text[lang]);
    for (const c of meta.observer_choices) assert.ok(c.labels[lang] && c.branch.outcome[lang]);
  }
  assert.deepEqual(Object.keys(scene.epistemic_layers).sort(),
    ["established_science","real_engineering","interpretation","philosophy","belief_cultural_meaning","science_fiction"].sort());
  assert.equal(scene.spatial_brief.pillars, 12);
  assert.match(scene.opening.tr, /FIRST VIBRATION/);
});
