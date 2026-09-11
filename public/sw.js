// Service Worker Invalidator & Cache Purge for Velqora
// Ensuring live web updates without stale caches

const ASSETS_TO_CACHE = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
      .then(() => {
        return self.registration.unregister();
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});
