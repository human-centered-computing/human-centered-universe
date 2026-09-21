import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const localesDir = path.join(root, "locales");
const localeFiles = fs.readdirSync(localesDir).filter(file => file.endsWith(".json"));
const english = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const expectedLocales = ["en","tr","de","es","fr","it","pt","ru","zh-CN","ja","ar","ku"];
const requiredUiKeys = [
  "create_intro","link_quantum_echo","link_echo","link_contrast","link_cause","link_memory",
  "link_future","link_character","link_place","link_artifact","link_theme","link_transformation",
  "link_parallel","projected_observer_state","confirm_observer_choice","confirm_choice","cancel",
  "choice_recorded","recommendation_profile_match","recommendation_connected","recommendation_diversity",
  "export_journey","export_journey_description","download_journey_json"
];
for (const lang of expectedLocales) {
  const file = lang === "en" ? "en.json" : `${lang}.json`;
  const locale = JSON.parse(fs.readFileSync(path.join(localesDir, file), "utf8"));
  for (const key of Object.keys(english)) if (!(key in locale)) throw new Error(`${lang}: missing UI key ${key}`);
  for (const key of requiredUiKeys) if (!(key in locale)) throw new Error(`${lang}: missing new UI key ${key}`);
}
const stories = {
  "BRG-0012": "stories/bridges/BRG-0012",
  "BRG-0013": "stories/bridges/BRG-0013",
  "BRG-0016": "stories/bridges/BRG-0016",
  "BRG-0017": "stories/bridges/BRG-0017",
  "COM-0001": "stories/common/COM-0001",
  "DRK-0001": "stories/dark/DRK-0001",
  "HUM-0003": "stories/human/HUM-0003"
};
const expectedStoryLanguages = ["en","tr","de","es","fr","it","pt","ru","zh-CN","ja","ar","ku"];
const knownGaps = new Set(["HUM-0003/it","HUM-0003/pt"]);
for (const [id, relative] of Object.entries(stories)) {
  const meta = JSON.parse(fs.readFileSync(path.join(root, relative, "meta.json"), "utf8"));
  for (const lang of expectedStoryLanguages) {
    const key = `${id}/${lang}`;
    const contentPath = path.join(root, relative, "content", `${lang}.md`);
    const exists = fs.existsSync(contentPath) && fs.statSync(contentPath).size > 0;
    if (!exists && !knownGaps.has(key)) throw new Error(`${key}: unexpected missing story content`);
    if (exists && !meta.translations?.[lang]) throw new Error(`${key}: content exists without metadata`);
  }
}
console.log("Translation coverage v2 passed. Known gaps: HUM-0003/it, HUM-0003/pt.");
