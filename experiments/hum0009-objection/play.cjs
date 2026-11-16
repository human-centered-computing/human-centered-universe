"use strict";
const readline = require("node:readline/promises");
const scene = require("./scene.json");
const meta = require("../../stories/human/HUM-0009/meta.json");
const { start, advance, profile } = require("./flow.cjs");
const lang = process.argv.includes("--en") ? "en" : "tr";
let state = start(meta);
const keys = ["a", "b", "c"];
function show() {
  console.log("\n" + scene.title[lang] + " [" + state.phase + "]");
  console.log(JSON.stringify(profile(state)));
  scene.evidence.forEach((e,i) => console.log((i+1) + ": " + e.title[lang]));
  meta.observer_choices.forEach((c,i) => console.log(keys[i] + ": " + c.labels[lang]));
  console.log(lang === "tr" ? "y: onay | r: geri | q: çık" : "y: confirm | r: back | q: quit");
}
function act(input) {
  const evidence = scene.evidence[Number(input)-1];
  if (evidence && ["1","2"].includes(input)) {
    console.log(evidence.text[lang]);
    state = advance(state, { type: "open", id: evidence.id });
  } else if (keys.includes(input)) {
    state = advance(state, { type: "preview", key: meta.observer_choices[keys.indexOf(input)].key });
    console.log(lang === "tr" ? "Önizleme:" : "Preview:", state.preview?.profile);
  } else if (input === "y") {
    state = advance(state, { type: "confirm", key: state.preview?.key });
  } else if (input === "r") {
    state = advance(state, { type: "back" });
  } else throw new Error("unknown_input");
}
async function main() {
  console.log(lang === "tr" ? "Deneysel sahne · kayıt yalnız bu oturumda" : "Experimental scene · session-only state");
  console.log(scene.opening[lang]);
  if (process.argv.includes("--demo")) {
    for (const input of ["1","2","b","y"]) act(input);
    console.log(scene.confirmation[lang]);
    console.log("HUMAN/LIGHT/DARK:", JSON.stringify(profile(state)));
    return;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (state.phase !== "confirmed") {
      show();
      const input = (await rl.question("> ")).trim().toLowerCase();
      if (input === "q") return;
      try { act(input); } catch (error) { console.log(error.message); }
    }
    console.log(scene.confirmation[lang]);
    console.log(JSON.stringify(profile(state)));
  } finally { rl.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
