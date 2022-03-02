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
    let nres_ = undefined;
    
    e.respondWith(caches.match(e.request).then((cres) => {
        const netfetch = fetch(e.request).then((nres) => {
            caches.open(cacheName).then((cache) => {
                cache.put(e.request, nres.clone());
            });
            
            nres_ = nres;
        });
        
        return cres | nres_;
    }));
});
