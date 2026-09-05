const CENTER_KEYS = ["HUMAN", "LIGHT", "DARK"];
const GENERIC_CHOICES = [
  {key:"human_direction", label_key:"generic_choice_human", label:"Follow the human meaning, agency, and relationship in this story.", effects:{HUMAN:10,LIGHT:2,DARK:2}},
  {key:"light_direction", label_key:"generic_choice_light", label:"Seek greater clarity, structure, knowledge, and protection.", effects:{HUMAN:2,LIGHT:10,DARK:2}},
  {key:"dark_direction", label_key:"generic_choice_dark", label:"Follow the unresolved possibility, freedom, and transformation.", effects:{HUMAN:2,LIGHT:2,DARK:10}}
];

const state = {
  data: null,
  locale: "en",
  mode: "read",
  storyId: null,
  readIds: new Set(JSON.parse(localStorage.getItem("hcu.readIds") || "[]")),
  observerRaw: JSON.parse(localStorage.getItem("hcu.observerRaw") || '{"HUMAN":0,"LIGHT":0,"DARK":0}'),
  choiceLog: JSON.parse(localStorage.getItem("hcu.choiceLog") || "[]"),
  path: JSON.parse(localStorage.getItem("hcu.quantumPath") || "[]")
};

const app = document.getElementById("app");
const languageSelect = document.getElementById("language-select");
const githubLink = document.getElementById("github-link");
const modeButtons = [...document.querySelectorAll(".mode-button")];

function escapeHtml(value = "") {
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}
function inlineMarkdown(value) {
  let s = escapeHtml(value);
  s = s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
  s = s.replace(/`(.+?)`/g,"<code>$1</code>");
  s = s.replace(/\*(.+?)\*/g,"<em>$1</em>");
  return s;
}
function markdownToHtml(md="") {
  const lines = md.replace(/\r/g,"").split("\n");
  const out=[]; let para=[];
  const flush=()=>{ if(para.length){ out.push(`<p>${inlineMarkdown(para.join(" "))}</p>`); para=[]; } };
  for(const raw of lines){
    const line=raw.trimEnd();
    if(!line.trim()){ flush(); continue; }
    if(line.startsWith("# ")){ flush(); out.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`); continue; }
    if(line.startsWith("## ")){ flush(); out.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`); continue; }
    if(line.startsWith("### ")){ flush(); out.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`); continue; }
    if(line.startsWith("> ")){ flush(); out.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`); continue; }
    if(line.trim()==="---"){ flush(); out.push("<hr>"); continue; }
    para.push(line.trim());
  }
  flush(); return out.join("\n");
}
function t(key,fallback=key){ return state.data?.locales?.[state.locale]?.[key] || state.data?.locales?.en?.[key] || fallback; }
function storyById(id){ return state.data?.stories?.find(s=>s.id===id); }
function orderedStories(){ return [...(state.data?.stories||[])].sort((a,b)=>(a.observation_order??9999)-(b.observation_order??9999)||a.id.localeCompare(b.id)); }
function currentStory(){ return storyById(state.storyId) || storyById(state.data?.origin_node) || orderedStories()[0]; }
function storyTitle(story){
  const content=story?.content?.[state.locale];
  if(content){ const m=content.match(/^#\s+(.+)$/m); if(m) return m[1].trim(); }
  return story?.localized?.[state.locale]?.title || story?.title || story?.id || "";
}
function storySummary(story){ return story?.localized?.[state.locale]?.summary || story?.summary || ""; }
function storyWeights(story){
  const w=story?.center_weights || {};
  return {HUMAN:Number(w.HUMAN||0),LIGHT:Number(w.LIGHT||0),DARK:Number(w.DARK||0)};
}
function primaryCenter(story){
  if(CENTER_KEYS.includes(story?.primary_center)) return story.primary_center;
  const w=storyWeights(story); return CENTER_KEYS.sort((a,b)=>w[b]-w[a])[0];
}
function centerLabel(center){
  if(center==="HUMAN") return t("human_center","Human Center");
  if(center==="LIGHT") return t("light_center","Light Center");
  return t("dark_center","Dark Center");
}
function normalize(raw){
  const vals={HUMAN:Math.max(0,Number(raw.HUMAN||0)),LIGHT:Math.max(0,Number(raw.LIGHT||0)),DARK:Math.max(0,Number(raw.DARK||0))};
  const total=vals.HUMAN+vals.LIGHT+vals.DARK;
  if(!total) return {HUMAN:34,LIGHT:33,DARK:33};
  const exact={HUMAN:vals.HUMAN/total*100,LIGHT:vals.LIGHT/total*100,DARK:vals.DARK/total*100};
  const floor={HUMAN:Math.floor(exact.HUMAN),LIGHT:Math.floor(exact.LIGHT),DARK:Math.floor(exact.DARK)};
  let remain=100-floor.HUMAN-floor.LIGHT-floor.DARK;
  Object.keys(exact).sort((a,b)=>(exact[b]-floor[b])-(exact[a]-floor[a])).slice(0,remain).forEach(k=>floor[k]++);
  return floor;
}
function observerState(){ return normalize(state.observerRaw); }
function dominantCenter(profile=observerState()){
  return [...CENTER_KEYS].sort((a,b)=>profile[b]-profile[a] || CENTER_KEYS.indexOf(a)-CENTER_KEYS.indexOf(b))[0];
}
function profileDistance(a,b){ return Math.sqrt(CENTER_KEYS.reduce((sum,c)=>sum+(Number(a[c]||0)-Number(b[c]||0))**2,0)); }
function saveObserver(){
  localStorage.setItem("hcu.observerRaw",JSON.stringify(state.observerRaw));
  localStorage.setItem("hcu.choiceLog",JSON.stringify(state.choiceLog));
  localStorage.setItem("hcu.quantumPath",JSON.stringify(state.path));
  localStorage.setItem("hcu.readIds",JSON.stringify([...state.readIds]));
}
function storyHero(story){
  const hero=story?.hero_image; if(!hero?.src) return "";
  const alt=hero.alt?.[state.locale]||hero.alt?.en||storyTitle(story);
  const caption=hero.caption?.[state.locale]||hero.caption?.en||"";
  return `<figure class="story-hero"><img src="${escapeHtml(hero.src)}" alt="${escapeHtml(alt)}" loading="eager">${caption?`<figcaption>${escapeHtml(caption)}</figcaption>`:""}</figure>`;
}
function linkNote(sourceStory,link){ return sourceStory?.localized?.[state.locale]?.link_notes?.[link.target] || link?.note || ""; }
function linkTypeLabel(type){ return t(`link_${type}`,type); }
function translationStatus(story,lang){
  const s=story.translations?.[lang]?.status;
  if(s==="canonical") return t("canonical","Canonical");
  if(s==="reviewed") return t("reviewed_translation","Reviewed Translation");
  if(s==="community") return t("community_translation","Community Translation");
  return s||"";
}
function shortCenterLabel(center){
  if(center==="HUMAN") return t("human_short","Human");
  if(center==="LIGHT") return t("light_short","Light");
  return t("dark_short","Dark");
}
function formatWeights(w){
  return `${shortCenterLabel("HUMAN")} ${w.HUMAN}% · ${shortCenterLabel("LIGHT")} ${w.LIGHT}% · ${shortCenterLabel("DARK")} ${w.DARK}%`;
}
function weightBars(w){
  return `<div class="weight-bars">
    <div><span>${escapeHtml(centerLabel("HUMAN"))}</span><b>${w.HUMAN}%</b><i><em class="HUMAN" style="width:${w.HUMAN}%"></em></i></div>
    <div><span>${escapeHtml(centerLabel("LIGHT"))}</span><b>${w.LIGHT}%</b><i><em class="LIGHT" style="width:${w.LIGHT}%"></em></i></div>
    <div><span>${escapeHtml(centerLabel("DARK"))}</span><b>${w.DARK}%</b><i><em class="DARK" style="width:${w.DARK}%"></em></i></div>
  </div>`;
}
function recordPath(id){
  if(!id) return;
  if(state.path[state.path.length-1]!==id){ state.path.push(id); saveObserver(); }
}
function setUrl(){
  const url=new URL(location.href); url.searchParams.set("mode",state.mode);
  if(state.storyId) url.searchParams.set("story",state.storyId);
  url.searchParams.set("lang",state.locale); history.replaceState({},"",url);
}
function setMode(mode){ state.mode=mode; modeButtons.forEach(b=>b.classList.toggle("active",b.dataset.mode===mode)); setUrl(); render(); }
function setStory(id,{record=true}={}){
  if(!storyById(id)) return;
  state.storyId=id; localStorage.setItem("hcu.lastStory",id); state.mode="read";
  if(record) recordPath(id);
  modeButtons.forEach(b=>b.classList.toggle("active",b.dataset.mode==="read")); setUrl(); render(); window.scrollTo({top:0,behavior:"smooth"});
}
function markRead(id){ state.readIds.add(id); saveObserver(); render(); }
function choicesFor(story){
  const choices=story?.observer_choices;
  return Array.isArray(choices)&&choices.length ? choices : GENERIC_CHOICES;
}
function choiceLabel(choice, locale=state.locale){
  if(!choice) return "";
  if(choice.labels && typeof choice.labels==="object"){
    return choice.labels[locale] || choice.labels.en || choice.label || choice.key || "";
  }
  if(choice.localized?.[locale]?.label) return choice.localized[locale].label;
  if(choice.label_key){
    return state.data?.locales?.[locale]?.[choice.label_key]
      || state.data?.locales?.en?.[choice.label_key]
      || choice.label
      || choice.key
      || "";
  }
  return choice.label || choice.key || "";
}
function recommendNext(currentId){
  const profile=observerState(); const dominant=dominantCenter(profile);
  const candidates=orderedStories().filter(s=>s.id!==currentId && !state.readIds.has(s.id));
  if(!candidates.length) return null;
  return candidates.sort((a,b)=>{
    const aw=storyWeights(a), bw=storyWeights(b);
    return bw[dominant]-aw[dominant] || profileDistance(profile,aw)-profileDistance(profile,bw) || (a.observation_order??9999)-(b.observation_order??9999);
  })[0];
}
function applyChoice(story,choice){
  const effects=choice.effects||{};
  CENTER_KEYS.forEach(c=>state.observerRaw[c]=Number(state.observerRaw[c]||0)+Number(effects[c]||0));
  state.readIds.add(story.id);
  state.choiceLog.push({story_id:story.id,key:choice.key,label:choiceLabel(choice,"en"),effects:{HUMAN:Number(effects.HUMAN||0),LIGHT:Number(effects.LIGHT||0),DARK:Number(effects.DARK||0)}});
  saveObserver();
  const next=recommendNext(story.id);
  if(next) setStory(next.id);
  else render();
}
function updateStaticUi(){
  document.documentElement.lang=state.locale;
  const projectName=t("project_name","Human-Centered Universe"); document.title=projectName;
  document.querySelector(".brand strong").textContent=projectName;
  modeButtons.forEach(button=>button.textContent=t(button.dataset.mode,button.textContent));
  const live=document.getElementById("live-status"); if(live) live.textContent=t("live_universe","Live universe");
  const spans=document.querySelectorAll("footer span"); if(spans[0]) spans[0].textContent=projectName; if(spans[2]) spans[2].textContent=t("creation_unfinished","Creation is unfinished.");
}

function renderObserverCard(){
  const profile=observerState(); const dom=dominantCenter(profile);
  const pathTitles=state.path.slice(-8).map(id=>storyById(id)).filter(Boolean).map(s=>`<button data-story="${s.id}">${escapeHtml(storyTitle(s))}</button>`).join("");
  return `<aside class="side-card observer-card">
    <strong>${t("observer_state","Observer State")}</strong>
    ${weightBars(profile)}
    <p class="dominant"><span class="badge ${dom}">${escapeHtml(centerLabel(dom))}</span></p>
    <strong>${t("quantum_path","Quantum Path")}</strong>
    <div class="path-list">${pathTitles||`<span class="muted">${t("start_reading","Start at First Vibration")}</span>`}</div>
  </aside>`;
}

function renderRead(){
  const story=currentStory(); if(!story) return;
  state.storyId=story.id; recordPath(story.id);
  const requested=story.content?.[state.locale]; const content=requested||story.content?.en||""; const fallback=!requested&&state.locale!=="en";
  const related=(story.links||[]).map(link=>({link,story:storyById(link.target)})).filter(x=>x.story);
  const w=storyWeights(story); const p=primaryCenter(story); const next=recommendNext(story.id);
  const choices=choicesFor(story);
  const backId=state.path.length>1 ? state.path[state.path.length-2] : null;
  const connections=related.length?related.map(({link,story:target})=>`<button class="connection" data-story="${target.id}"><span class="badge ${primaryCenter(target)}">${escapeHtml(linkTypeLabel(link.type))}</span><strong>${escapeHtml(storyTitle(target))}</strong><small>${escapeHtml(linkNote(story,link))}</small></button>`).join(""):`<p class="muted">${t("no_results","No matching stories.")}</p>`;
  const choiceButtons=choices.map(c=>{
    const cw=normalize(c.effects||{});
    return `<button class="observer-choice" data-choice="${escapeHtml(c.key)}"><strong>${escapeHtml(choiceLabel(c))}</strong><small>${formatWeights(cw)}</small></button>`;
  }).join("");
  const recommendation=next?`<div class="recommendation"><span>${t("recommended_next","Recommended next story")}</span><button data-story="${next.id}"><strong>${escapeHtml(storyTitle(next))}</strong><small>${centerLabel(primaryCenter(next))} · ${formatWeights(storyWeights(next))}</small></button></div>`:"";

  app.innerHTML=`<section class="reader-layout">
    ${renderObserverCard()}
    <article class="reader-card">
      ${fallback?`<div class="fallback">${t("translation_unavailable")}</div>`:""}
      <div class="story-kicker"><span class="badge ${p}">${escapeHtml(centerLabel(p))}</span><span>${escapeHtml(story.id)}</span><span>·</span><span>${translationStatus(story,requested?state.locale:"en")}</span></div>
      <div class="story-profile"><strong>${t("center_profile","Center profile")}</strong>${weightBars(w)}</div>
      ${storyHero(story)}
      <div class="story-content">${markdownToHtml(content)}</div>
      <section class="choice-panel"><h2>${t("choose_path","Choose what calls you next")}</h2><p class="muted">${t("choice_help","Your choice changes your Observer State. The universe will recommend an unread story from your strongest center, but you can always choose another node in Explore.")}</p><div class="choice-grid">${choiceButtons}</div></section>
      <div class="reader-toolbar"><button class="action-button" id="back-path" ${!backId?"disabled":""}>← ${t("back_in_path","Back in my path")}</button><button class="action-button" id="mark-read">${state.readIds.has(story.id)?t("read_again","Read again"):t("mark_read","Mark as read")}</button><button class="action-button primary" id="open-explore">${t("other_possibilities","Explore other possibilities")}</button></div>
      ${recommendation}
    </article>
    <aside class="side-card"><strong>${t("story_connections","Story connections")}</strong><div class="connection-list">${connections}</div></aside>
  </section>`;

  app.querySelectorAll("[data-story]").forEach(el=>el.addEventListener("click",()=>setStory(el.dataset.story)));
  app.querySelectorAll("[data-choice]").forEach(el=>el.addEventListener("click",()=>{
    const c=choices.find(x=>x.key===el.dataset.choice); if(c) applyChoice(story,c);
  }));
  document.getElementById("back-path")?.addEventListener("click",()=>{ if(backId){ state.path.pop(); saveObserver(); setStory(backId,{record:false}); } });
  document.getElementById("mark-read")?.addEventListener("click",()=>markRead(story.id));
  document.getElementById("open-explore")?.addEventListener("click",()=>setMode("explore"));
}

function trianglePoint(w){
  const H={x:300,y:45}, L={x:55,y:455}, D={x:545,y:455};
  return {x:(w.HUMAN*H.x+w.LIGHT*L.x+w.DARK*D.x)/100,y:(w.HUMAN*H.y+w.LIGHT*L.y+w.DARK*D.y)/100};
}
function renderExplore(){
  const stories=orderedStories();
  const points=stories.map(s=>{ const pt=trianglePoint(storyWeights(s)); const read=state.readIds.has(s.id); return `<g class="triangle-node" data-story="${s.id}" tabindex="0"><circle cx="${pt.x}" cy="${pt.y}" r="${s.id===state.data.origin_node?9:6}" class="${primaryCenter(s)} ${read?"read":""}"><title>${escapeHtml(storyTitle(s))} · ${formatWeights(storyWeights(s))}</title></circle></g>`; }).join("");
  const cards=stories.map(s=>`<article class="story-node" data-story="${s.id}"><div><span class="node-id">${escapeHtml(s.id)}</span><span class="badge ${primaryCenter(s)}">${escapeHtml(centerLabel(primaryCenter(s)))}</span>${state.readIds.has(s.id)?`<span class="read-dot">${t("read_status","Read")}</span>`:""}</div><h3>${escapeHtml(storyTitle(s))}</h3><p>${escapeHtml(storySummary(s))}</p>${weightBars(storyWeights(s))}</article>`).join("");
  app.innerHTML=`<section>
    <div class="explore-head"><div><h1>${t("explore","Explore")}</h1><p>${t("explore_triangle_intro","HUMAN + LIGHT + DARK = 100. Every node occupies a position in the same triangular state space.")}</p></div><input id="story-search" class="search-box" type="search" placeholder="${t("search","Search stories")}"></div>
    <div class="triangle-card"><svg viewBox="0 0 600 500" aria-label="${escapeHtml(t("triangle_state_space","HCU triangular state space"))}"><polygon points="300,45 55,455 545,455" class="triangle-shape"/><text x="300" y="27" text-anchor="middle" class="triangle-label HUMAN">${escapeHtml(centerLabel("HUMAN")).toUpperCase()}</text><text x="45" y="485" text-anchor="start" class="triangle-label LIGHT">${escapeHtml(centerLabel("LIGHT")).toUpperCase()}</text><text x="555" y="485" text-anchor="end" class="triangle-label DARK">${escapeHtml(centerLabel("DARK")).toUpperCase()}</text>${points}</svg></div>
    <div id="node-grid" class="node-grid">${cards}</div>
  </section>`;
  app.querySelectorAll("[data-story]").forEach(el=>el.addEventListener("click",()=>setStory(el.dataset.story)));
  document.getElementById("story-search")?.addEventListener("input",e=>{
    const q=e.target.value.trim().toLowerCase(); document.querySelectorAll(".story-node").forEach(node=>{
      const s=storyById(node.dataset.story); const hay=`${s.id} ${storyTitle(s)} ${storySummary(s)} ${primaryCenter(s)}`.toLowerCase(); node.style.display=!q||hay.includes(q)?"":"none";
    });
  });
}

function renderCreate(){
  const repo=state.data.repository;
  app.innerHTML=`<section><div class="explore-head"><div><h1>${t("create","Create")}</h1><p>${t("create_intro")}</p></div></div><div class="create-grid">
    <article class="create-card"><h2>${t("story_builder","Story Node Builder")}</h2><p>${t("story_builder_description","Create a multilingual story package, calculate HUMAN/LIGHT/DARK position from 30 criteria, generate localized observer choices, and export GitHub-ready files.")}</p><a class="action-button primary" href="./story-node-builder.html">${t("story_builder","Story Node Builder")}</a></article>
    <article class="create-card"><h2>${t("open_repository","Open repository")}</h2><p>${t("git_narrative_description","Git is part of the narrative architecture: commit creates reality; connection transforms meaning.")}</p><div class="create-actions"><a class="action-button primary" href="${repo}" target="_blank" rel="noopener">${t("open_repository")}</a><a class="action-button" href="${repo}/fork" target="_blank" rel="noopener">${t("fork_universe")}</a></div></article>
    <article class="create-card"><h2>${t("contribution_guide","Contribution guide")}</h2><p>${t("language_policy_description","English is the canonical source; any language can be a source or translation layer under the same story ID.")}</p><div class="create-actions"><a class="action-button primary" href="${repo}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">${t("contribution_guide")}</a><a class="action-button" href="${repo}/issues" target="_blank" rel="noopener">${t("issues","Issues")}</a></div></article>
  </div></section>`;
}
function render(){ if(!state.data)return; updateStaticUi(); if(state.mode==="explore")renderExplore(); else if(state.mode==="create")renderCreate(); else renderRead(); setUrl(); }

function displayLanguageName(code){
  try { return new Intl.DisplayNames(["en"],{type:"language"}).of(code) || code; } catch { return code; }
}
async function boot(){
  const response=await fetch("./data/universe.json",{cache:"no-store"}); if(!response.ok) throw new Error("Universe data could not be loaded.");
  state.data=await response.json(); githubLink.href=state.data.repository;
  const params=new URLSearchParams(location.search); const stored=localStorage.getItem("hcu.lang"); const requested=params.get("lang")||stored||state.data.default_language||"en";
  state.locale=(state.data.languages||["en"]).includes(requested)?requested:"en";
  languageSelect.innerHTML=(state.data.languages||["en"]).map(code=>`<option value="${escapeHtml(code)}">${escapeHtml(displayLanguageName(code))} — ${escapeHtml(code)}</option>`).join("");
  languageSelect.value=state.locale; languageSelect.addEventListener("change",()=>{ state.locale=languageSelect.value; localStorage.setItem("hcu.lang",state.locale); render(); });
  const requestedStory=params.get("story"); const last=localStorage.getItem("hcu.lastStory");
  state.storyId=storyById(requestedStory)?.id || storyById(last)?.id || state.data.origin_node;
  const requestedMode=params.get("mode"); state.mode=["read","explore","create"].includes(requestedMode)?requestedMode:"read";
  modeButtons.forEach(button=>{ button.classList.toggle("active",button.dataset.mode===state.mode); button.addEventListener("click",()=>setMode(button.dataset.mode)); });
  recordPath(state.storyId); render();
}
boot().catch(error=>{ console.error(error); app.innerHTML=`<section class="empty-card">${escapeHtml(error.message)}</section>`; });
