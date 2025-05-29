
const CACHE_NAME = 'typemaster-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/Index.tsx',
  '/src/components/MessageBubble.tsx',
  '/src/components/ChallengeMenu.tsx',
  '/src/components/BackgroundSelector.tsx',
  '/src/index.css',
  '/lovable-uploads/d5f18af1-162e-4f25-941a-060841eb8d63.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
