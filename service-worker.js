var cacheName = 'CodigoAcessivel-v0.1';
var filesToCache = [
    './',
    './index.html',
    './executar.html',
    './pwa/manifest.json',
    './script.js',
    './erro.js',
    './bootstrap/bootstrap-icons.css',
    './bootstrap/bootstrap-icons.woff2',
    './bootstrap/bootstrap.bundle.min.js',
    './bootstrap/bootstrap.min.css',
    './arquivos/sequenciadorMusical.js'
];
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});