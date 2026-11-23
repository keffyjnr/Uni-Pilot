const CACHE_NAME = "uni-pilot-shell-v1";
const SHELL = ["/Uni-Pilot/", "/Uni-Pilot/index.html", "/Uni-Pilot/style.css", "/Uni-Pilot/site-navigation.css", "/Uni-Pilot/site-navigation.js", "/Uni-Pilot/manifest.webmanifest", "/Uni-Pilot/images/uni-pilot-app-icon.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok && request.mode === "navigate") {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || caches.match("/Uni-Pilot/index.html"))));
});