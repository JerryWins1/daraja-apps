// v9 (20 Oct 2026): the Kenya edition lives in business-manager-ke/ with its own cache (bizmgr-ke-…) — leave it alone.
const CACHE='bizmgr-v11';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./view.html'])).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('bizmgr-')&&!k.startsWith('bizmgr-ke-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request,{ignoreSearch:true}))); });
