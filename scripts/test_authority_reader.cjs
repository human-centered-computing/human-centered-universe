"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const ROOT=path.resolve(__dirname,"..");
const engine=require("../web/assets/observer-engine.v2.js");
const scene=require("../experiments/hum0011-authority/scene.json");
const meta=require("../stories/human/HUM-0011/meta.json");
const factoryContext=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(ROOT,"experiments/hum0011-authority/flow.js"),"utf8"),factoryContext);
const createReader=require("../web/assets/hum0011-authority-reader.v1.js");
const story={...meta,authority_scene:scene};
function setup(locale="tr",log=[]){
  const reader=createReader(factoryContext.HCUAuthorityFlowFactory,engine);
  const state={locale,observerRaw:{...engine.BASELINE},readIds:new Set(),choiceLog:structuredClone(log)};
  const controller=reader.begin(story,locale,state.observerRaw,state.choiceLog);
  const app=fs.readFileSync(path.join(ROOT,"web/assets/app.js"),"utf8");
  const apply=app.slice(app.indexOf("function applyChoice("),app.indexOf("function updateStaticUi("));
  const spy={saves:0,renders:0};
  const context=vm.createContext({state,window:{HCUAuthorityReader:reader},CENTER_KEYS:engine.CENTERS,
    recordedStoryChoice:id=>engine.storyChoice(state.choiceLog,id),choiceLabel:c=>c.key,
    saveObserver:()=>spy.saves++,render:()=>spy.renders++});
  vm.runInContext(apply,context);
  return {reader,controller,state,spy,apply:(c,s=story)=>context.applyChoice(s,c)};
}
for(const choice of meta.observer_choices) test("reader records "+choice.key+" once with the original writer",()=>{
  const x=setup(),raw=structuredClone(x.state.observerRaw);
  assert.equal(x.apply(choice),false);
  x.controller.assess();assert.equal(x.apply(choice),false);
  x.controller.preview(choice.key);
  assert.deepEqual(x.state.observerRaw,raw);assert.equal(x.spy.saves,0);
  assert.equal(x.apply(choice),true);assert.equal(x.apply(choice),false);
  for(const c of engine.CENTERS) assert.equal(x.state.observerRaw[c],raw[c]+choice.effects[c]);
  assert.equal(Object.values(engine.normalize(x.state.observerRaw)).reduce((a,b)=>a+b),100);
  assert.equal(x.state.choiceLog.length,1);
  assert.equal(x.state.choiceLog[0].source,"story_observer_choice_v2");
  assert.equal(x.spy.saves,1);assert.equal(x.spy.renders,1);
  assert.match(x.controller.planHtml(choice.key,s=>s),/authority-plan/);
});
test("cancel revokes confirmation and another choice cannot borrow its preview",()=>{
  const x=setup();x.controller.assess();x.controller.preview(meta.observer_choices[0].key);
  assert.equal(x.apply(meta.observer_choices[1]),false);
  x.controller.cancel();assert.equal(x.apply(meta.observer_choices[0]),false);
  assert.equal(x.spy.saves,0);
});
test("language rerender preserves assessment but clears pending confirmation",()=>{
  const x=setup();x.controller.assess();x.controller.preview(meta.observer_choices[0].key);
  const next=x.reader.begin(story,"en",x.state.observerRaw,x.state.choiceLog);
  assert.equal(next.ready(),true);assert.equal(next.canConfirm(meta.observer_choices[0].key),false);
  assert.match(next.html(s=>s),/Who granted authority/);
  assert.equal(x.spy.saves,0);
});
test("recorded journey remains recorded after a reader restart",()=>{
  const c=meta.observer_choices[1],entry={story_id:story.id,key:c.key,effects:c.effects,source:"story_observer_choice_v2"};
  const x=setup("tr",[entry]);
  assert.equal(x.controller.recorded(),true);assert.equal(x.apply(c),false);
  assert.match(x.controller.html(s=>s),/authority-plan/);
  assert.equal(x.state.choiceLog.length,1);assert.equal(x.spy.saves,0);
});
test("assessment button enables choices without writing a journey",()=>{
  const x=setup(),status={},button={disabled:false,addEventListener(type,handler){this.handler=handler;}};
  const root={querySelector:selector=>selector==="#authority-reader-status"?status:button};
  const updates=[];
  x.controller.bind(root,value=>updates.push(value));
  assert.deepEqual(updates,[false]);button.handler();
  assert.deepEqual(updates,[false,true]);assert.equal(button.disabled,true);
  assert.match(status.textContent,/yetki verildiğini kanıtlamaz/);
  assert.equal(x.spy.saves,0);
});
test("other stories and unsupported scene languages retain ordinary choices",()=>{
  const x=setup();assert.equal(x.apply(meta.observer_choices[0],{id:"HUM-0010"}),true);
  const y=setup("de");assert.equal(y.controller,null);assert.equal(y.apply(meta.observer_choices[0]),true);
});
test("an enabled scene without its runtime refuses to record",()=>{
  const app=fs.readFileSync(path.join(ROOT,"web/assets/app.js"),"utf8");
  const fn=app.slice(app.indexOf("function applyChoice("),app.indexOf("function updateStaticUi("));
  const context=vm.createContext({window:{},state:{locale:"tr"},recordedStoryChoice:()=>null});
  vm.runInContext(fn,context);
  assert.equal(context.applyChoice(story,meta.observer_choices[0]),false);
});
test("reader module failure returns a disabled-scene result rather than throwing",()=>{
  assert.equal(createReader(null,engine).begin(story,"tr",engine.BASELINE,[]),null);
  assert.equal(createReader(factoryContext.HCUAuthorityFlowFactory,engine).begin({...story,observer_choices:[]},"tr",engine.BASELINE,[]),null);
});
test("browser and terminal use the same decision core",()=>{
  const flow=require("../experiments/hum0011-authority/flow.cjs");
  const inputs={metaText:fs.readFileSync(path.join(ROOT,"stories/human/HUM-0011/meta.json"),"utf8"),
    storyText:fs.readFileSync(path.join(ROOT,"stories/human/HUM-0011/content/tr.md"),"utf8")};
  const browser=factoryContext.HCUAuthorityFlowFactory(engine,scene);
  let a=flow.start(inputs),b=browser.start(meta);
  for(const event of [{type:"assess"},{type:"preview",key:meta.observer_choices[0].key},{type:"confirm",key:meta.observer_choices[0].key}]){
    a=flow.advance(a,event);b=browser.advance(b,event);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(b)),a);
});
test("built reader embeds the pinned scene and identical shared flow before app.js",()=>{
  const data=JSON.parse(fs.readFileSync(path.join(ROOT,"site/data/universe.json"),"utf8"));
  assert.deepEqual(data.stories.find(s=>s.id===story.id).authority_scene,scene);
  const index=fs.readFileSync(path.join(ROOT,"site/index.html"),"utf8");
  assert.ok(index.indexOf("observer-engine.v2.js")<index.indexOf("hum0011-flow.v1.js"));
  assert.ok(index.indexOf("hum0011-flow.v1.js")<index.indexOf("hum0011-authority-reader.v1.js"));
  assert.ok(index.indexOf("hum0011-authority-reader.v1.js")<index.indexOf("assets/app.js"));
  const crypto=require("node:crypto");
  const hash=crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT,"site/assets/app.js"))).digest("hex").slice(0,12);
  assert.ok(index.includes('assets/app.js?v='+hash+'"'),"built app uses a content-derived cache key");
  assert.equal(fs.readFileSync(path.join(ROOT,"site/assets/hum0011-flow.v1.js"),"utf8"),fs.readFileSync(path.join(ROOT,"experiments/hum0011-authority/flow.js"),"utf8"));
});
