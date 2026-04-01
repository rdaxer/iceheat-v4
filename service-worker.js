// service-worker.js
// IceHeat v4 – Offline Cache

const CACHE_NAME = "iceheat-v4-cache-v1";
const APP_ASSETS = [
    "/",
    "/index.html",
    "/styles.css",
    "/manifest.json",

    // UI
    "/src/app.js",
    "/src/router.js",
    "/src/state.js",
    "/src/storage.js",

    "/src/ui/drivers.js",
    "/src/ui/heats.js",
    "/src/ui/results.js",
    "/src/ui/scanner.js",

    // Scan Engine
    "/src/vision/scan-engine.js",
    "/src/vision/color-detection.js",
    "/src/vision/cell-segmentation.js",
    "/src/vision/heat-reconstruction.js",
    "/src/vision/ocr.js",
];

// Install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS))
    );
});

// Activate
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            )
        )
    );
});

// Fetch
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(resp =>
            resp ||
            fetch(event.request).catch(() =>
                caches.match("/index.html")
            )
        )
    );
});