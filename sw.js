const CACHE_NAME = 'my-cache-v3';
const urlsToCache = [
  '/qr-code-component-main/',
  '/qr-code-component-main/index.html',
  '/qr-code-component-main/images/favicon-32x32.png',
  '/qr-code-component-main/images/image-qr-code.png',
  // Include other assets here
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) => {
          return fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Request failed for ${url}, status: ${response.status}`
                );
              }
              return cache.put(url, response);
            })
            .catch((error) => {
              console.error(error);
            });
        })
      );
    })
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete outdated caches
            return cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
