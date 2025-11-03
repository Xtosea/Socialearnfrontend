// src/components/ads/MonetagRegister.js
export default function registerMonetagServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/monetag-sw.js")
        .then(function (registration) {
          console.log("✅ Monetag Service Worker registered with scope:", registration.scope);
        })
        .catch(function (error) {
          console.error("❌ Monetag Service Worker registration failed:", error);
        });
    });
  }
}