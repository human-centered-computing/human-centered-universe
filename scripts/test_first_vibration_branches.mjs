import fs from "node:fs";
import assert from "node:assert/strict";

const meta=JSON.parse(fs.readFileSync("stories/bridges/BRG-0002/meta.json","utf8"));
const app=fs.readFileSync("web/assets/app.js","utf8");
const scene3d=fs.readFileSync("web/assets/first-vibration-3d.v1.js","utf8");
const index=fs.readFileSync("web/index.html","utf8");
const styles=fs.readFileSync("web/assets/styles.css","utf8");
const languages=["en","tr","de","es","fr","it","pt","ru","zh-CN","ja","ar","ku"];
const expected={
  hold_the_relation:{center:"HUMAN",target:"COM-0001"},
  measure_without_declaring_truth:{center:"LIGHT",target:"LGT-0001"},
  keep_uncertainty_open:{center:"DARK",target:"DRK-0001"}
};

assert.equal(meta.id,"BRG-0002");
assert.equal(meta.observer_choices.length,3);
assert.deepEqual(new Set(meta.observer_choices.map(choice=>choice.key)),new Set(Object.keys(expected)));

for(const choice of meta.observer_choices){
  const rule=expected[choice.key];
  assert.ok(rule,`Unexpected choice ${choice.key}`);
  assert.deepEqual(Object.keys(choice.effects).sort(),["DARK","HUMAN","LIGHT"]);
  assert.ok(choice.effects[rule.center]>Math.max(...Object.entries(choice.effects).filter(([key])=>key!==rule.center).map(([,value])=>value)));
  assert.equal(choice.branch.target,rule.target);
  const legacyKey={HUMAN:"human_direction",LIGHT:"light_direction",DARK:"dark_direction"}[rule.center];
  assert.deepEqual(choice.legacy_keys,[legacyKey]);
  assert.ok(meta.links.some(link=>link.target===rule.target),"Branch must use an existing canonical link");
  for(const language of languages){
    assert.ok(choice.labels[language],`Missing ${language} label for ${choice.key}`);
    assert.ok(choice.branch.outcome[language],`Missing ${language} outcome for ${choice.key}`);
    const review=choice.translation_review[language];
    assert.ok(review,`Missing ${language} review state for ${choice.key}`);
    assert.equal(review.human_reviewed,language==="en"||language==="tr");
    assert.equal(review.status,language==="en"?"canonical":language==="tr"?"reviewed":"machine_draft");
  }
  const raw={HUMAN:34+choice.effects.HUMAN,LIGHT:33+choice.effects.LIGHT,DARK:33+choice.effects.DARK};
  const total=Object.values(raw).reduce((sum,value)=>sum+value,0);
  const normalized=Object.fromEntries(Object.entries(raw).map(([key,value])=>[key,(value/total)*100]));
  assert.ok(Math.abs(Object.values(normalized).reduce((sum,value)=>sum+value,0)-100)<1e-9);
  assert.equal(Object.entries(normalized).sort((a,b)=>b[1]-a[1])[0][0],rule.center);
}

const requiredLayers=["established_science","real_engineering","interpretation","philosophy","belief_cultural_meaning","science_fiction","quantum_note"];
assert.deepEqual(Object.keys(meta.choice_epistemic_layers.notes),requiredLayers);
for(const layer of requiredLayers){
  assert.ok(meta.choice_epistemic_layers.notes[layer].en);
  assert.ok(meta.choice_epistemic_layers.notes[layer].tr);
}
assert.match(meta.choice_epistemic_layers.notes.quantum_note.en,/metaphor/i);
assert.match(meta.choice_epistemic_layers.notes.quantum_note.tr,/metafor/i);
assert.match(meta.choice_epistemic_layers.notes.real_engineering.en,/not a model of consciousness/i);

const shots=meta.scene_3d_vertical_slice.shots;
assert.equal(shots.length,3);
assert.deepEqual(new Set(shots.map(shot=>shot.choice_key)),new Set(Object.keys(expected)));
assert.ok(meta.scene_3d_vertical_slice.accessibility.some(item=>/keyboard/i.test(item)));
assert.ok(meta.scene_3d_vertical_slice.accessibility.some(item=>/reduced-motion/i.test(item)));

assert.match(app,/function choiceMatchesRecord\(/);
assert.match(app,/legacy_keys\.includes\(record\.key\)/);
assert.match(app,/function branchOutcome\(/);
assert.match(app,/function epistemicPanel\(/);
assert.match(app,/const branchStatus=recordedDefinition\?branchOutcome/);
assert.match(app,/data-story=/);
assert.match(app,/HCUFirstVibration3D/);
assert.match(app,/id="first-vibration-3d"/);
assert.match(app,/id="observer-choices"/);
const scenePlacement=app.indexOf('${scene3d}');
const firstVibrationChoicePlacement=app.indexOf('${story.id==="BRG-0002"?choicePanel:""}');
const storyContentPlacement=app.indexOf('<div class="story-content">');
assert.ok(scenePlacement>=0&&scenePlacement<firstVibrationChoicePlacement,"FIRST VIBRATION choices must follow the 3D scene");
assert.ok(firstVibrationChoicePlacement<storyContentPlacement,"FIRST VIBRATION choices must remain visible before the long story body");
assert.match(app,/fv3d\?\.setMode\(c\.key\)/);
assert.match(app,/fv3d\?\.setMode\(sceneMode\)/);
assert.match(index,/first-vibration-3d\.v1\.js/);
assert.match(styles,/\.fv3d-canvas/);
assert.match(styles,/@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotThrow(()=>new Function(scene3d));
assert.match(scene3d,/getContext\("webgl"/);
assert.match(scene3d,/for\(let i=0;i<12;i\+\+\)/);
assert.match(scene3d,/hold_the_relation:"HUMAN"/);
assert.match(scene3d,/measure_without_declaring_truth:"LIGHT"/);
assert.match(scene3d,/keep_uncertainty_open:"DARK"/);
assert.match(scene3d,/pointerdown/);
assert.match(scene3d,/ArrowLeft/);
assert.match(scene3d,/prefers-reduced-motion/);
assert.match(scene3d,/WebGL kullanılamıyor/);
assert.doesNotMatch(scene3d,/https?:\/\//);
for(const language of languages){
  const marker=language==="zh-CN"?"\"zh-CN\":":language+":";
  assert.ok(scene3d.includes(marker),`Missing 3D interface copy for ${language}`);
}

console.log("FIRST VIBRATION branch and WebGL vertical slice passed");
