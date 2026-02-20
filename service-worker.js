const CACHE_NAME = 'banking-pwa-v3';

// Get the base path dynamically
const getBasePath = () => {
  return self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);
};

const urlsToCache = [
  'index_simple.html',
  'sbi/sbi_login_simplified.html',
  'sbi/sbi_pension_check.html',
  'icici/icici_login.html',
  'icici/icici_account.html',
  'icici/icici_statement.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Install service worker and cache ALL files immediately
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Opened cache, attempting to cache pages...');
        // Try to cache each URL individually and log results
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url)
            .then(() => {
              console.log('[ServiceWorker] Cached:', url);
              return true;
            })
            .catch(err => {
              console.error('[ServiceWorker] Failed to cache:', url, err);
              return false;
            });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('[ServiceWorker] All cache attempts complete');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[ServiceWorker] Cache failed:', err);
      })
  );
});

// Activate immediately
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Cache first, with network fallback and background update
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Only handle requests from our domain
  if (url.origin !== self.location.origin) {
    return;
  }
  
  console.log('[ServiceWorker] Fetching:', url.pathname);
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[ServiceWorker] Serving from cache:', url.pathname);
          
          // Update cache in background
          fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse);
                console.log('[ServiceWorker] Updated cache:', url.pathname);
              });
            }
          }).catch(err => {
            console.log('[ServiceWorker] Background update failed (offline?):', url.pathname);
          });
          
          return cachedResponse;
        }
        
        // Not in cache, try network
        console.log('[ServiceWorker] Not in cache, fetching from network:', url.pathname);
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
              console.log('[ServiceWorker] Cached new response:', url.pathname);
            });
          }
          return response;
        });
      })
      .catch(err => {
        console.error('[ServiceWorker] Fetch failed:', url.pathname, err);
        return new Response('Offline - Page not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});
