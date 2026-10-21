/* 學測數學題庫練習 — 離線快取 Service Worker
   首次開啟後把頁面本體、KaTeX、圖示與全部圖卡快取下來，之後離線也能完整做題。 */
var CACHE = "qbank-pwa-gh-v2";
var BASE = self.location.href.replace(/[^/]*$/, "");
function U(p) { return new URL(p, BASE).href; }

var DOC_URL = U("index.html");
var PRECACHE = [
  DOC_URL,
  U("assets/manifest.webmanifest"),
  U("assets/icon-192.png"),
  U("assets/icon-512.png"),
  U("assets/icon-maskable-512.png"),
  U("assets/icon-apple-180.png"),
  U("assets/katex/katex.min.css"),
  U("assets/katex/katex.min.js"),
  U("assets/katex/fonts/KaTeX_AMS-Regular.woff"),
  U("assets/katex/fonts/KaTeX_AMS-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Caligraphic-Bold.woff"),
  U("assets/katex/fonts/KaTeX_Caligraphic-Bold.woff2"),
  U("assets/katex/fonts/KaTeX_Caligraphic-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Caligraphic-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Fraktur-Bold.woff"),
  U("assets/katex/fonts/KaTeX_Fraktur-Bold.woff2"),
  U("assets/katex/fonts/KaTeX_Fraktur-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Fraktur-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Main-Bold.woff"),
  U("assets/katex/fonts/KaTeX_Main-Bold.woff2"),
  U("assets/katex/fonts/KaTeX_Main-BoldItalic.woff"),
  U("assets/katex/fonts/KaTeX_Main-BoldItalic.woff2"),
  U("assets/katex/fonts/KaTeX_Main-Italic.woff"),
  U("assets/katex/fonts/KaTeX_Main-Italic.woff2"),
  U("assets/katex/fonts/KaTeX_Main-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Main-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Math-BoldItalic.woff"),
  U("assets/katex/fonts/KaTeX_Math-BoldItalic.woff2"),
  U("assets/katex/fonts/KaTeX_Math-Italic.woff"),
  U("assets/katex/fonts/KaTeX_Math-Italic.woff2"),
  U("assets/katex/fonts/KaTeX_SansSerif-Bold.woff"),
  U("assets/katex/fonts/KaTeX_SansSerif-Bold.woff2"),
  U("assets/katex/fonts/KaTeX_SansSerif-Italic.woff"),
  U("assets/katex/fonts/KaTeX_SansSerif-Italic.woff2"),
  U("assets/katex/fonts/KaTeX_SansSerif-Regular.woff"),
  U("assets/katex/fonts/KaTeX_SansSerif-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Script-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Script-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Size1-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Size1-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Size2-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Size2-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Size3-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Size3-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Size4-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Size4-Regular.woff2"),
  U("assets/katex/fonts/KaTeX_Typewriter-Regular.woff"),
  U("assets/katex/fonts/KaTeX_Typewriter-Regular.woff2"),
  U("assets/fig/u10a_10_q.webp"),
  U("assets/fig/u10a_10_s.webp"),
  U("assets/fig/u10a_1_q.webp"),
  U("assets/fig/u10a_1_s.webp"),
  U("assets/fig/u10a_2_q.webp"),
  U("assets/fig/u10a_2_s.webp"),
  U("assets/fig/u10a_4_q.webp"),
  U("assets/fig/u10a_4_s.webp"),
  U("assets/fig/u10a_5_q.webp"),
  U("assets/fig/u10a_5_s.webp"),
  U("assets/fig/u10a_6_q.webp"),
  U("assets/fig/u10a_6_s.webp"),
  U("assets/fig/u10a_8_q.webp"),
  U("assets/fig/u10a_8_s.webp"),
  U("assets/fig/u10a_9_q.webp"),
  U("assets/fig/u10a_9_s.webp"),
  U("assets/fig/u10b_10_q.webp"),
  U("assets/fig/u10b_10_s.webp"),
  U("assets/fig/u10b_11_q.webp"),
  U("assets/fig/u10b_11_s.webp"),
  U("assets/fig/u10b_12_q.webp"),
  U("assets/fig/u10b_12_s.webp"),
  U("assets/fig/u10b_14_q.webp"),
  U("assets/fig/u10b_14_s.webp"),
  U("assets/fig/u10b_17_q.webp"),
  U("assets/fig/u10b_17_s.webp"),
  U("assets/fig/u10b_1_q.webp"),
  U("assets/fig/u10b_1_s.webp"),
  U("assets/fig/u10b_5_q.webp"),
  U("assets/fig/u10b_5_s.webp"),
  U("assets/fig/u10b_7_q.webp"),
  U("assets/fig/u10b_7_s.webp"),
  U("assets/fig/u10b_8_q.webp"),
  U("assets/fig/u10b_8_s.webp"),
  U("assets/fig/u10b_9_q.webp"),
  U("assets/fig/u10b_9_s.webp"),
  U("assets/fig/u11b_10_q.webp"),
  U("assets/fig/u11b_10_s.webp"),
  U("assets/fig/u11b_11_q.webp"),
  U("assets/fig/u11b_11_s.webp"),
  U("assets/fig/u11b_13_q.webp"),
  U("assets/fig/u11b_13_s.webp"),
  U("assets/fig/u11b_1_q.webp"),
  U("assets/fig/u11b_1_s.webp"),
  U("assets/fig/u11b_2_q.webp"),
  U("assets/fig/u11b_2_s.webp"),
  U("assets/fig/u11b_4_q.webp"),
  U("assets/fig/u11b_4_s.webp"),
  U("assets/fig/u11b_5_q.webp"),
  U("assets/fig/u11b_5_s.webp"),
  U("assets/fig/u11b_6_q.webp"),
  U("assets/fig/u11b_6_s.webp"),
  U("assets/fig/u11b_7_q.webp"),
  U("assets/fig/u11b_7_s.webp"),
  U("assets/fig/u11b_8_q.webp"),
  U("assets/fig/u11b_8_s.webp"),
  U("assets/fig/u11b_9_q.webp"),
  U("assets/fig/u11b_9_s.webp"),
  U("assets/fig/u12a_2_q.webp"),
  U("assets/fig/u12a_2_s.webp"),
  U("assets/fig/u12b_1_q.webp"),
  U("assets/fig/u12b_1_s.webp"),
  U("assets/fig/u12b_2_q.webp"),
  U("assets/fig/u12b_2_s.webp"),
  U("assets/fig/u12b_3_q.webp"),
  U("assets/fig/u12b_3_s.webp"),
  U("assets/fig/u12b_4_q.webp"),
  U("assets/fig/u12b_4_s.webp"),
  U("assets/fig/u12b_5_q.webp"),
  U("assets/fig/u12b_5_s.webp"),
  U("assets/fig/u13a_5_q.webp"),
  U("assets/fig/u13a_5_s.webp"),
  U("assets/fig/u14a_14_q.webp"),
  U("assets/fig/u14a_14_s.webp"),
  U("assets/fig/u14a_15_q.webp"),
  U("assets/fig/u14a_15_s.webp"),
  U("assets/fig/u14a_1_q.webp"),
  U("assets/fig/u14a_1_s.webp"),
  U("assets/fig/u14a_2_q.webp"),
  U("assets/fig/u14a_2_s.webp"),
  U("assets/fig/u14a_5_q.webp"),
  U("assets/fig/u14a_5_s.webp"),
  U("assets/fig/u14b_2_q.webp"),
  U("assets/fig/u14b_2_s.webp"),
  U("assets/fig/u14b_3_q.webp"),
  U("assets/fig/u14b_3_s.webp"),
  U("assets/fig/u14b_5_q.webp"),
  U("assets/fig/u14b_5_s.webp"),
  U("assets/fig/u14b_6_q.webp"),
  U("assets/fig/u14b_6_s.webp"),
  U("assets/fig/u14b_7_q.webp"),
  U("assets/fig/u14b_7_s.webp"),
  U("assets/fig/u2a_11_q.webp"),
  U("assets/fig/u2a_11_s.webp"),
  U("assets/fig/u2a_12_q.webp"),
  U("assets/fig/u2a_12_s.webp"),
  U("assets/fig/u2a_13_q.webp"),
  U("assets/fig/u2a_13_s.webp"),
  U("assets/fig/u2a_14_q.webp"),
  U("assets/fig/u2a_14_s.webp"),
  U("assets/fig/u2a_15_q.webp"),
  U("assets/fig/u2a_15_s.webp"),
  U("assets/fig/u2a_9_q.webp"),
  U("assets/fig/u2a_9_s.webp"),
  U("assets/fig/u2b_3_q.webp"),
  U("assets/fig/u2b_3_s.webp"),
  U("assets/fig/u2b_5_q.webp"),
  U("assets/fig/u2b_5_s.webp"),
  U("assets/fig/u2b_6_q.webp"),
  U("assets/fig/u2b_6_s.webp"),
  U("assets/fig/u2b_8_q.webp"),
  U("assets/fig/u2b_8_s.webp"),
  U("assets/fig/u2b_9_q.webp"),
  U("assets/fig/u2b_9_s.webp"),
  U("assets/fig/u3a_14_q.webp"),
  U("assets/fig/u3a_14_s.webp"),
  U("assets/fig/u3b_12_q.webp"),
  U("assets/fig/u3b_12_s.webp"),
  U("assets/fig/u3b_14_q.webp"),
  U("assets/fig/u3b_14_s.webp"),
  U("assets/fig/u3b_7_q.webp"),
  U("assets/fig/u3b_7_s.webp"),
  U("assets/fig/u4b_4_q.webp"),
  U("assets/fig/u4b_4_s.webp"),
  U("assets/fig/u6a_1_q.webp"),
  U("assets/fig/u6a_1_s.webp"),
  U("assets/fig/u6a_2_q.webp"),
  U("assets/fig/u6a_2_s.webp"),
  U("assets/fig/u6a_4_q.webp"),
  U("assets/fig/u6a_4_s.webp"),
  U("assets/fig/u7a_10_q.webp"),
  U("assets/fig/u7a_10_s.webp"),
  U("assets/fig/u7a_12_q.webp"),
  U("assets/fig/u7a_12_s.webp"),
  U("assets/fig/u7a_13_q.webp"),
  U("assets/fig/u7a_13_s.webp"),
  U("assets/fig/u7a_1_q.webp"),
  U("assets/fig/u7a_1_s.webp"),
  U("assets/fig/u7a_2_q.webp"),
  U("assets/fig/u7a_2_s.webp"),
  U("assets/fig/u7a_3_q.webp"),
  U("assets/fig/u7a_3_s.webp"),
  U("assets/fig/u7a_4_q.webp"),
  U("assets/fig/u7a_4_s.webp"),
  U("assets/fig/u7a_5_q.webp"),
  U("assets/fig/u7a_5_s.webp"),
  U("assets/fig/u7a_6_q.webp"),
  U("assets/fig/u7a_6_s.webp"),
  U("assets/fig/u7a_7_q.webp"),
  U("assets/fig/u7a_7_s.webp"),
  U("assets/fig/u7a_8_q.webp"),
  U("assets/fig/u7a_8_s.webp"),
  U("assets/fig/u7a_9_q.webp"),
  U("assets/fig/u7a_9_s.webp"),
  U("assets/fig/u7b_3_q.webp"),
  U("assets/fig/u7b_3_s.webp"),
  U("assets/fig/u7b_4_q.webp"),
  U("assets/fig/u7b_4_s.webp"),
  U("assets/fig/u7b_5_q.webp"),
  U("assets/fig/u7b_5_s.webp"),
  U("assets/fig/u8a_1_q.webp"),
  U("assets/fig/u8a_1_s.webp"),
  U("assets/fig/u8a_2_q.webp"),
  U("assets/fig/u8a_2_s.webp"),
  U("assets/fig/u8a_4_q.webp"),
  U("assets/fig/u8a_4_s.webp"),
  U("assets/fig/u8a_5_q.webp"),
  U("assets/fig/u8a_5_s.webp"),
  U("assets/fig/u8a_8_q.webp"),
  U("assets/fig/u8a_8_s.webp"),
  U("assets/fig/u8a_9_q.webp"),
  U("assets/fig/u8a_9_s.webp"),
  U("assets/fig/u8b_1_q.webp"),
  U("assets/fig/u8b_1_s.webp"),
  U("assets/fig/u8b_2_q.webp"),
  U("assets/fig/u8b_2_s.webp"),
  U("assets/fig/u8b_3_q.webp"),
  U("assets/fig/u8b_3_s.webp"),
  U("assets/fig/u8b_4_q.webp"),
  U("assets/fig/u8b_4_s.webp"),
  U("assets/fig/u8b_5_q.webp"),
  U("assets/fig/u8b_5_s.webp"),
  U("assets/fig/u8b_6_q.webp"),
  U("assets/fig/u8b_6_s.webp"),
  U("assets/fig/u8b_7_q.webp"),
  U("assets/fig/u8b_7_s.webp"),
  U("assets/fig/u9b_3_q.webp"),
  U("assets/fig/u9b_3_s.webp")
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(PRECACHE.map(function (u) {
        return cache.add(u).catch(function () { /* 單一檔案失敗不影響其他快取 */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 外部資源（如字體 CDN）走一般網路

  if (req.mode === "navigate") {
    // 頁面：網路優先（拿到最新版），離線時用快取的頁面本體
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(DOC_URL, copy); });
        return res;
      }).catch(function () {
        return caches.match(DOC_URL, { ignoreSearch: true });
      })
    );
    return;
  }

  // 站內靜態資源：快取優先、背景更新（stale-while-revalidate）
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      var network = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || network;
    })
  );
});
