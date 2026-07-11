const CACHE = "koudoulog-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./2048.html",
  "./sudoku.html",
  "./sprint.html",
  "./manifest.json",
  "./icon-180.png",
  "./icon-512.png",
  "./icon-2048.png",
  "./icon-sudoku.png",
  "./icon-sprint.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit ||
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
    )
  );
});
