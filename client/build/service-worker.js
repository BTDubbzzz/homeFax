const CACHE_NAME = "static-cache";
const FILES_TO_CACHE = [
  "/",
  "/static/css/main.18ea8b52.chunk.css",
  "/static/css/main.18ea8b52.chunk.css.map",
  "/static/js/2.998f6f6d.chunk.js",
  "/static/js/2.998f6f6d.chunk.js.LICENSE.txt",
  "/static/js/2.998f6f6d.chunk.js.map",
  "/static/js/main.af9d9644.chunk.js",
  "/static/js/main.af9d9644.chunk.js.map",
  "/static/js/runtime-main.95d54150.js",
  "/static/js/runtime-main.95d54150.js.map",
  "/asset-manifest.json",
  "/favicon.ico",
  "/index.html",
  "/logo192.png",
  "/logo512.png",
  "/manifest.json",
  "/robots.txt"
];

const urlsToCache = FILES_TO_CACHE;
const self = this;
// Install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
return cache.addAll(urlsToCache);
            })
    )
});
// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html'))
            })
    )
});
// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
)
});