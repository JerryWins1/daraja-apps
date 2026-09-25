// Daraja Studio app shell — network first (22 Sep 2026).
// The old worker served the saved copy first and fetched the new one behind it, so a fix only
// showed on the SECOND open. Now the phone asks the network first and keeps a copy for offline.
const CACHE='ahead-v78';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./first-steps.html'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>null)))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('ahead-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(res=>{ if(new URL(e.request.url).origin===location.origin && res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return res; })
    .catch(()=>caches.match(e.request).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):undefined)))); });
