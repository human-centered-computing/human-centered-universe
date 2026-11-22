"use strict";
// Local fiction prototype. These checks are NOT an authorization/security service.
const crypto = require("node:crypto");
const engine = require("../../web/assets/observer-engine.v2.js");
const scene = require("./scene.json");
const centers = ["HUMAN", "LIGHT", "DARK"];
const copy = value => JSON.parse(JSON.stringify(value));
function blobSha(text) {
  const bytes = Buffer.from(text, "utf8");
  return crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}
function validateRaw(raw) {
  if (!raw || Object.keys(raw).length !== 3 ||
      !centers.every(c => typeof raw[c] === "number" && Number.isFinite(raw[c]) && raw[c] >= 0 && raw[c] <= 1e9))
    throw new Error("invalid_raw");
}
function start({ metaText, storyText, raw = engine.BASELINE, log = [] }) {
  if (blobSha(metaText) !== scene.source.meta_blob_sha || blobSha(storyText) !== scene.source.story_tr_blob_sha)
    throw new Error("source_drift");
  const meta = JSON.parse(metaText);
  if (meta.id !== scene.story_id) throw new Error("wrong_story");
  validateRaw(raw);
  if (!Array.isArray(log)) throw new Error("invalid_log");
  const choices = meta.observer_choices;
  if (choices.length !== 3 || new Set(choices.map(c => c.key)).size !== 3 ||
      !choices.every(c => Object.hasOwn(scene.plans, c.key) && Object.keys(c.effects).length === 3 &&
        centers.every(k => Number.isFinite(c.effects[k]) && c.effects[k] >= 0 && c.effects[k] <= 10)))
    throw new Error("invalid_choices");
  const recorded = engine.storyChoice(log, scene.story_id);
  return { phase: recorded ? "recorded" : "unassessed", raw: copy(raw), log: copy(log),
    choices: copy(choices), assessment: null, preview: null, recorded: copy(recorded) };
}
function assess() {
  const f = scene.fixture;
  const unresolved = [];
  if (f.independent_effect_validation !== "verified") unresolved.push("human_effects_unverified");
  if (f.delegated_scope !== "restrict_living_choices") unresolved.push("outside_delegated_scope");
  if (f.living_council === "opposes") unresolved.push("living_council_objects");
  if (f.individual_voice !== "separable") unresolved.push("individual_voice_unresolved");
  if (f.exit_feasibility !== "verified") unresolved.push("exit_unresolved");
  return { calculation_check: f.calculation_check, enforcement: "withheld",
    can_restrict: false, consciousness: "unknown", unresolved,
    scope_note: "This one fictional case grants no enforcement or shutdown authority." };
}
function advance(state, event) {
  if (!event || typeof event.type !== "string") throw new Error("invalid_event");
  // Refuse these requests even after the player records a narrative preference.
  if (event.type === "enforce") throw new Error("no_enforcement_authority");
  if (event.type === "shutdown") throw new Error("no_shutdown_authority");
  if (["confirmed", "recorded"].includes(state.phase)) return copy(state);
  const next = copy(state);
  if (event.type === "assess") {
    next.assessment = assess();
    next.preview = null;
    next.phase = "ready";
    return next;
  }
  if (event.type === "preview") {
    if (!next.assessment) throw new Error("assessment_required");
    const choice = next.choices.find(c => c.key === event.key);
    if (!choice) throw new Error("unknown_choice");
    next.preview = { key: choice.key, profile: engine.normalize(engine.add(next.raw, choice.effects)),
      plan: copy(scene.plans[choice.key]), authority: "unchanged" };
    next.phase = "preview";
    return next;
  }
  if (event.type === "cancel") {
    next.preview = null;
    next.phase = next.assessment ? "ready" : "unassessed";
    return next;
  }
  if (event.type === "confirm") {
    if (!next.preview || next.preview.key !== event.key) throw new Error("preview_required");
    const choice = next.choices.find(c => c.key === event.key);
    next.raw = engine.add(next.raw, choice.effects);
    next.recorded = { story_id: scene.story_id, key: choice.key, effects: copy(choice.effects),
      source: "hum0011_authority_sandbox_v1", plan: copy(scene.plans[choice.key]),
      enforcement: "withheld", consciousness: "unknown" };
    next.log.push(next.recorded);
    next.preview = null;
    next.phase = "confirmed";
    return next;
  }
  throw new Error("unknown_event");
}
function profile(state) { return engine.normalize(state.raw); }
module.exports = { start, advance, profile, assess, blobSha };
