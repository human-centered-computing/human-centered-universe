(() => {
  const RTL = new Set(["ar", "fa", "he", "ur"]);
  function syncDirection() {
    const lang = (document.documentElement.lang || "en").toLowerCase();
    const primary = lang.split("-")[0];
    document.documentElement.dir = RTL.has(primary) ? "rtl" : "ltr";
  }
  new MutationObserver(syncDirection).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
  syncDirection();
})();
