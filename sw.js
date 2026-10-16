const CACHE = "zombinettes-v2";
const ASSETS = ["./", "index.html", "styles.css", "app.js", "manifest.webmanifest",
  "data/mots-1.json", "data/mots-2.json", "data/mots-3.json", "data/lecture.json", "fonts/playwrite-ca.woff2",
  "audio/instr/piano.m4a", "audio/instr/guitar.m4a", "audio/instr/violin.m4a", "audio/instr/trumpet.m4a", "audio/instr/saxophone.m4a", "audio/instr/flute.m4a",
  "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
  "img/violet.svg", "img/zombie.svg", "img/vampire.svg", "img/loup.svg", "img/licorne.svg", "img/ocean.svg", "img/chanteuse.svg", "img/sirene.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match(e.request)));
});
