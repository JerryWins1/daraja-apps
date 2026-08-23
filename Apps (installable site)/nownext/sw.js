// Daraja Studio app shell cache — v9
const CACHE='nownext-v26';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./first-steps.html'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('nownext-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{ if(new URL(e.request.url).origin===location.origin){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return res; }).catch(()=>caches.match('./index.html')))); });
