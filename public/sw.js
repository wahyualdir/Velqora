// Service Worker for Velqora PWA — Cache Hardening v4
const CACHE_NAME = "velqora-cache-v4";
const OFFLINE_URL = "/dashboard";

// Safe, non-sensitive static assets only
const ASSETS_TO_CACHE = [
  "/",
  "/dashboard",
  "/manifest.json",
  "/logo.svg",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
];

// Install Event: Cache essential shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("PWA: Failed to cache some static assets during install", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Invalidate and purge old caches (v1, v2, etc.)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Message Event: Handle client-triggered immediate activation (SKIP_WAITING)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch Event (Safe network-first with static cache fallback)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Ignore non-GET requests, non-http, or chrome extensions
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  // 2. CRITICAL SECURITY: NEVER cache Supabase, AI, or dynamic API endpoints
  if (
    url.hostname.includes("supabase.co") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/rest/") ||
    event.request.headers.get("x-action") ||
    event.request.headers.get("next-action")
  ) {
    return;
  }

  // 3. Handle HTML document navigation requests (Network-First)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL) || caches.match("/");
      })
    );
    return;
  }

  // 4. For static public assets (_next/static, images, fonts): Stale-While-Revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.match(/\.(svg|png|jpg|jpeg|webp|woff2|woff|css|js)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
