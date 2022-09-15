// Lets set up some constants for the worker
var GHPATH = "/GithubPagePWA";
var APP_PREFIX = "ghppwa_";
var VERSION = "version_001";
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/css/styles.css`,
  `${GHPATH}/img/icon.png`,
  `${GHPATH}/js/app.js`,
];

// Keep the cache version specific
var CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener("fetch", function (e) {
  console.log("Fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // if we have a catch for the requested cache return it
        return request;
      } else {
        // otherwise fetch it
        return fetch(e.request);
      }
    })
  );
});

// On install of the service worker
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Installing cache : " + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

// On activation of the service worker, happens after installation
// it cleans up resources from previous versions of the service worker
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheWhitelist.indexOf(key) === -1) {
            console.log("Deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
