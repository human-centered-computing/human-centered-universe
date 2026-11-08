"use strict";
const test=require("node:test"), assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const ROOT=path.resolve(__dirname,"..");
const engine=require("../web/assets/observer-engine.v2.js");
const scene=require("../experiments/hum0009-objection/scene.json");
const meta=require("../stories/human/HUM-0009/meta.json");
const factoryContext=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(ROOT,"experiments/hum0009-objection/flow.js"),"utf8"),factoryContext);
const createReader=require("../web/assets/hum0009-objection-reader.v1.js");
const story={...meta,objection_scene:scene};
function setup(locale="tr",log=[]){
 const reader=createReader(factoryContext.HCUObjectionFlowFactory,engine);
 const state={locale,observerRaw:{...engine.BASELINE},readIds:new Set(),choiceLog:structuredClone(log)};
 const controller=reader.begin(story,locale,state.observerRaw,state.choiceLog);
 const app=fs.readFileSync(path.join(ROOT,"web/assets/app.js"),"utf8");
 const apply=app.slice(app.indexOf("function applyChoice("),app.indexOf("function updateStaticUi("));
 const spy={saves:0,renders:0};
 const context=vm.createContext({state,window:{HCUObjectionReader:reader},CENTER_KEYS:engine.CENTERS,
  recordedStoryChoice:id=>engine.storyChoice(state.choiceLog,id),
  choiceLabel:c=>c.key,saveObserver:()=>spy.saves++,render:()=>spy.renders++});
 vm.runInContext(apply,context);
 return {reader,controller,state,spy,apply:(c,s=story)=>context.applyChoice(s,c)};
}
for(const choice of meta.observer_choices) test("reader commits "+choice.key+" once through the original applyChoice",()=>{
 const x=setup(),raw=structuredClone(x.state.observerRaw);
 assert.equal(x.apply(choice),false);
 x.controller.open("claim");assert.equal(x.apply(choice),false);
 x.controller.open("objection");assert.equal(x.apply(choice),false);
 x.controller.preview(choice.key);
 assert.deepEqual(x.state.observerRaw,raw);assert.equal(x.spy.saves,0);
 assert.equal(x.apply(choice),true);
 assert.equal(x.apply(choice),false);
 for(const c of engine.CENTERS) assert.equal(x.state.observerRaw[c],raw[c]+choice.effects[c]);
 assert.equal(Object.values(engine.normalize(x.state.observerRaw)).reduce((a,b)=>a+b),100);
 assert.equal(x.state.choiceLog.length,1);
 assert.equal(x.state.choiceLog[0].source,"story_observer_choice_v2");
 assert.equal(x.spy.saves,1);assert.equal(x.spy.renders,1);
});
test("cancel removes permission to commit; wrong choice cannot use another preview",()=>{
 const x=setup();x.controller.open("claim");x.controller.open("objection");
 x.controller.preview(meta.observer_choices[0].key);
 assert.equal(x.apply(meta.observer_choices[1]),false);
 x.controller.cancel();assert.equal(x.apply(meta.observer_choices[0]),false);
});
test("language re-render preserves opened evidence but clears pending confirmation",()=>{
 const x=setup();x.controller.open("claim");x.controller.open("objection");
 x.controller.preview(meta.observer_choices[0].key);
 const next=x.reader.begin(story,"en",x.state.observerRaw,x.state.choiceLog);
 assert.equal(next.ready(),true);assert.equal(next.canConfirm(meta.observer_choices[0].key),false);
 assert.match(next.html(s=>s),/Dilan/);assert.equal(x.spy.saves,0);
});
test("legacy recorded choice is preserved and does not require replay",()=>{
 const c=meta.observer_choices[0],entry={story_id:"HUM-0009",key:c.key,effects:c.effects,source:"story_observer_choice_v2"};
 const x=setup("tr",[entry]);
 assert.equal(x.controller.recorded(),true);assert.equal(x.apply(c),false);
 assert.equal(x.state.choiceLog.length,1);assert.equal(x.spy.saves,0);
});
test("other stories and unsupported scene languages retain ordinary choice behavior",()=>{
 const x=setup();
 assert.equal(x.apply(meta.observer_choices[0],{id:"HUM-0008"}),true);
 const y=setup("de");
 assert.equal(y.controller,null);assert.equal(y.apply(meta.observer_choices[0]),true);
});
test("missing module fails closed only for an enabled scene",()=>{
 const app=fs.readFileSync(path.join(ROOT,"web/assets/app.js"),"utf8");
 const fn=app.slice(app.indexOf("function applyChoice("),app.indexOf("function updateStaticUi("));
 const c=vm.createContext({window:{},state:{locale:"tr"},recordedStoryChoice:()=>null});
 vm.runInContext(fn,c);
 assert.equal(c.applyChoice(story,meta.observer_choices[0]),false);
});
test("built fixture contains scene and runtime assets in script order",()=>{
 const data=JSON.parse(fs.readFileSync(path.join(ROOT,"site/data/universe.json"),"utf8"));
 assert.equal(data.stories.find(s=>s.id==="HUM-0009").objection_scene.source_revision,4);
 const index=fs.readFileSync(path.join(ROOT,"site/index.html"),"utf8");
 assert.ok(index.indexOf("observer-engine.v2.js")<index.indexOf("hum0009-flow.v1.js"));
 assert.ok(index.indexOf("hum0009-flow.v1.js")<index.indexOf("hum0009-objection-reader.v1.js"));
 assert.ok(index.indexOf("hum0009-objection-reader.v1.js")<index.indexOf("assets/app.js"));
 assert.equal(fs.readFileSync(path.join(ROOT,"site/assets/hum0009-flow.v1.js"),"utf8"),
 fs.readFileSync(path.join(ROOT,"experiments/hum0009-objection/flow.js"),"utf8"));
});
