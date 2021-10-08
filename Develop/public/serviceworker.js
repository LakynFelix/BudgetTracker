const APP_PREFIX = "budgetTracker-";
const VERSION = "Version_01";

const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "./index.html",
  "/manifest.json",
  "/js/index.js",
  "/js/idb.js",
  "./public/css/style.css",
  "/assets/images/icons/icon-72x72.png",
  "/assets/images/icons/icon-96x96.png",
  "/assets/images/icons/icon-128x128.png",
  "/assets/images/icons/icon-144x144.png",
  "/assets/images/icons/icon-152x152.png",
  "/assets/images/icons/icon-192x192.png",
  "/assets/images/icons/icon-384x384.png",
  "/assets/images/icons/icon-512x512.png",
  "./assets/css/bootstrap.css",
];

self.addEventListener("Install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Your Files have been cached");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("Activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (e) {
  console.log(e.response.url);
  e.respondWith(
    caches.match(e.response).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(e.request);
      }
    })
  );
});
