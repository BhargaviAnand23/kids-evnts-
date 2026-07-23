const CACHE_NAME = 'kidspire-pwa-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event - skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - claim clients and delete all old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network-First for ALL requests (CSS, JS, pages)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests from same origin
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // Bypass HMR & Webpack dev updates completely
  if (request.url.includes('/_next/webpack-hmr') || request.url.includes('/_next/static/webpack/')) {
    return;
  }

  // Network-First with Cache Fallback strategy
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // If response is valid, update the cache asynchronously
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fall back to cache only when network fails (offline)
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If page navigation request fails offline, return cached root page
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});
