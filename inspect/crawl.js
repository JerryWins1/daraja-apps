/* Daraja review crawler (21 Sep 2026). Runs inside a page. Presses every visible, safe button once,
   with a real click (so inline handlers resolve exactly as a thumb would), and records what happened:
   errors thrown, the page going blank, a button that did nothing visible, dialogs, navigation attempts.
   Never presses anything destructive or outward-facing. Returns a report object.

   KNOWN LIMIT, diagnosed 8 Nov 2026 — do not spend an evening on it twice. A button that
   finishes an app's first-run setup reloads the app on purpose, and that ends the crawl
   where it stands: this runs inside the page, so the report dies with the document and the
   caller gets "Execution context was destroyed" and nothing else. It is not an app fault.
   Confirmed culprits: "Save my list — however many that is" in Ahead of It and its Church
   and Nonprofit editions, and "🧒 Kid" (createProfile) in One Thing. Those four apps
   therefore return no report at all. They are not untested — driving the same clicks from
   Playwright instead of from inside the page pressed 33 to 35 buttons in each with zero
   errors. The real fix is for the CALLER to catch the navigation and resume on the reloaded
   page, keeping the report it already has; adding labels to SKIP would only play
   whack-a-mole across 48 apps. */
(async () => {
  const S = ms => new Promise(r => setTimeout(r, ms));
  const SKIP = /delete|erase|fresh|remove|reload|clear all|untick all|sign out|log out|send|text it|text the|share|print|call|reset|start over|take it again|pay|buy|get it|install|open messages|open mail|copy/i;
  const errs = []; const onErr = e => errs.push(String(e && (e.message || e.reason && e.reason.message || e.reason) || e).slice(0, 160));
  window.addEventListener('error', onErr); window.addEventListener('unhandledrejection', onErr);
  const origAlert = window.alert, origConfirm = window.confirm, origPrompt = window.prompt, origOpen = window.open;
  const dialogs = []; window.alert = m => dialogs.push('alert: ' + String(m).slice(0, 80)); window.confirm = m => { dialogs.push('confirm: ' + String(m).slice(0, 80)); return false; }; window.prompt = m => { dialogs.push('prompt: ' + String(m).slice(0, 80)); return null; };
  const navs = []; window.open = (u) => { navs.push(String(u).slice(0, 120)); return null; };
  const nameOf = el => { const t = (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40); return (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + ' “' + t + '”'); };
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < innerHeight * 4; };
  const snapshot = () => (document.body ? document.body.innerText.replace(/\s+/g, ' ').trim() : '');
  const report = { url: location.pathname, pressed: 0, findings: [], errorsAtLoad: errs.slice() };
  const seen = new Set();
  for (let round = 0; round < 4; round++) {
    const els = [...document.querySelectorAll('button, a[href], [role="button"], summary, .chip, .lcard, .app, .recipe, .cardh, input[type="checkbox"]')].filter(el => vis(el) && !el.disabled);
    let did = 0;
    for (const el of els) {
      /* els was captured before the first click of this round. A click that re-renders the
         screen leaves every later entry detached from the page — and a detached button still
         runs its inline handler, where document.getElementById(...) now returns null. That is
         not a fault a thumb can reach: it reported phantom red boxes in Business Manager,
         Serve Board, Duka, Next Step Board and Rafiki on 8 Nov 2026, and all five vanished
         once this guard was in. Skipped without consuming its key, so the next round — which
         re-queries the DOM — still presses the live copy. */
      if (!el.isConnected) { report.stale = (report.stale || 0) + 1; continue; }
      const key = nameOf(el) + '|' + Math.round(el.getBoundingClientRect().top / 40);
      if (seen.has(key)) continue; seen.add(key);
      const label = nameOf(el);
      if (SKIP.test(label)) { report.findings.push({ kind: 'skipped', el: label }); continue; }
      if (el.tagName === 'A') { const h = el.getAttribute('href') || ''; if (/^(sms:|mailto:|tel:|http)/.test(h) || el.target === '_blank') { report.findings.push({ kind: 'link', el: label, href: h.slice(0, 100) }); continue; }
        /* A RELATIVE href is still a navigation: "?dj_sandbox=1", "index.html", "../x/" all
           replace the document and end the crawl where it stands. Until 8 Nov 2026 only
           absolute and _blank links were held back, which is why Ahead of It, Ahead of It ·
           Church and Ahead of It · Nonprofit returned no report at all while pressing 35
           buttons each quite happily when links were left alone. A bare "#..." is a tab or a
           section inside the app, so that one is still pressed — that is the point of this. */
        if (h && h.charAt(0) !== '#') {
          let leaves = true;
          try { leaves = new URL(h, location.href).href.split('#')[0] !== location.href.split('#')[0]; } catch (e) {}
          if (leaves) { report.findings.push({ kind: 'link', el: label, href: h.slice(0, 100) }); continue; }
        } }
      if (!document.body) break;
      const before = snapshot(), beforeErr = errs.length, beforeDlg = dialogs.length, beforeNav = navs.length;
      try { el.scrollIntoView({ block: 'center' }); el.click(); } catch (e) { errs.push('click threw: ' + e.message); }
      await S(350); report.pressed++; did++;
      if (!document.body || document.body.innerHTML.length < 200) { report.findings.push({ kind: 'BLANK', el: label }); break; }
      const after = snapshot();
      const newErrs = errs.slice(beforeErr);
      if (newErrs.length) report.findings.push({ kind: 'ERROR', el: label, detail: newErrs.join(' | ') });
      if (dialogs.length > beforeDlg) report.findings.push({ kind: 'dialog', el: label, detail: dialogs.slice(beforeDlg).join(' | ') });
      if (navs.length > beforeNav) report.findings.push({ kind: 'opens', el: label, detail: navs.slice(beforeNav).join(' | ') });
      if (after === before && !newErrs.length && dialogs.length === beforeDlg && navs.length === beforeNav && el.tagName !== 'INPUT') report.findings.push({ kind: 'nothing-happened', el: label });
      const banner = document.getElementById('djBanner'); if (banner) { report.findings.push({ kind: 'RED-BOX', el: label, detail: banner.innerText.slice(0, 160) }); banner.remove(); }
      /* close anything modal we opened so the next press is fair */
      document.querySelectorAll('#djMoreSheet, #djLevelSheet, #nnLevelSheet, #olAsk, .sheet.on, #wcSheet.on').forEach(x => { x.classList.remove('on'); if (x.id === 'djMoreSheet' || x.id === 'djLevelSheet' || x.id === 'nnLevelSheet' || x.id === 'olAsk') x.remove(); });
    }
    if (!did) break;
  }
  window.alert = origAlert; window.confirm = origConfirm; window.prompt = origPrompt; window.open = origOpen;
  report.errors = errs; report.totalFindings = report.findings.filter(f => /ERROR|BLANK|RED-BOX/.test(f.kind)).length;
  return report;
})()
