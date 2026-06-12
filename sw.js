// Service Worker — Les Vacances de Maya et Aaron (Phase 1)
const CACHE_NAME = 'maya-aaron-v2.1.0';
const URLS_TO_CACHE = [
  './index.html', './manifest.json',
  './assets/css/main.css', './assets/js/app.js', './assets/js/progress.js',
  './data/content.json', './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE)).then(() => self.skipWaiting()).catch(err => console.error('[SW]', err)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(net => {
        if (net && net.status === 200) {
          const clone = net.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return net;
      }).catch(() => {
        if (e.request.headers.get('accept') && e.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
