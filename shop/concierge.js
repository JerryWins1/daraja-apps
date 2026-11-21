/* ✨ The store concierge — launch idea 5, chosen by Jerry on 21 Nov 2026 (control/launch-plan.md).
   "Tell me about your week" → two or three apps that fit, each with one line of why.
   Asks Daraja's own AI through the door (control/ai.json → the Cloudflare Worker; the key never
   reaches the page). The AI only chooses from apps actually on the shelves, and any key it
   returns that is not one of them is dropped, so it can never invent an app.
   If the door cannot be reached the card says so and points at the shelves; nothing breaks.
   Words a customer reads here were written overnight and are Jerry's to change. */
(function(){
  if(typeof APPS === 'undefined' || document.getElementById('djConcierge')) return;
  var donate = (typeof PHASE !== 'undefined' && PHASE === 'donate');
  var keys = Object.keys(APPS).filter(function(k){ var a = APPS[k];
    return k !== 'home' && a.cat && a.cat !== 'off' && a.try && /^https:\/\//.test(a.try)
      && (!donate || typeof LAUNCH === 'undefined' || LAUNCH.indexOf(k) !== -1); });
  if(keys.length < 3) return;
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var card = document.createElement('div'); card.id = 'djConcierge'; card.className = 'card';
  card.style.cssText = 'border:1.5px solid var(--gold,#C9982A);border-radius:16px;padding:14px;margin:12px 0;background:var(--card,#fff)';
  card.innerHTML = '<div style="font-weight:800;font-size:17px;margin-bottom:4px">✨ Not sure where to start?</div>'
    + '<div style="font-size:14.5px;color:var(--soft,#55605B);margin-bottom:8px">Tell me a little about your week — your family, your work, your church, what slips through the cracks. Daraja’s AI will pick the apps that fit.</div>'
    + '<textarea id="djCqIn" rows="3" aria-label="Tell me about your week" placeholder="For example: I run a small plumbing business, we have three kids, and bills always sneak up on us." style="width:100%;box-sizing:border-box;font:inherit;font-size:16px;min-height:84px;padding:10px 12px;border-radius:12px;border:1.5px solid var(--line,#E2DCCF);background:var(--card,#fff);color:inherit"></textarea>'
    + '<button type="button" id="djCqGo" style="display:block;width:100%;min-height:48px;margin-top:8px;border-radius:12px;border:0;background:var(--blue,#23504F);color:#fff;font:800 16px -apple-system,system-ui,sans-serif;cursor:pointer">✨ Find my apps</button>'
    + '<div style="font-size:12.5px;color:var(--soft,#55605B);margin-top:6px">What you type goes to Daraja’s AI only to choose apps. It is not saved.</div>'
    + '<div id="djCqOut" aria-live="polite" style="margin-top:8px"></div>';
  var anchor = document.getElementById('tellme') || document.getElementById('storeTools');
  if(!anchor || !anchor.parentNode) return;
  anchor.parentNode.insertBefore(card, anchor);
  var out = card.querySelector('#djCqOut'), go = card.querySelector('#djCqGo'), inp = card.querySelector('#djCqIn');
  function list(){ return keys.map(function(k){ var a = APPS[k]; return k + ' | ' + a.name + ' | ' + (a.sub || ''); }).join('\n'); }
  function pick(text){
    var m = /\{[\s\S]*\}/.exec(text || ''); if(!m) return [];
    try{ var j = JSON.parse(m[0]); }catch(e){ return []; }
    var seen = {};
    return (j.picks || []).filter(function(p){ return p && keys.indexOf(p.key) !== -1 && !seen[p.key] && (seen[p.key] = 1); }).slice(0, 3);
  }
  function show(picks){
    if(!picks.length){ out.innerHTML = '<p style="margin:0;font-size:15px">I couldn’t match that to an app. Try a few more words — or browse the shelves below.</p>'; return; }
    out.innerHTML = picks.map(function(p){ var a = APPS[p.key];
      return '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--line,#E2DCCF)">'
        + '<span style="font-size:26px;line-height:1">' + esc(a.em || '') + '</span><div style="flex:1"><b>' + esc(a.name) + '</b>'
        + '<div style="font-size:14.5px;color:var(--soft,#55605B)">' + esc(p.why || a.sub || '') + '</div>'
        + '<a href="' + esc(a.try) + '" style="display:inline-flex;align-items:center;min-height:44px;margin-top:4px;padding:6px 14px;border-radius:12px;background:var(--blue,#23504F);color:#fff;font-weight:800;text-decoration:none">' + (donate ? 'Get it free' : 'Try it') + '</a></div></div>';
    }).join('');
  }
  async function endpoint(){
    try{ var r = await fetch('https://jerrywins1.github.io/daraja-apps/control/ai.json?h=' + Math.floor(Date.now()/36e5)); var c = await r.json(); return (c && /^https:\/\//.test(c.endpoint || '')) ? c.endpoint : ''; }catch(e){ return ''; }
  }
  go.addEventListener('click', async function(){
    var said = inp.value.trim();
    if(said.length < 8){ out.innerHTML = '<p style="margin:0;font-size:15px">Tell me a little more — a sentence or two is plenty.</p>'; inp.focus(); return; }
    go.disabled = true; go.textContent = 'Thinking…'; out.innerHTML = '';
    var prompt = 'You help someone choose apps from the Daraja store. Choose the 2 or 3 apps below that would help this person most. Use ONLY keys from the list. '
      + 'For each, write one warm, plain sentence (under 20 words) saying how it helps THEM, in their situation. Answer with JSON only: {"picks":[{"key":"...","why":"..."}]}\n\n'
      + 'The apps (key | name | what it does):\n' + list() + '\n\nWhat they said about their week:\n' + said.slice(0, 1500);
    var picks = [], ep = await endpoint();
    if(ep){
      try{
        var r = await fetch(ep, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: prompt, app: 'shop', want: 'json', code: '' }) });
        var j = await r.json();
        if(r.ok && j && j.text){ picks = pick(j.text); show(picks); }
        else throw new Error(j && j.error || ('HTTP ' + r.status));
      }catch(e){
        try{ window.djNote && window.djNote('Store concierge: ' + (e.message || 'no answer')); }catch(x){}
        out.innerHTML = '<p style="margin:0;font-size:15px">The AI couldn’t answer just now. Try again in a minute — or browse the shelves below.</p>';
      }
    }else out.innerHTML = '<p style="margin:0;font-size:15px">The AI isn’t switched on right now. Browse the shelves below.</p>';
    go.disabled = false; go.textContent = '✨ Find my apps';
  });
})();
