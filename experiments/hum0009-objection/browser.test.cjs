"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");
const nodeFlow = require("./flow.cjs");
const scene = require("./scene.json");
const meta = require("../../stories/human/HUM-0009/meta.json");
const plain = value => JSON.parse(JSON.stringify(value));
function browserFlow() {
 const context = vm.createContext({});
 vm.runInContext(fs.readFileSync(path.join(__dirname,"../../web/assets/observer-engine.v2.js"),"utf8"),context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,"flow.js"),"utf8"),context);
 assert.equal(typeof context.HCUObjectionFlowFactory,"function");
 return context.HCUObjectionFlowFactory(context.HCUObserverEngine,scene);
}
for (const choice of meta.observer_choices) test("browser/Node transition parity: "+choice.key,() => {
 const browser = browserFlow();
 let n=nodeFlow.start(meta), b=browser.start(meta);
 const events=[{type:"open",id:"claim"},{type:"open",id:"objection"},
 {type:"preview",key:choice.key},{type:"back"},{type:"preview",key:choice.key},
 {type:"confirm",key:choice.key},{type:"confirm",key:choice.key}];
 for (const event of events) {
  n=nodeFlow.advance(n,event); b=browser.advance(b,event);
  assert.deepEqual(plain(b),plain(n));
  assert.equal(Object.values(browser.profile(b)).reduce((x,y)=>x+y,0),100);
 }
 assert.equal(b.log.length,1);
});
test("browser path rejects early confirm, missing evidence and source drift",() => {
 const flow=browserFlow(), s=flow.start(meta), key=meta.observer_choices[0].key;
 assert.throws(()=>flow.advance(s,{type:"confirm",key}),/preview_required/);
 assert.throws(()=>flow.advance(s,{type:"preview",key}),/evidence_not_opened/);
 assert.throws(()=>flow.start({...meta,revision:{version:999}}),/source_revision_mismatch/);
});
