import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../web/assets/first-vibration-intro.v1.js", import.meta.url), "utf8");

function classList() {
  const values = new Set();
  return {
    add: value => values.add(value),
    remove: value => values.delete(value),
    toggle: (value, force) => force ? values.add(value) : values.delete(value),
    contains: value => values.has(value)
  };
}

function control(dataset = {}) {
  const listeners = {};
  return {
    dataset,
    classList: classList(),
    disabled: false,
    hidden: false,
    textContent: "",
    setAttribute() {},
    addEventListener(type, listener) { listeners[type] = listener; },
    click() { listeners.click?.(); },
    focus() {}
  };
}

function runIntro(storage, search = "") {
  const choices = Object.fromEntries(["HUMAN", "LIGHT", "DARK"].map(center => [center, control({ introCenter: center })]));
  const preview = control();
  preview.hidden = true;
  const status = control();
  const confirm = control();
  const skip = control();
  const intro = {
    dataset: {},
    className: "",
    classList: classList(),
    innerHTML: "",
    setAttribute() {},
    remove() {},
    querySelectorAll(selector) {
      if (selector === "[data-intro-center]") return Object.values(choices);
      if (selector === "button:not([disabled])") return [...Object.values(choices), confirm, skip].filter(item => !item.disabled);
      return [];
    },
    querySelector(selector) {
      return {
        ".intro-preview": preview,
        ".intro-preview-status": status,
        ".intro-confirm": confirm,
        ".intro-skip": skip
      }[selector] || null;
    }
  };
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); }
  };
  const location = {
    href: `https://example.test/?story=BRG-0002${search}`,
    search: `?story=BRG-0002${search}`,
    replace() {}
  };
  const document = {
    readyState: "complete",
    body: { classList: classList(), appendChild() {} },
    createElement() { return intro; },
    getElementById(id) { return id === "first-vibration-intro" ? intro : null; },
    addEventListener() {},
    removeEventListener() {},
    activeElement: null
  };
  vm.runInNewContext(source, {
    document,
    localStorage,
    location,
    URL,
    URLSearchParams,
    console,
    setTimeout: callback => { callback(); return 1; }
  });
  return { choices, preview, status, confirm };
}

const storage = new Map();
const first = runIntro(storage);
first.choices.HUMAN.click();

assert.equal(storage.has("hcu.observerRaw"), false, "Preview must not write observer state");
assert.equal(first.preview.hidden, false, "Choice must reveal the preview");
const previewTotal = [...first.status.textContent.matchAll(/(\d+)%/g)].slice(-3).reduce((sum, match) => sum + Number(match[1]), 0);
assert.equal(previewTotal, 100, "Projected HUMAN/LIGHT/DARK profile must sum to 100");

first.confirm.click();
assert.deepEqual(JSON.parse(storage.get("hcu.observerRaw")), { HUMAN: 36, LIGHT: 33, DARK: 33 });
assert.equal(JSON.parse(storage.get("hcu.choiceLog")).length, 1);
assert.equal(JSON.parse(storage.get("hcu.choiceLog"))[0].source, "first_vibration_intro_v2");

const rawAfterFirstChoice = storage.get("hcu.observerRaw");
const replay = runIntro(storage, "&intro=1");
replay.choices.LIGHT.click();
replay.confirm.click();

assert.equal(storage.get("hcu.observerRaw"), rawAfterFirstChoice, "Re-entering the intro must not add center weight twice");
assert.equal(JSON.parse(storage.get("hcu.choiceLog")).length, 1, "Re-entering the intro must not duplicate the choice log");

console.log("OK: First Vibration preview, 100-point normalization and idempotent choice recording verified.");
