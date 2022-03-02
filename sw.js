const cacheName = "assets";
const assets = [
    "./index.html",
    "./index.js",
    "./index.css",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(caches.match(e.request).then((r) => {
        return r;
    }));
});
