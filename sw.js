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

self.addEventListener("fetch", event => {
   event.respondWith(
     caches.match(event.request).then(cachedResponse => {
         const networkFetch = fetch(event.request).then(response => {
           caches.open(cacheName).then(cache => {
               cache.put(event.request, response.clone());
           });
         });
         
         return cachedResponse || networkFetch;
     }
   )
  )
});
