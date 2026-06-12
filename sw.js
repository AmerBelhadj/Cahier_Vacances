// Service Worker — Les Vacances de Maya et Aaron
// Offline robuste : cache-first + précache complet
const CACHE_NAME = 'maya-aaron-v4.0.0';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/main.css',
  './assets/js/app.js',
  './assets/js/progress.js',
  './assets/js/install.js',
  './data/content.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] install:', err))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Ignore les requêtes vers d'autres origines (ex: Google Fonts) pour ne pas casser l'offline
  const sameOrigin = new URL(e.request.url).origin === self.location.origin;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(net => {
        if (sameOrigin && net && net.status === 200) {
          const clone = net.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return net;
      }).catch(() => {
        // Hors ligne et pas en cache : pour une navigation HTML, renvoyer la page d'accueil
        const accept = e.request.headers.get('accept') || '';
        if (e.request.mode === 'navigate' || accept.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
