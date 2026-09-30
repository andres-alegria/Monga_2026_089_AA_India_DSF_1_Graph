/* Reports the graphic's height to the page that embeds it, so the article's iframe fits it exactly.
   The article side is the snippet in embed-snippet.html; it listens for {type: "mongabay-embed-height"}.
   Opened on its own (not in an iframe), this does nothing. */
(function () {
  "use strict";
  if (window.parent === window) return;

  document.documentElement.classList.add("is-embedded"); // style.css trims the side padding in articles
  // ?fill=1 is the script-free WordPress shortcode: its height formula runs a little generous, so the graphic stretches
  // to fill the frame and the spare pixels go into the row spacing instead of a gap at the bottom
  if (/[?&]fill=1(&|$)/.test(location.search)) document.documentElement.classList.add("is-fill");

  var fig = document.getElementById("rc");
  var last = 0;

  function send(force) {
    var h = Math.ceil(fig.getBoundingClientRect().height);
    if (!h || (!force && h === last)) return;
    last = h;
    window.parent.postMessage({ type: "mongabay-embed-height", name: "2026_089", height: h }, "*");
  }

  if (window.ResizeObserver) new ResizeObserver(function () { send(); }).observe(fig);
  window.addEventListener("resize", function () { send(); });
  window.addEventListener("load", function () { send(true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { send(true); });

  // the article asks again once the iframe has loaded, in case the first report came too early
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "mongabay-embed-height-request") send(true);
  });
})();
