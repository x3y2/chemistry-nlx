const cacheName = "assets";
const assets = [
    "./index.html",
    "./index.js",
    "./index.css",
    "./manifest.json",
    "./icon.png"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", (e) => {
   e.respondWith(
     caches.match(e.request).then((cachedResponse) => {
         const netFetch = fetch(e.request).then((netResponse) => {
           caches.open(cacheName).then((cache) => {
               cache.put(e.request, netResponse.clone());
           });
         });
         
         return cachedResponse || netFetch;
     }
   )
  )
});
