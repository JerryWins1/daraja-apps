const CACHE='familydash-v56';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('familydash-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; /* pages and the app itself skip the browser's 10-minute copy, so a new version shows on the next reload */
  const fresh = e.request.mode==='navigate' || /\/familydash\/(index\.html)?(\?|$)/.test(e.request.url);
  e.respondWith(fetch(fresh ? new Request(e.request, { cache:'no-cache' }) : e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request))); });
