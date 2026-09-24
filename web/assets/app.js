const CENTER_KEYS = ["HUMAN", "LIGHT", "DARK"];
const OBSERVER_BASELINE = {HUMAN:34,LIGHT:33,DARK:33};
const OBSERVER_MODEL_VERSION = 2;
const observerEngine = window.HCUObserverEngine;
const GENERIC_CHOICES = [
  {key:"human_direction", label_key:"generic_choice_human", label:"Follow the human meaning, agency, and relationship in this story.", effects:{HUMAN:10,LIGHT:2,DARK:2}},
  {key:"light_direction", label_key:"generic_choice_light", label:"Seek greater clarity, structure, knowledge, and protection.", effects:{HUMAN:2,LIGHT:10,DARK:2}},
  {key:"dark_direction", label_key:"generic_choice_dark", label:"Follow the unresolved possibility, freedom, and transformation.", effects:{HUMAN:2,LIGHT:2,DARK:10}}
];

function storedJson(key, fallback) {
  try { const value=localStorage.getItem(key); return value===null ? fallback : JSON.parse(value); }
  catch { return fallback; }
}

const storedObserverRaw = storedJson("hcu.observerRaw", null);
const storedReadIds = storedJson("hcu.readIds", []);
const storedChoiceLog = storedJson("hcu.choiceLog", []);
const storedPath = storedJson("hcu.quantumPath", []);
const state = {
  data: null,
  locale: "en",
  mode: "read",
  storyId: null,
  readIds: new Set(Array.isArray(storedReadIds)?storedReadIds:[]),
  observerRaw: storedObserverRaw || {...OBSERVER_BASELINE},
  choiceLog: Array.isArray(storedChoiceLog)?storedChoiceLog:[],
  path: Array.isArray(storedPath)?storedPath:[]
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
window.HCUI18n = { t: (key,fallback=key) => t(key,fallback), get locale(){ return state.locale; } };
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
  const w=storyWeights(story); return [...CENTER_KEYS].sort((a,b)=>w[b]-w[a])[0];
}
function centerLabel(center){
  if(center==="HUMAN") return t("human_center","Human Center");
  if(center==="LIGHT") return t("light_center","Light Center");
  return t("dark_center","Dark Center");
}
function normalize(raw){
  if(observerEngine) return observerEngine.normalize(raw);
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
function projectedObserver(effects){
  const next={...state.observerRaw};
  CENTER_KEYS.forEach(c=>next[c]=Number(next[c]||0)+Number(effects?.[c]||0));
  return normalize(next);
}
function recordedStoryChoice(storyId){
  if(observerEngine) return observerEngine.storyChoice(state.choiceLog,storyId);
  return [...state.choiceLog].reverse().find(entry=>entry.story_id===storyId&&!String(entry.source||"").startsWith("first_vibration_intro"))||null;
}
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
  const ranked=observerEngine?.rankRecommendations({stories:orderedStories(),currentId,readIds:[...state.readIds],profile:observerState(),path:state.path});
  if(ranked) return ranked[0]||null;
  const candidates=orderedStories().filter(s=>s.id!==currentId&&!state.readIds.has(s.id));
  return candidates.map(story=>({story,profileDistance:profileDistance(observerState(),storyWeights(story)),linked:false,diversityPenalty:0})).sort((a,b)=>a.profileDistance-b.profileDistance)[0]||null;
}
function applyChoice(story,choice){
  if(recordedStoryChoice(story.id)) return false;
  const effects=choice.effects||{};
  CENTER_KEYS.forEach(c=>state.observerRaw[c]=Number(state.observerRaw[c]||0)+Number(effects[c]||0));
  state.readIds.add(story.id);
  state.choiceLog.push({story_id:story.id,key:choice.key,label:choiceLabel(choice,"en"),effects:{HUMAN:Number(effects.HUMAN||0),LIGHT:Number(effects.LIGHT||0),DARK:Number(effects.DARK||0)},source:"story_observer_choice_v2",chosen_at:new Date().toISOString()});
  saveObserver();
  render();
  return true;
}
function updateStaticUi(){
  document.documentElement.lang=state.locale;
  const projectName=t("project_name","Human-Centered Universe"); document.title=projectName;
  document.querySelector(".brand strong").textContent=projectName;
  modeButtons.forEach(button=>button.textContent=t(button.dataset.mode,button.textContent));
  const live=document.getElementById("live-status"); if(live) live.textContent=t("live_universe","Live universe");
  const spans=document.querySelectorAll("footer span"); if(spans[0]) spans[0].textContent=projectName; if(spans[2]) spans[2].textContent=t("creation_unfinished","Creation is unfinished.");
}
function bindStoryNavigation(root=app){
  root.querySelectorAll("[data-story]").forEach(el=>{
    el.addEventListener("click",()=>setStory(el.dataset.story));
    el.addEventListener("keydown",event=>{
      if(event.key!=="Enter"&&event.key!==" ") return;
      event.preventDefault(); setStory(el.dataset.story);
    });
  });
}
function recommendationReason(result){
  if(!result) return "";
  const reasons=[t("recommendation_profile_match","Matches your complete HUMAN/LIGHT/DARK profile")];
  if(result.linked) reasons.push(t("recommendation_connected","connected to this story"));
  if(result.diversityPenalty===0) reasons.push(t("recommendation_diversity","opens a less-repeated center in your recent path"));
  return reasons.join(" · ");
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
  const requested=story.content?.[state.locale]; const fallbackLang=story.source_language||state.data?.fallback_language||"en"; const content=requested||story.content?.[fallbackLang]||story.content?.en||""; const fallback=!requested;
  const related=(story.links||[]).map(link=>({link,story:storyById(link.target)})).filter(x=>x.story);
  const w=storyWeights(story); const p=primaryCenter(story); const nextResult=recommendNext(story.id); const next=nextResult?.story;
  const choices=choicesFor(story);
  const recorded=recordedStoryChoice(story.id);
  const backId=state.path.length>1 ? state.path[state.path.length-2] : null;
  const connections=related.length?related.map(({link,story:target})=>`<button class="connection" data-story="${target.id}"><span class="badge ${primaryCenter(target)}">${escapeHtml(linkTypeLabel(link.type))}</span><strong>${escapeHtml(storyTitle(target))}</strong><small>${escapeHtml(linkNote(story,link))}</small></button>`).join(""):`<p class="muted">${t("no_results","No matching stories.")}</p>`;
  const choiceButtons=choices.map(c=>{
    const projected=projectedObserver(c.effects||{}); const selected=recorded?.key===c.key;
    return `<button class="observer-choice${selected?" selected":""}" data-choice="${escapeHtml(c.key)}" ${recorded?"disabled":""} aria-pressed="${selected}"><strong>${escapeHtml(choiceLabel(c))}</strong><small>${escapeHtml(t("projected_observer_state","Projected Observer State"))}: ${formatWeights(projected)}</small></button>`;
  }).join("");
  const recordedDefinition=recorded?choices.find(choice=>choice.key===recorded.key):null;
  const choiceStatus=recorded?`<div class="choice-recorded" role="status"><strong>${escapeHtml(t("choice_recorded","Choice recorded"))}</strong><span>${escapeHtml(recordedDefinition?choiceLabel(recordedDefinition):(recorded.label||recorded.key||""))}</span></div>`:"";
  const recommendation=next?`<div class="recommendation"><span>${t("recommended_next","Recommended next story")}</span><button data-story="${next.id}"><strong>${escapeHtml(storyTitle(next))}</strong><small>${centerLabel(primaryCenter(next))} · ${formatWeights(storyWeights(next))}</small><small class="recommendation-reason">${escapeHtml(recommendationReason(nextResult))}</small></button></div>`:"";

  app.innerHTML=`<section class="reader-layout">
    ${renderObserverCard()}
    <article class="reader-card">
      ${fallback?`<div class="fallback">${t("translation_unavailable")}</div>`:""}
      <div class="story-kicker"><span class="badge ${p}">${escapeHtml(centerLabel(p))}</span><span>${escapeHtml(story.id)}</span><span>·</span><span>${escapeHtml(requested?state.locale:fallbackLang)} · ${translationStatus(story,requested?state.locale:fallbackLang)}</span></div>
      <div class="story-profile"><strong>${t("center_profile","Center profile")}</strong>${weightBars(w)}</div>
      ${storyHero(story)}
      <div class="story-content">${markdownToHtml(content)}</div>
      <section class="choice-panel"><h2>${t("choose_path","Choose what calls you next")}</h2><p class="muted">${t("choice_help","Preview how a choice changes your Observer State, then confirm it once. The recommendation uses your complete profile, story connections, and recent path; you remain free to choose any node.")}</p>${choiceStatus}<div class="choice-grid">${choiceButtons}</div><div id="choice-preview" class="choice-preview" hidden></div></section>
      <div class="reader-toolbar"><button class="action-button" id="back-path" ${!backId?"disabled":""}>← ${t("back_in_path","Back in my path")}</button><button class="action-button" id="mark-read">${state.readIds.has(story.id)?t("read_again","Read again"):t("mark_read","Mark as read")}</button><button class="action-button primary" id="open-explore">${t("other_possibilities","Explore other possibilities")}</button></div>
      ${recommendation}
    </article>
    <aside class="side-card"><strong>${t("story_connections","Story connections")}</strong><div class="connection-list">${connections}</div></aside>
  </section>`;

  bindStoryNavigation();
  app.querySelectorAll("[data-choice]").forEach(el=>el.addEventListener("click",()=>{
    const c=choices.find(x=>x.key===el.dataset.choice); if(!c||recordedStoryChoice(story.id)) return;
    const preview=document.getElementById("choice-preview"); const projected=projectedObserver(c.effects||{});
    preview.hidden=false;
    preview.innerHTML=`<strong>${escapeHtml(t("confirm_observer_choice","Confirm this Observer choice?"))}</strong><p>${escapeHtml(choiceLabel(c))}</p>${weightBars(projected)}<div class="create-actions"><button type="button" class="action-button primary" id="confirm-choice">${escapeHtml(t("confirm_choice","Confirm choice"))}</button><button type="button" class="action-button" id="cancel-choice">${escapeHtml(t("cancel","Cancel"))}</button></div>`;
    document.getElementById("confirm-choice")?.addEventListener("click",()=>applyChoice(story,c));
    document.getElementById("cancel-choice")?.addEventListener("click",()=>{ preview.hidden=true; preview.innerHTML=""; el.focus(); });
    preview.scrollIntoView({behavior:"smooth",block:"nearest"});
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
  const categoryCounts=CENTER_KEYS.reduce((acc,center)=>{ acc[center]=stories.filter(s=>primaryCenter(s)===center).length; return acc; },{});
  const points=stories.map(s=>{ const pt=trianglePoint(storyWeights(s)); const read=state.readIds.has(s.id); const label=`${storyTitle(s)} · ${formatWeights(storyWeights(s))}`; return `<g class="triangle-node" data-story="${s.id}" tabindex="0" role="button" aria-label="${escapeHtml(label)}"><circle cx="${pt.x}" cy="${pt.y}" r="${s.id===state.data.origin_node?9:6}" class="${primaryCenter(s)} ${read?"read":""}"><title>${escapeHtml(label)}</title></circle></g>`; }).join("");
  const cards=stories.map(s=>`<article class="story-node" data-story="${s.id}" tabindex="0" role="button"><div><span class="node-id">${escapeHtml(s.id)}</span><span class="badge ${primaryCenter(s)}">${escapeHtml(centerLabel(primaryCenter(s)))}</span>${state.readIds.has(s.id)?`<span class="read-dot">${t("read_status","Read")}</span>`:""}</div><h3>${escapeHtml(storyTitle(s))}</h3><p>${escapeHtml(storySummary(s))}</p>${weightBars(storyWeights(s))}</article>`).join("");
  app.innerHTML=`<section>
    <div class="explore-head"><div><h1>${t("explore","Explore")}</h1><p>${t("explore_triangle_intro","HUMAN + LIGHT + DARK = 100. Every node occupies a position in the same triangular state space.")}</p></div><input id="story-search" class="search-box" type="search" placeholder="${t("search","Search stories")}"></div>
    <div class="explore-counts" aria-label="Story counts by category">${CENTER_KEYS.map(center=>`<div class="explore-count"><span class="badge ${center}">${escapeHtml(centerLabel(center))}</span><strong>${categoryCounts[center]}</strong><small>${escapeHtml(t("stories_count_label","stories"))}</small></div>`).join("")}</div>
    <div class="triangle-card"><svg viewBox="0 0 600 500" aria-label="${escapeHtml(t("triangle_state_space","HCU triangular state space"))}"><polygon points="300,45 55,455 545,455" class="triangle-shape"/><text x="300" y="27" text-anchor="middle" class="triangle-label HUMAN">${escapeHtml(centerLabel("HUMAN")).toUpperCase()}</text><text x="45" y="485" text-anchor="start" class="triangle-label LIGHT">${escapeHtml(centerLabel("LIGHT")).toUpperCase()}</text><text x="555" y="485" text-anchor="end" class="triangle-label DARK">${escapeHtml(centerLabel("DARK")).toUpperCase()}</text>${points}</svg></div>
    <div id="node-grid" class="node-grid">${cards}</div>
  </section>`;
  bindStoryNavigation();
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
function renderSettings(){
  app.innerHTML=`<section class="settings-page"><div class="explore-head"><div><h1>${t("settings","Settings")}</h1><p>${t("settings_intro","Manage reading progress and your Observer journey on this device.")}</p></div></div>
    <div class="settings-grid">
      <article class="create-card"><h2>${t("reading_progress","Reading Progress")}</h2><p>${t("restart_story_description","Mark the current story as unread and return to its beginning. Observer choices and scores are preserved.")}</p><button type="button" class="action-button" id="restart-current-story">${t("restart_current_story","Restart Current Story")}</button></article>
      <article class="create-card"><h2>${t("export_journey","Export Journey")}</h2><p>${t("export_journey_description","Download a portable JSON record of your Observer profile, choices, read stories, and Quantum Path.")}</p><button type="button" class="action-button primary" id="export-journey">${t("download_journey_json","Download Journey JSON")}</button></article>
      <article class="create-card danger-card"><h2>${t("journey_data","Journey Data")}</h2><p>${t("reset_journey_description","Clear reading history, choices, HUMAN/LIGHT/DARK scores, Quantum Path, and the First Vibration intro record on this device.")}</p><button type="button" class="action-button danger-button" id="reset-entire-journey">${t("reset_entire_journey","Reset Entire Journey")}</button></article>
    </div></section>`;
  document.getElementById("restart-current-story")?.addEventListener("click",()=>{
    state.readIds.delete(state.storyId); saveObserver(); state.mode="read";
    modeButtons.forEach(b=>b.classList.toggle("active",b.dataset.mode==="read")); setUrl(); render(); window.scrollTo({top:0,behavior:"smooth"});
  });
  document.getElementById("export-journey")?.addEventListener("click",()=>{
    const profile=observerState();
    const payload={schema:"hcu-observer-journey",version:2,exported_at:new Date().toISOString(),observer_model_version:OBSERVER_MODEL_VERSION,observer_profile:profile,observer_raw:{...state.observerRaw},dominant_center:dominantCenter(profile),read_story_ids:[...state.readIds],quantum_path:[...state.path],choices:state.choiceLog.map(entry=>({...entry}))};
    const blob=new Blob([JSON.stringify(payload,null,2)+"\n"],{type:"application/json"});
    const url=URL.createObjectURL(blob); const anchor=document.createElement("a");
    anchor.href=url; anchor.download=`hcu-observer-journey-${new Date().toISOString().slice(0,10)}.json`; anchor.click();
    setTimeout(()=>URL.revokeObjectURL(url),0);
  });
  document.getElementById("reset-entire-journey")?.addEventListener("click",()=>{
    const warning=t("reset_journey_warning","Reset your entire journey? Reading progress, choices, and Observer State will be permanently cleared on this device.");
    if(!window.confirm(warning)) return;
    ["hcu.readIds","hcu.observerRaw","hcu.observerModelVersion","hcu.choiceLog","hcu.quantumPath","hcu.lastStory","hcu.firstVibrationIntro.v1","hcu.firstVibrationIntro.v2"].forEach(key=>localStorage.removeItem(key));
    const url=new URL(location.href); url.searchParams.set("mode","read"); url.searchParams.set("story",state.data.origin_node||"BRG-0002"); url.searchParams.set("intro","1"); url.searchParams.set("lang",state.locale); location.replace(url);
  });
}
function render(){ if(!state.data)return; updateStaticUi(); if(state.mode==="explore")renderExplore(); else if(state.mode==="create")renderCreate(); else if(state.mode==="settings")renderSettings(); else renderRead(); setUrl(); }

function displayLanguageName(code){
  try { return new Intl.DisplayNames(["en"],{type:"language"}).of(code) || code; } catch { return code; }
}
async function boot(){
  const response=await fetch("./data/universe.json",{cache:"no-store"}); if(!response.ok) throw new Error("Universe data could not be loaded.");
  state.data=await response.json(); githubLink.href=state.data.repository;
  if(observerEngine){
    const migration=observerEngine.migrateObserverRaw(storedObserverRaw,state.choiceLog,localStorage.getItem("hcu.observerModelVersion"));
    state.observerRaw=migration.value;
    localStorage.setItem("hcu.observerRaw",JSON.stringify(state.observerRaw));
    localStorage.setItem("hcu.observerModelVersion",String(observerEngine.MODEL_VERSION));
  }
  const params=new URLSearchParams(location.search); const stored=localStorage.getItem("hcu.lang"); const requested=params.get("lang")||stored||state.data.default_language||"en";
  state.locale=(state.data.languages||["en"]).includes(requested)?requested:"en";
  languageSelect.innerHTML=(state.data.languages||["en"]).map(code=>`<option value="${escapeHtml(code)}">${escapeHtml(displayLanguageName(code))} — ${escapeHtml(code)}</option>`).join("");
  languageSelect.value=state.locale; languageSelect.addEventListener("change",()=>{ state.locale=languageSelect.value; localStorage.setItem("hcu.lang",state.locale); render(); window.dispatchEvent(new CustomEvent("hcu:languagechange",{detail:{lang:state.locale}})); });
  const requestedStory=params.get("story"); const last=localStorage.getItem("hcu.lastStory");
  state.storyId=storyById(requestedStory)?.id || storyById(last)?.id || state.data.origin_node;
  const requestedMode=params.get("mode"); state.mode=["read","explore","create","settings"].includes(requestedMode)?requestedMode:"read";
  modeButtons.forEach(button=>{ button.classList.toggle("active",button.dataset.mode===state.mode); button.addEventListener("click",()=>setMode(button.dataset.mode)); });
  recordPath(state.storyId); render();
}
boot().catch(error=>{ console.error(error); app.innerHTML=`<section class="empty-card">${escapeHtml(error.message)}</section>`; });
