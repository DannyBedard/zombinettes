const CACHE = "zombinettes-v29", MEDIA = "zombinettes-audio";
const ASSETS = ["./", "index.html", "styles.css", "app.js", "manifest.webmanifest",
  "data/mots-1.json", "data/mots-2.json", "data/mots-3.json", "data/lecture.json", "data/sons.json", "data/syllabes.json", "data/phrases-desordre.json", "fonts/playwrite-ca.woff2",
  "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
  "img/violet.svg", "img/zombie.svg", "img/vampire.svg", "img/loup.svg", "img/licorne.svg", "img/ocean.svg", "img/chanteuse.svg", "img/sirene.svg",
  "img/music/ronde.svg", "img/music/blanche.svg", "img/music/noire.svg", "img/music/croches.svg", "img/music/cle-sol.svg", "img/music/cle-fa.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== MEDIA).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (/\/audio\/.+\.(mp3|m4a)$/.test(url.pathname)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(MEDIA).then(c => c.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request)));
});
