const CACHE='pitwall-v1';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./engine.js','./seed.js','./manifest.webmanifest'])).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('pitwall-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return; // F1 data and the mailbox always go to the network
  e.respondWith(fetch(e.request).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return res; }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
