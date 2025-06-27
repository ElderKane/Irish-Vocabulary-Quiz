// A name for our cache.
// IMPORTANT: A new name is required to update the PWA on user devices.
const CACHE_NAME = 'vocab-quiz-v2';

// The files we want to cache. NOTE: We only cache the main files.
// The new vocabulary.js file must be added here for offline use.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json', 
  '/vocabulary.js', // Caching the new vocabulary file
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
];

// 1. On install, cache the core app shell files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. On fetch, serve from cache first for a fast, offline-first experience
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response from cache
        if (response) {
          return response;
        }
        // Not in cache, go to the network
        return fetch(event.request);
      })
  );
});

// 3. On activate, clean up old caches to save space
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Only keep the newest cache
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
