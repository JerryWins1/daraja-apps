/* deepcheck — how a person actually meets an app, not how a developer opens it.
   Runs inside one page; loads each app in a frame at 360×780 and, for every app:
     pass 1  a stranger: nothing saved
     pass 2  coming back: whatever pass 1 left behind, no cache-buster
   and in both looks for: the red "something went wrong" bar, a blank screen behind
   a tab, floating things sitting on each other or on the words, a version a person
   can read, and the app fighting the house layer for an id.                       */
window.deepCheck = async function(url, opts){
  opts = opts || {};
  const W = 360, H = 780;
  const f = document.createElement('iframe');
  f.style.cssText = 'width:' + W + 'px;height:' + H + 'px;border:1px solid #444;display:block';
  f.src = url + (opts.bust ? ((url.includes('?') ? '&' : '?') + 'cb=' + Date.now()) : '');
  document.body.appendChild(f);
  await new Promise(r => { f.onload = r; setTimeout(r, 12000); });
  await new Promise(r => setTimeout(r, 3500));
  const out = { url: url, pass: opts.label || '', faults: [] };
  const add = (k, d) => out.faults.push(k + (d ? ': ' + d : ''));
  try {
    const d = f.contentDocument, w = f.contentWindow;
    if (!d || !d.body) { add('NO-PAGE'); f.remove(); return out; }
    const vis = el => { const cs = w.getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2; };

    /* the red bar the house layer shows when something threw */
    if (d.getElementById('djBanner')) add('RED-BAR', (d.getElementById('djBanner').innerText || '').slice(0, 90).replace(/\n/g, ' '));

    /* a version a person can actually read, and only one of them */
    const txt = d.body.innerText || '';
    const stamps = [...new Set((txt.match(/v\s?\d+\.\d+/g) || []).map(x => x.replace(/\s/g, '')))];
    if (!stamps.length) add('NO-VERSION-SHOWN');
    else if (stamps.length > 1) add('TWO-VERSIONS', stamps.join(' and '));

    /* the house layer, and anything fighting it for a name */
    if (!d.querySelector('script[id^="dj-house-v"]')) add('NO-HOUSE-LAYER');
    ['djAsk', 'djAIBtn', 'djAa', 'djMore', 'djDock', 'djHello'].forEach(id => {
      if (d.querySelectorAll('[id="' + id + '"]').length > 1) add('ID-FIGHT', id);
    });

    /* floating things sitting on each other, or on the words */
    const fixed = [...d.querySelectorAll('body *')].filter(el => vis(el) && w.getComputedStyle(el).position === 'fixed')
      .map(el => ({ el, r: el.getBoundingClientRect() }))
      .filter(x => x.r.width > 24 && x.r.height > 24 && x.r.width < W * 0.98);
    for (let i = 0; i < fixed.length; i++) for (let j = i + 1; j < fixed.length; j++) {
      const a = fixed[i], b = fixed[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const over = !(a.r.right <= b.r.left || b.r.right <= a.r.left || a.r.bottom <= b.r.top || b.r.bottom <= a.r.top);
      if (over) {
        const nm = x => (x.el.id ? '#' + x.el.id : x.el.tagName.toLowerCase()) + ' “' + (x.el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 18) + '”';
        add('BOX-ON-BOX', nm(a) + ' over ' + nm(b));
      }
    }
    /* something floating across the top, over the app's own title */
    const h1 = d.querySelector('h1, header');
    if (h1 && vis(h1)) { const hr = h1.getBoundingClientRect();
      fixed.forEach(x => { if (x.el.id === 'djHello') return;
        if (!(x.r.right <= hr.left || hr.right <= x.r.left || x.r.bottom <= hr.top || hr.bottom <= x.r.top)) add('COVERS-TITLE', (x.el.id ? '#' + x.el.id : x.el.tagName)); }); }

    /* every tab: does the screen behind it have anything on it */
    const tabs = [...d.querySelectorAll('nav button, nav a, [role=tablist] button')].filter(vis);
    for (const b of tabs.slice(0, 8)) {
      const label = (b.getAttribute('aria-label') || b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 22);
      try { b.click(); } catch (e) { add('TAB-THREW', label); continue; }
      await new Promise(r => setTimeout(r, 500));
      const seen = [...d.querySelectorAll('main *, .wrap *, .view.on *, .pane.on *, section.on *')]
        .filter(el => { if (!vis(el)) return false; const r = el.getBoundingClientRect(); return r.top < H && r.bottom > 50; })
        .map(el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ')).join(' ').replace(/\s+/g, ' ').trim();
      if (seen.length < 20) add('BLANK-TAB', label);
      if (d.getElementById('djBanner')) { add('RED-BAR-AFTER-TAB', label); d.getElementById('djBanner').remove(); }
    }
  } catch (e) { add('CHECK-FAILED', e.message); }
  f.remove();
  return out;
};
