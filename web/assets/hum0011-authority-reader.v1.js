(function(root,factory){
  if(typeof module==="object"&&module.exports) module.exports=factory;
  else root.HCUAuthorityReader=factory(root.HCUAuthorityFlowFactory,root.HCUObserverEngine);
})(typeof globalThis!=="undefined"?globalThis:this,function(flowFactory,engine){
"use strict";
const assessedBySource=new Set();
let active=null;
const text={
  tr:{assess:"Kanıtı ve yetkiyi inceliyorum",claim:"Hesap",claimBody:"İki sistem hesapları onaylamış. Bu, insan etkisini bağımsız olarak doğrulamıyor.",authority:"Yetki",authorityBody:"Yetki yalnız danışmanlık için verilmiş. Yaşayan konsey sınırlamaya itiraz ediyor.",unknown:"Açık sorular",unknownBody:"Ayrı seslerin korunması, ayrılma imkânı ve bilinç durumu çözülmüş değil.",waiting:"Önce kanıtın, yetkinin ve belirsizliğin farkını inceliyorum.",ready:"İncelemeyi açtım. Bu, anladığımı veya yetki verildiğini kanıtlamaz. Şimdi yaklaşımımı önizleyebilirim.",recorded:"Önceki seçimim korunuyor. Bu tercih uygulama veya kapatma yetkisi vermiyor.",scope:"Bu vakada sınırlama yürürlüğe konmuyor; olası varlığın desteğini kesme kararı da verilmiyor.",plan:"Seçimimin somut devamı",layers:"Bu sahne bildiğini nasıl biliyor?"},
  en:{assess:"I examine evidence and authority",claim:"Calculation",claimBody:"Two systems approved the calculations. This does not independently validate human effects.",authority:"Authority",authorityBody:"Only advisory authority was delegated. The living council objects to the restriction.",unknown:"Open questions",unknownBody:"Separate voices, exit feasibility and consciousness remain unresolved.",waiting:"First I examine the difference between evidence, authority and uncertainty.",ready:"I opened the assessment. This does not prove understanding or grant authority. I can now preview my approach.",recorded:"My earlier choice is preserved. This preference grants no enforcement or shutdown authority.",scope:"In this case the restriction is not enforced; no decision to cut off the possible being's support is made either.",plan:"What my choice does next",layers:"How this scene knows what it knows"}
};
const layers={
  tr:[
    ["Yerleşik bilim","Bu sahne bilincin sürdüğünü, kuantum düşünce aktarımını veya biyolojik ortak bilincin mümkün olduğunu göstermiyor."],
    ["Gerçek mühendislik","Kaynak sınama, test, itiraz ve yetki sınırlarını ayrı izlemek uygulanabilir yöntemlerdir. Bu arayüz gerçek bir yetkilendirme sistemi değildir."],
    ["Yorum","İki sistemin anlaşması ortak bir varsayımı gizleyebilir; bunun her durumda böyle olduğu ileri sürülmüyor."],
    ["Felsefe","Uzmanlık, meşru yetki, kişisel kimlik ve olası yeni bilincin hakları ayrı sorulardır."],
    ["İnanç ve kültürel anlam","Göbekli Tepe'den esinlenen mekân kurgudur. Benlik, ölüm ve devamlılık farklı kültürlerde tek bir anlama indirgenmez."],
    ["Bilim kurgu","Birbirine bağlı biyolojik beyinler, Maran, FIRST VIBRATION ve kuantum düşünce ağı olası bir kurgu gerçekliğine aittir."]
  ],
  en:[
    ["Established science","This scene demonstrates no persistence of consciousness, quantum thought transfer or biological collective consciousness."],
    ["Real engineering","Source checks, tests, appeals and tracking authority separately are feasible methods. This interface is not a real authorization system."],
    ["Interpretation","Agreement between two systems may conceal a shared assumption; this is not asserted to occur in every case."],
    ["Philosophy","Expertise, legitimate authority, personal identity and a possible new consciousness's rights are distinct questions."],
    ["Belief and cultural meaning","The Göbekli Tepe-inspired setting is fictional. Self, death and continuity are not reduced to one meaning across cultures."],
    ["Science fiction","Interconnected biological brains, Maran, FIRST VIBRATION and quantum thought links belong to a possible fictional reality."]
  ]
};
function required(story,locale){return story?.id==="HUM-0011"&&Boolean(story.authority_scene)&&["tr","en"].includes(locale);}
function begin(story,locale,raw,log){
  active=null;
  if(!required(story,locale)||typeof flowFactory!=="function"||!engine) return null;
  const scene=story.authority_scene, words=text[locale];
  let flow,model;
  try { flow=flowFactory(engine,scene); model=flow.start(story,raw,log); }
  catch(error){ return null; }
  const cacheKey=story.id+":"+scene.source.meta_blob_sha+":"+scene.source.story_tr_blob_sha;
  if(!model.recorded&&assessedBySource.has(cacheKey)) model=flow.advance(model,{type:"assess"});
  const current={
    storyId:story.id,
    ready:()=>Boolean(model.assessment),
    recorded:()=>Boolean(model.recorded),
    assess(){model=flow.advance(model,{type:"assess"});assessedBySource.add(cacheKey);},
    preview(key){model=flow.advance(model,{type:"preview",key});},
    canConfirm(key){return model.phase==="preview"&&model.preview?.key===key;},
    cancel(){model=flow.advance(model,{type:"cancel"});},
    planHtml(key,escape){
      const plan=scene.plans[key];
      return plan?'<div class="authority-plan"><strong>'+escape(words.plan)+'</strong><p>'+escape(plan[locale]||plan.en)+'</p><p>'+escape(words.scope)+'</p></div>':"";
    },
    html(escape){
      return '<section class="authority-reader" aria-labelledby="authority-reader-title"><h3 id="authority-reader-title">'+escape(scene.title[locale]||scene.title.en)+'</h3><p>'+escape(scene.opening[locale]||scene.opening.en)+'</p><dl class="authority-facts">'+
        [[words.claim,words.claimBody],[words.authority,words.authorityBody],[words.unknown,words.unknownBody]].map(([heading,body])=>'<dt><strong>'+escape(heading)+'</strong></dt><dd>'+escape(body)+'</dd>').join("")+'</dl>'+
        '<button type="button" class="action-button" id="authority-assess" '+(model.assessment||model.recorded?"disabled":"")+'>'+escape(words.assess)+'</button><p id="authority-reader-status" role="status"></p>'+
        (model.recorded?current.planHtml(model.recorded.key,escape):"")+
        '<details class="epistemic-notes"><summary>'+escape(words.layers)+'</summary>'+layers[locale].map(([heading,body])=>'<p><strong>'+escape(heading)+':</strong> '+escape(body)+'</p>').join("")+'</details></section>';
    },
    bind(root,onReady){
      const update=()=>{
        const status=root.querySelector("#authority-reader-status");
        if(status) status.textContent=current.recorded()?words.recorded:current.ready()?words.ready:words.waiting;
        const button=root.querySelector("#authority-assess");
        if(button) button.disabled=current.recorded()||current.ready();
        onReady(current.ready());
      };
      root.querySelector("#authority-assess")?.addEventListener("click",()=>{current.assess();update();});
      update();
    }
  };
  active=current;
  return current;
}
function canConfirm(storyId,key){return active?.storyId===storyId&&active.canConfirm(key);}
return {required,begin,canConfirm};
});
