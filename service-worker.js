self.addEventListener("install", e => {
  console.log("✅ gChat service worker installed.");
  self.skipWaiting();
});

self.addEventListener("fetch", () => {
  // For now, do nothing — just needed to register
});