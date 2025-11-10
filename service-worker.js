const CACHE_NAME = 'scheda-palestra-v4'; // WEEKLY SCHEDULE VERSION
const urlsToCache = [
  './',
  './index.html',
  './pages/workout-flow.html',
  './pages/nutrition.html',
  './pages/history.html',
  './css/shared.css',
  './css/home.css',
  './css/workout-flow.css',
  './css/nutrition.css',
  './css/weekly.css', // NEW - Weekly schedule styles
  './js/shared.js',
  './js/pages/home.js',
  './js/pages/workout-flow.js',
  './js/pages/weekly-schedule.js', // NEW - Weekly schedule logic
  './js/pages/nutrition.js',
  './js/pages/history.js',
  './js/data/exercises.js',
  './js/data/nutrition.js',
  './js/utils/modal.js',
  './js/utils/timers.js',
  './js/utils/session-loader.js', // NEW - Session loader utility

  // NEW SESSION JSON FILES
  './workouts-data/lunedi_fisio_1.json',
  './workouts-data/lunedi_corda.json',
  './workouts-data/martedi_boulder_1.json',
  './workouts-data/mercoledi_off.json',
  './workouts-data/giovedi_fisio_2.json',
  './workouts-data/giovedi_boulder_2.json',
  './workouts-data/venerdi_scarico.json',
  './workouts-data/sabato_montagna.json',
  './workouts-data/domenica_variabile.json',

  // ICONS
  './assets/icons/search.svg',
  './assets/icons/clock.svg',
  './assets/icons/check.svg',
  './assets/icons/meat.svg',
  './assets/icons/fish.svg',
  './assets/icons/veggie.svg',
  './assets/icons/egg.svg',
  './assets/icons/apple.svg',
  './assets/icons/mag.svg',

  './icon-192.png',
  './icon-512.png',
  './icon.svg'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      // Cattura l'errore di fetch durante l'installazione per non far fallire il SW
      .catch(error => {
        console.error('Service Worker: Fallimento nel pre-caching di alcune risorse:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminazione vecchia cache', cacheName);
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
          })
          // Aggiunto catch per catturare eventuali errori di fetch (come i 404 rimasti)
          .catch(error => {
            console.error('Service Worker: Errore durante il fetch di:', event.request.url, error);
            // Si può aggiungere qui un fallback per le pagine non trovate, es. una pagina offline
            return caches.match('./');
          });
        })
    );
  }
});
