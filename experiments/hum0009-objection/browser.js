"use strict";
const copy = {
 en: {
  scope:"Experimental scene · this session only. Your reader journey is not changed.",
  evidence:"I examine the records", hint:"Open both documents to preview a choice. Opening a document does not prove that I understand it.",
  choices:"I choose an approach",profile:"Current observer profile",preview:"I preview my choice",
  note:"HUMAN + LIGHT + DARK = 100. These coordinates do not score belief, ego or purification.",
  confirm:"I confirm this approach",back:"I return to the choices",language:"Language",
  caption:"Twelve symbolic pillars and a contribution network. Illustration, not an archaeological reconstruction.",
  loading:"Loading the scene…",ready:"The two records are waiting.",opened:"Both records have been opened. I can preview an approach.",
  done:"My approach is confirmed for this session.",error:"The scene could not be loaded. Serve the repository over HTTP and check the source story revision; no choice has been recorded.",
  alt:"My outstretched hands before a contribution network, an unfinished crown and twelve pillars."
 },
 tr: {
  scope:"Deneysel sahne · yalnız bu oturumda. Okuyucu yolculuğum değişmez.",
  evidence:"Kayıtları inceliyorum",hint:"Bir seçimi önizlemek için iki belgeyi de açıyorum. Belgeyi açmam, onu anladığımı kanıtlamaz.",
  choices:"Yaklaşımımı seçiyorum",profile:"Mevcut gözlemci profili",preview:"Seçimimi önizliyorum",
  note:"HUMAN + LIGHT + DARK = 100. Bu değerler inancı, egoyu veya arınmayı puanlamaz.",
  confirm:"Bu yaklaşımı onaylıyorum",back:"Seçeneklere dönüyorum",language:"Dil",
  caption:"On iki simgesel sütun ve katkı ağı. Arkeolojik rekonstrüksiyon değil, illüstrasyon.",
  loading:"Sahne yükleniyor…",ready:"İki kayıt beni bekliyor.",opened:"İki belgeyi de açtım. Bir yaklaşımı önizleyebilirim.",
  done:"Yaklaşımımı bu oturum için onayladım.",error:"Sahne yüklenemedi. Depoyu HTTP üzerinden açıp kaynak hikâye sürümünü kontrol etmeliyim; seçim kaydedilmedi.",
  alt:"Uzanan ellerimin önünde katkı ağı, tamamlanmamış bir taç ve on iki sütun."
 }
};
const $ = id => document.getElementById(id);
let lang = new URLSearchParams(location.search).get("lang") === "tr" ? "tr" : "en";
let flow, state, scene, meta, failed=false;
function text(id, value) { $(id).textContent = value; }
function percentages(value) {
 return ["HUMAN","LIGHT","DARK"].map(c => c + " " + value[c] + "%").join(" · ");
}
function status() {
 text("load-status", state.phase === "confirmed" ? copy[lang].done :
  state.opened.length === scene.evidence.length ? copy[lang].opened : copy[lang].ready);
}
function sync() {
 const terminal = ["confirmed","recorded"].includes(state.phase);
 document.querySelectorAll("[data-choice]").forEach(button => {
  button.disabled = terminal || state.opened.length !== scene.evidence.length;
  button.setAttribute("aria-pressed", String(state.preview?.key === button.dataset.choice));
 });
 text("profile", percentages(flow.profile(state)));
 $("preview").hidden = !state.preview;
 if (state.preview) {
  text("selected", state.choices.find(c => c.key === state.preview.key).labels[lang]);
  text("projection", percentages(state.preview.profile));
 }
 $("confirmation").hidden = !terminal;
 if (terminal) text("confirmation", scene.confirmation[lang] + " " + state.choices.find(c => c.key === state.recorded.key).labels[lang]);
 status();
}
function apply(event) {
 state = flow.advance(state, event);
 sync();
}
function render() {
 document.documentElement.lang = lang;
 document.title = scene.title[lang] + " · HCU";
 $("language").value = lang;
 const t = copy[lang];
 for (const [id,key] of [["scope","scope"],["language-label","language"],["evidence-title","evidence"],
 ["evidence-hint","hint"],["choice-title","choices"],["profile-title","profile"],["profile-note","note"],
 ["preview-title","preview"],["confirm","confirm"],["back","back"],["caption","caption"]]) text(id,t[key]);
 text("title",scene.title[lang]); text("opening",scene.opening[lang]);
 $("cover").alt = t.alt;
 $("evidence").replaceChildren();
 for (const item of scene.evidence) {
  const detail = document.createElement("details");
  const summary = document.createElement("summary");
  const p = document.createElement("p");
  summary.textContent = item.title[lang]; p.textContent = item.text[lang];
  detail.append(summary,p); detail.open = state.opened.includes(item.id);
  detail.addEventListener("toggle",() => { if (detail.open) apply({type:"open",id:item.id}); });
  $("evidence").append(detail);
 }
 $("choices").replaceChildren();
 for (const choice of state.choices) {
  const button = document.createElement("button");
  button.type="button"; button.dataset.choice=choice.key; button.id="choice-"+choice.key;
  button.textContent=choice.labels[lang];
  button.addEventListener("click",() => {
   apply({type:"preview",key:choice.key}); $("confirm").focus();
  });
  $("choices").append(button);
 }
 sync();
}
async function json(path) {
 const response = await fetch(path,{cache:"no-store"});
 if (!response.ok) throw new Error("load_failed");
 return response.json();
}
$("language").value=lang;
$("language").addEventListener("change",() => {
 lang=$("language").value;
 if (state) render();
 else { document.documentElement.lang=lang; text("load-status",failed ? copy[lang].error : copy[lang].loading); }
});
$("confirm").addEventListener("click",() => {
 if (!state?.preview) return;
 const key=state.preview.key;
 apply({type:"confirm",key});
 $("confirmation").tabIndex=-1; $("confirmation").focus();
});
$("back").addEventListener("click",() => {
 const key=state?.preview?.key;
 if (!key) return;
 apply({type:"back"}); $("choice-"+key).focus();
});
(async function init() {
 try {
  [scene,meta]=await Promise.all([json("./scene.json"),json("../../stories/human/HUM-0009/meta.json")]);
  flow=globalThis.HCUObjectionFlowFactory(globalThis.HCUObserverEngine,scene);
  state=flow.start(meta);
  render(); $("interaction").hidden=false;
 } catch (error) {
  failed=true; state=null; $("interaction").hidden=true;
  text("load-status",copy[lang].error);
 }
})();
