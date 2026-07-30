const CACHE_NAME = 'bubu-pet-v4';
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

// 音频文件单独缓存（体积大，安装时单独处理避免阻塞）
const AUDIO_FILES = [
  './yuehan-lannong.mp3',
  './yike-pingguo.mp3',
  './ruyan-song.mp3',
  './cangjie-song.mp3',
  './haohao-song.mp3',
  './chunzhen-song.mp3',
  './tianshi-song.mp3'
];

self.addEventListener('install', e => {
  // 先缓存核心文件，音频文件后台逐步缓存
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES).then(() => {
        // 音频文件逐个缓存，不阻塞安装
        AUDIO_FILES.forEach(url => {
          cache.add(url).catch(() => {}); // 部分失败不影响
        });
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  const isAudio = AUDIO_FILES.some(a => url.endsWith(a.replace('./', '')));

  if (isAudio) {
    // 音频文件：缓存优先，避免每次都从网络下载造成卡顿
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
          return response;
        });
      })
    );
  } else {
    // 其他文件：网络优先，保证获取最新版本
    e.respondWith(
      fetch(e.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
        return response;
      }).catch(() => caches.match(e.request))
    );
  }
});
