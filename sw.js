// Daraja Studio — root cleanup worker.
//
// What was here before tried to cache ./manifest.webmanifest, ./icon-192.png,
// ./icon-512.png and ./first-steps.html. None of those exist at the root, and
// caches.addAll() rejects if a single request fails — so this worker had never
// installed successfully. It was leftover plumbing from when a copy of the task
// app sat at the root; that page is now a front door.
//
// This worker only steps aside. It deliberately does NOT clear caches: its scope
// is /daraja-apps/, which contains every app, and Cache Storage is shared across
// the whole site — so deleting by name here would empty every other app's cache
// as well, and none of those caches belong to this page.
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    windows.forEach(c => c.navigate(c.url));
  })());
});
