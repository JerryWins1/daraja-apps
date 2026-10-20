// Business Manager · Kenya (v1.4 · 20 Oct 2026). Same app file as business-manager/; its own cache and scope.
// Clears only its own old caches (bizmgr-ke-…), never the US edition's (bizmgr-v…).
const CACHE='bizmgr-ke-v1';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./view.html'])).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('bizmgr-ke-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request,{ignoreSearch:true}))); });
