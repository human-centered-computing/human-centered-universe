(function(root,factory){
  if(typeof module==="object"&&module.exports) module.exports=factory;
  else root.HCUObjectionReader=factory(root.HCUObjectionFlowFactory,root.HCUObserverEngine);
})(typeof globalThis!=="undefined"?globalThis:this,function(flowFactory,engine){
"use strict";
const openedByRevision=new Map();
let active=null;
function required(story,locale){
  return story?.id==="HUM-0009" && Boolean(story.objection_scene) && ["tr","en"].includes(locale);
}
function begin(story,locale,raw,log){
  active=null;
  if(!required(story,locale)) return null;
  const scene=story.objection_scene;
  const flow=flowFactory(engine,scene);
  let model=flow.start(story,raw,log);
  const cacheKey=story.id+":"+scene.source_revision;
  const opened=openedByRevision.get(cacheKey)||new Set();
  for(const id of opened) model=flow.advance(model,{type:"open",id});
  const current={
    storyId:story.id,
    ready:()=>scene.evidence.every(e=>model.opened.includes(e.id)),
    recorded:()=>Boolean(model.recorded),
    preview(key){ model=flow.advance(model,{type:"preview",key}); },
    canConfirm(key){ return model.phase==="preview"&&model.preview?.key===key; },
    cancel(){ model=flow.advance(model,{type:"back"}); },
    open(id){
      model=flow.advance(model,{type:"open",id});
      opened.add(id); openedByRevision.set(cacheKey,opened);
    },
    html(escape){
      const title=scene.title[locale]||scene.title.en;
      const help=locale==="tr"?"İki belgeyi de açtıktan sonra yaklaşımımı seçiyorum. Açmış olmam, anladığımı kanıtlamaz.":"I choose my approach after opening both records. Opening does not prove understanding.";
      return '<section class="objection-reader" aria-labelledby="objection-reader-title"><h3 id="objection-reader-title">'+escape(title)+'</h3><p>'+escape(help)+'</p>'+
        scene.evidence.map(e=>'<details class="epistemic-notes" data-objection-evidence="'+escape(e.id)+'" '+(model.opened.includes(e.id)?"open":"")+'><summary>'+escape(e.title[locale]||e.title.en)+'</summary><p>'+escape(e.text[locale]||e.text.en)+'</p></details>').join("")+
        '<p id="objection-reader-status" role="status"></p></section>';
    },
    bind(root,onReady){
      const update=()=>{
        const status=root.querySelector("#objection-reader-status");
        if(status) status.textContent=current.recorded()?
          (locale==="tr"?"Önceki seçimim korunuyor.":"My earlier choice is preserved."):
          current.ready()?(locale==="tr"?"Belgeleri açtım. Yaklaşımımı önizleyebilirim.":"I opened the records. I can preview my approach."):
          (locale==="tr"?"Seçimden önce iki belgeyi de açıyorum.":"I open both records before choosing.");
        onReady(current.ready());
      };
      root.querySelectorAll("[data-objection-evidence]").forEach(detail=>{
        detail.addEventListener("toggle",()=>{ if(detail.open){current.open(detail.dataset.objectionEvidence);update();} });
      });
      update();
    }
  };
  active=current;
  return current;
}
function canConfirm(storyId,key){return active?.storyId===storyId&&active.canConfirm(key);}
return {required,begin,canConfirm};
});
