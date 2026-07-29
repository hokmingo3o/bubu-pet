const CACHE_NAME = 'bubu-pet-v2';
const FILES = [
  './',
  './index.html',
  './bubu.png',
  './bubu-icon.png',
  './manifest.json',
  './skin-panda.png',
  './skin-miao-boy.png',
  './skin-moutai.png',
  './skin-miao-girl.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
