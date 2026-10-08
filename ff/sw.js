// My Scores service worker — network first (so a fix shows on the first open) plus kickoff-alert notifications.
const CACHE='ff-v6';
const ASSETS=['./','./index.html'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>null)))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('ff-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(res=>{ if(new URL(e.request.url).origin===location.origin && res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return res; })
    .catch(()=>caches.match(e.request).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):undefined)))); });
// A push always ends in a visible notification (phones cancel the subscription if one doesn't show).
self.addEventListener('push',e=>{
  let d={title:'My Scores',body:'Check your lineup before kickoff.',url:'./'};
  try{ if(e.data) d=Object.assign(d,e.data.json()); }catch(_){}
  e.waitUntil(self.registration.showNotification(d.title,{body:d.body,tag:d.tag||'ff',icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    for(const c of cs){ if('focus' in c) return c.focus(); }
    return clients.openWindow(url);
  }));
});
