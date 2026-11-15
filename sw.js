const CACHE = "grillitos-v1";
const FILES = ["./", "index.html", "manifest.json", "img/icon-192.png", "img/icon-512.png",
  "img/brinquito.jpg", "img/zona-bebes.jpg", "img/piscina-pelotas.jpg", "img/toboganes.jpg",
  "img/pinatas.jpg", "img/letrero.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
// Red primero (siempre lo más nuevo), caché si no hay internet
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || e.request.url.includes("/video/")) return;
  e.respondWith(fetch(e.request).then(r => {
    const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r;
  }).catch(() => caches.match(e.request)));
});
