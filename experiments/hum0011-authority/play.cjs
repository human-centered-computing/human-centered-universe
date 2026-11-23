"use strict";
const fs = require("node:fs");
const path = require("node:path");
const flow = require("./flow.cjs");
const scene = require("./scene.json");
const root = path.resolve(__dirname, "../..");
let state = flow.start({
  metaText: fs.readFileSync(path.join(root, "stories/human/HUM-0011/meta.json"), "utf8"),
  storyText: fs.readFileSync(path.join(root, "stories/human/HUM-0011/content/tr.md"), "utf8")
});
console.log(scene.title.tr + "\n\n" + scene.opening.tr);
state = flow.advance(state, { type: "assess" });
console.log("\nKanıt / yetki / belirsizlik incelemesi:\n" + JSON.stringify(state.assessment, null, 2));
console.log("\nYaklaşımlar:");
state.choices.forEach(c => console.log(c.key + " — " + c.labels.tr));
const key = process.argv[2];
if (key) {
  state = flow.advance(state, { type: "preview", key });
  console.log("\nÖnizleme:\n" + JSON.stringify(state.preview, null, 2));
  if (process.argv.includes("--confirm")) {
    state = flow.advance(state, { type: "confirm", key });
    console.log("\nYalnız bu süreçteki kurgu tercihim kaydedildi:\n" + JSON.stringify({
      profile: flow.profile(state), result: state.recorded
    }, null, 2));
  }
}
console.log("\nGerçek okuyucu kaydı veya dış sistem değiştirilmedi.");
