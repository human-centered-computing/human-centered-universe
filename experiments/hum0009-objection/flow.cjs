"use strict";
const engine = require("../../web/assets/observer-engine.v2.js");
const scene = require("./scene.json");
const centers = ["HUMAN", "LIGHT", "DARK"];
function copy(value) { return JSON.parse(JSON.stringify(value)); }
function start(meta, raw = engine.BASELINE, log = []) {
  if (meta.id !== scene.story_id || meta.revision?.version !== scene.source_revision)
    throw new Error("source_revision_mismatch");
  if (!raw || !centers.every(c => Number.isFinite(raw[c]) && raw[c] >= 0 && raw[c] <= 1e9))
    throw new Error("invalid_raw");
  if (!Array.isArray(log)) throw new Error("invalid_log");
  const choices = copy(meta.observer_choices);
  if (choices.length !== 3 || new Set(choices.map(c => c.key)).size !== 3 ||
      !choices.every(c => c.key && centers.every(k => Number.isFinite(c.effects?.[k]) &&
        c.effects[k] >= 0 && c.effects[k] <= 1e6) &&
        Object.keys(c.effects).length === 3))
    throw new Error("invalid_choices");
  const recorded = engine.storyChoice(log, meta.id);
  return { phase: recorded ? "recorded" : "inspect", raw: copy(raw), log: copy(log),
    choices, opened: [], preview: null, recorded: recorded ? copy(recorded) : null };
}
function advance(state, event) {
  // Pure reducer: callers receive a fresh state, never a mutated journey.
  const next = copy(state);
  if (["confirmed", "recorded"].includes(state.phase)) return next;
  if (event.type === "open") {
    if (!scene.evidence.some(item => item.id === event.id)) throw new Error("unknown_evidence");
    if (!next.opened.includes(event.id)) next.opened.push(event.id);
    if (!next.preview) next.phase = scene.evidence.every(e => next.opened.includes(e.id)) ? "ready" : "inspect";
    return next;
  }
  if (event.type === "preview") {
    if (!scene.evidence.every(e => next.opened.includes(e.id))) throw new Error("evidence_not_opened");
    const choice = next.choices.find(c => c.key === event.key);
    if (!choice) throw new Error("unknown_choice");
    next.preview = { key: choice.key, profile: engine.normalize(engine.add(next.raw, choice.effects)) };
    next.phase = "preview";
    return next;
  }
  if (event.type === "back") {
    next.preview = null;
    next.phase = scene.evidence.every(e => next.opened.includes(e.id)) ? "ready" : "inspect";
    return next;
  }
  if (event.type === "confirm") {
    if (!next.preview || next.preview.key !== event.key) throw new Error("preview_required");
    const choice = next.choices.find(c => c.key === event.key);
    next.raw = engine.add(next.raw, choice.effects);
    next.recorded = { story_id: scene.story_id, key: choice.key, effects: copy(choice.effects),
      source: "hum0009_objection_sandbox_v1" };
    next.log.push(next.recorded);
    next.preview = null;
    next.phase = "confirmed";
    return next;
  }
  throw new Error("unknown_event");
}
function profile(state) { return engine.normalize(state.raw); }
module.exports = { start, advance, profile };
