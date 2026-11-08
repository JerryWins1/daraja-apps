// Ahead of It · Nonprofit has moved to ../ahead-of-it/ (8 Nov 2026).
// This worker only exists to let go: it drops the old cached shell and unregisters
// itself, so a phone that still has the old app installed stops serving it.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => { e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))))
    .then(() => self.registration.unregister())
    .then(() => self.clients.matchAll({ type: 'window' }))
    .then(cs => cs.forEach(c => c.navigate(c.url)))
); });
self.addEventListener('fetch', e => {});
