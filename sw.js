const CACHE_NAME = 'bubu-pet-v3';
const FILES = [
  './',
  './index.html',
  './bubu.png',
  './bubu-icon.png',
  './manifest.json',
  './skin-panda.png',
  './skin-miao-boy.png',
  './skin-turban.png',
  './skin-moutai.png',
  './skin-miao-girl.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
