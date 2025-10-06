const CACHE_NAME = 'scheda-palestra-v2';
const urlsToCache = [
  './',
  './index.html',
  './workout-flow.html',
  './css/shared.css',
  './css/home.css',
  './css/workout-flow.css',
  './js/shared.js',
  './js/pages/home.js',
  './js/pages/workout-flow.js',
  './js/pages/nutrition.js',
  './js/pages/history.js',
  './js/data/exercises.js',
  './js/data/nutrition.js',
  './js/utils/modal.js',
  './js/utils/timers.js',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first for JS files, cache first for others
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-first strategy for JavaScript files to always get latest updates
  if (url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the new version
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first strategy for other resources (HTML, CSS, images)
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
        })
    );
  }
});
