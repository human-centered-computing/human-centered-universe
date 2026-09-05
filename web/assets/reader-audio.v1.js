(() => {
  const app = document.getElementById("app");
  const synth = window.speechSynthesis;
  const supported = !!(synth && window.SpeechSynthesisUtterance);
  if (!app) return;

  const T = {
    tr: {title:"Sesli Oku",play:"Başlat",pause:"Duraklat",resume:"Devam",stop:"Durdur",prev:"Önceki paragraf",next:"Sonraki paragraf",voice:"Ses",speed:"Hız",ready:"Sesli okuma hazır.",reading:"Okunuyor",paused:"Duraklatıldı.",stopped:"Durduruldu.",done:"Bölüm tamamlandı.",unsupported:"Bu tarayıcı sesli okumayı desteklemiyor.",empty:"Okunacak metin bulunamadı.",part:"Parça",auto:"Varsayılan ses",error:"Sesli okuma başlatılamadı."},
    en: {title:"Read Aloud",play:"Play",pause:"Pause",resume:"Resume",stop:"Stop",prev:"Previous paragraph",next:"Next paragraph",voice:"Voice",speed:"Speed",ready:"Read aloud is ready.",reading:"Reading",paused:"Paused.",stopped:"Stopped.",done:"Chapter complete.",unsupported:"This browser does not support read aloud.",empty:"No readable text was found.",part:"Part",auto:"Default voice",error:"Read aloud could not start."}
  };

  let activeKey = "", blocks = [], index = 0, speaking = false, paused = false, token = 0, statusText = "";

  const ctx = () => {
    const u = new URL(location.href);
    return {mode:u.searchParams.get("mode") || "read", story:u.searchParams.get("story") || "", lang:u.searchParams.get("lang") || document.documentElement.lang || "en"};
  };
  const tr = (lang,key) => (T[lang] || T.en)[key] || T.en[key] || key;
  const posKey = (story,lang) => "hcu.audio.position." + story + "." + lang;

  function collect() {
    const root = app.querySelector(".story-content");
    return root ? [...root.querySelectorAll("h1,h2,h3,p,blockquote")].filter(el => el.closest(".story-content") === root && el.textContent.trim()) : [];
  }

  function clearMark() {
    blocks.forEach(el => el.classList.remove("audio-reading-block"));
  }

  function mark(scroll = true) {
    clearMark();
    const el = blocks[index];
    if (!el) return;
    el.classList.add("audio-reading-block");
    if (scroll) el.scrollIntoView({behavior:"smooth",block:"center"});
  }

  function save() {
    const c = ctx();
    if (c.story) localStorage.setItem(posKey(c.story,c.lang), String(index));
  }

  function restore(story,lang,len) {
    const n = Number(localStorage.getItem(posKey(story,lang)) || 0);
    return Number.isInteger(n) && n >= 0 && n < len ? n : 0;
  }

  function rate() {
    return Number(app.querySelector("[data-audio-rate]")?.value || localStorage.getItem("hcu.audio.rate") || 1);
  }

  function selectedVoice(lang) {
    const uri = app.querySelector("[data-audio-voice]")?.value;
    return uri ? synth.getVoices().find(v => v.voiceURI === uri) || null : null;
  }

  function fillVoices() {
    if (!supported) return;
    const c = ctx(), select = app.querySelector("[data-audio-voice]");
    if (!select) return;
    const all = synth.getVoices(), primary = c.lang.toLowerCase().split("-")[0];
    const match = all.filter(v => v.lang.toLowerCase().startsWith(primary));
    const choices = match.length ? match : all;
    const wanted = select.value || localStorage.getItem("hcu.audio.voice." + c.lang) || "";

    select.innerHTML = "";
    const auto = document.createElement("option");
    auto.value = ""; auto.textContent = tr(c.lang,"auto"); select.appendChild(auto);

    choices.forEach(v => {
      const o = document.createElement("option");
      o.value = v.voiceURI; o.textContent = v.name + " · " + v.lang; select.appendChild(o);
    });

    if (choices.some(v => v.voiceURI === wanted)) select.value = wanted;
    else if (match.length) select.value = (match.find(v => v.localService) || match[0]).voiceURI;
  }

  function update() {
    const bar = app.querySelector(".audio-reader");
    if (!bar) return;
    const c = ctx();
    const play = bar.querySelector("[data-audio-play]");
    play.textContent = paused ? "▶ " + tr(c.lang,"resume") : speaking ? "⏸ " + tr(c.lang,"pause") : "▶ " + tr(c.lang,"play");
    play.setAttribute("aria-pressed", String(speaking || paused));
    bar.querySelector("[data-audio-stop]").disabled = !speaking && !paused;
    bar.querySelector("[data-audio-prev]").disabled = !blocks.length || index <= 0;
    bar.querySelector("[data-audio-next]").disabled = !blocks.length || index >= blocks.length - 1;
    bar.querySelector("[data-audio-progress]").textContent = blocks.length ? tr(c.lang,"part") + " " + (index + 1) + " / " + blocks.length : "0 / 0";

    let s = statusText;
    if (!s) {
      if (!supported) s = tr(c.lang,"unsupported");
      else if (!blocks.length) s = tr(c.lang,"empty");
      else if (paused) s = tr(c.lang,"paused");
      else if (speaking) s = tr(c.lang,"reading") + " — " + (index + 1) + " / " + blocks.length;
      else s = tr(c.lang,"ready");
    }
    bar.querySelector("[data-audio-status]").textContent = s;
  }

  function stop(announce = true) {
    token++;
    if (supported) synth.cancel();
    speaking = false; paused = false; clearMark();
    statusText = announce ? tr(ctx().lang,"stopped") : "";
    update();
  }

  function speak() {
    if (!supported || !blocks.length) return update();
    if (index < 0 || index >= blocks.length) index = 0;

    const c = ctx(), text = blocks[index].textContent.trim(), my = ++token;
    synth.cancel(); speaking = true; paused = false; statusText = ""; save(); mark(true); update();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = c.lang === "tr" ? "tr-TR" : c.lang === "en" ? "en-US" : c.lang;
    u.rate = rate();
    const v = selectedVoice(c.lang); if (v) u.voice = v;

    u.onstart = () => { if (my === token) { speaking = true; paused = false; update(); } };
    u.onend = () => {
      if (my !== token) return;
      speaking = false; paused = false;
      if (index < blocks.length - 1) {
        index++; save();
        setTimeout(() => { if (my === token) speak(); }, 80);
      } else {
        index = 0; save(); clearMark(); statusText = tr(c.lang,"done"); update();
      }
    };
    u.onerror = e => {
      if (my !== token || e.error === "canceled" || e.error === "interrupted") return;
      speaking = false; paused = false; clearMark(); statusText = tr(c.lang,"error"); update();
    };

    setTimeout(() => {
      if (my === token) {
        try { synth.speak(u); }
        catch (_) { speaking=false; statusText=tr(c.lang,"error"); update(); }
      }
    }, 40);
  }

  function playPause() {
    statusText = "";
    if (!supported || !blocks.length) return update();
    if (paused) { synth.resume(); paused=false; speaking=true; mark(false); return update(); }
    if (speaking) { synth.pause(); paused=true; speaking=false; return update(); }
    speak();
  }

  function move(delta) {
    if (!blocks.length) return;
    const active = speaking || paused;
    token++; if (supported) synth.cancel(); speaking=false; paused=false; statusText="";
    index = Math.max(0, Math.min(blocks.length - 1, index + delta)); save(); mark(true); update();
    if (active) setTimeout(speak, 60);
  }

  function build(root) {
    const c = ctx(), bar = document.createElement("section");
    bar.className = "audio-reader";
    bar.setAttribute("aria-label", tr(c.lang,"title"));
    bar.innerHTML =
      '<div class="audio-reader-head"><strong>🔊 ' + tr(c.lang,"title") + '</strong><span data-audio-progress></span></div>' +
      '<div class="audio-reader-controls">' +
      '<button type="button" class="audio-button primary" data-audio-play></button>' +
      '<button type="button" class="audio-button" data-audio-stop>■ ' + tr(c.lang,"stop") + '</button>' +
      '<button type="button" class="audio-button icon" data-audio-prev aria-label="' + tr(c.lang,"prev") + '" title="' + tr(c.lang,"prev") + '">⏮</button>' +
      '<button type="button" class="audio-button icon" data-audio-next aria-label="' + tr(c.lang,"next") + '" title="' + tr(c.lang,"next") + '">⏭</button>' +
      '<label class="audio-field"><span>' + tr(c.lang,"speed") + '</span><select data-audio-rate><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select></label>' +
      '<label class="audio-field audio-voice-field"><span>' + tr(c.lang,"voice") + '</span><select data-audio-voice></select></label>' +
      '</div><div class="audio-reader-status" data-audio-status aria-live="polite"></div>';

    root.insertAdjacentElement("beforebegin", bar);
    const r = bar.querySelector("[data-audio-rate]"), savedRate = localStorage.getItem("hcu.audio.rate") || "1";
    r.value = [...r.options].some(o => o.value === savedRate) ? savedRate : "1";

    bar.querySelector("[data-audio-play]").addEventListener("click", playPause);
    bar.querySelector("[data-audio-stop]").addEventListener("click", () => stop(true));
    bar.querySelector("[data-audio-prev]").addEventListener("click", () => move(-1));
    bar.querySelector("[data-audio-next]").addEventListener("click", () => move(1));

    r.addEventListener("change", () => {
      localStorage.setItem("hcu.audio.rate", r.value);
      if (speaking) { token++; synth.cancel(); speaking=false; setTimeout(speak,60); }
    });

    bar.querySelector("[data-audio-voice]").addEventListener("change", e => {
      localStorage.setItem("hcu.audio.voice." + c.lang, e.target.value);
      if (speaking) { token++; synth.cancel(); speaking=false; setTimeout(speak,60); }
    });

    fillVoices(); update();
  }

  function ensure() {
    const c = ctx();
    if (c.mode !== "read" || !c.story) { if (activeKey) stop(false); activeKey=""; return; }

    const root = app.querySelector(".story-content"), card = app.querySelector(".reader-card");
    if (!root || !card) return;
    const key = c.story + ":" + c.lang;

    if (activeKey && activeKey !== key) stop(false);
    const existing = card.querySelector(".audio-reader");
    if (existing && activeKey === key) return;
    if (!existing && (speaking || paused)) stop(false);

    activeKey = key; blocks = collect(); index = restore(c.story,c.lang,blocks.length); statusText=""; build(root);
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued=false; ensure(); });
  };

  new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
  if (supported) synth.onvoiceschanged = fillVoices;
  addEventListener("pagehide", () => stop(false));
  addEventListener("beforeunload", () => stop(false));
  schedule();
})();