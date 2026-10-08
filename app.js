/* =========================================================
   Dr. Hangover — app.js
   Screen switching, form handling and results rendering.
   Stage 1: structure only (no scoring, no recipes yet).
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Screen switching ---------- */

  var SCREEN_IDS = ["screen-input", "screen-loading", "screen-results"];

  /**
   * The one and only screen switcher: hide every section,
   * then show exactly the requested one. Nothing is ever
   * visible twice — not on load, not anywhere in the flow.
   */
  function showScreen(name) {
    var target = "screen-" + name;
    for (var i = 0; i < SCREEN_IDS.length; i++) {
      var el = document.getElementById(SCREEN_IDS[i]);
      if (el) el.hidden = (SCREEN_IDS[i] !== target);
    }
    var shown = document.getElementById(target);
    if (shown) {
      if (typeof shown.scrollIntoView === "function") shown.scrollIntoView({ block: "start" });
      shown.focus({ preventScroll: true });
    }
  }

  /* ---------- Loading screen ---------- */

  var LOADING_LINES = [
    "Cooking something up for you\u2026",
    "Thinking of a recipe for you\u2026",
    "Consulting the ancient hangover texts\u2026",
    "Squeezing the nimbu as we speak\u2026",
    "Waking up your liver \u2014 gently\u2026"
  ];
  var LOADING_MS = 2500;
  var loadingTimer = null;

  function startLoading() {
    var title = document.getElementById("loading-title");
    var msg = document.getElementById("loading-message");
    var line = LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)];
    if (title) title.textContent = line;
    if (msg) msg.textContent = "Hang tight, this only takes a moment.";
    showScreen("loading");
    loadingTimer = window.setTimeout(function () {
      showScreen("results");
    }, LOADING_MS);
  }

  /* ---------- Placeholder results (real content arrives in Stage 3) ---------- */

  function renderResults() {
    var box = document.getElementById("results-content");
    if (!box) return;
    box.innerHTML = '<p class="placeholder-note">Your remedies will appear here.</p>';
  }

  /* ---------- Start over ---------- */

  function startOver() {
    if (loadingTimer) { window.clearTimeout(loadingTimer); loadingTimer = null; }
    var form = document.getElementById("drink-form");
    if (form) form.reset();
    var followup = document.getElementById("mixed-followup");
    if (followup) followup.hidden = true;
    clearAllErrors();
    showScreen("input");
  }

  function clearAllErrors() {
    var errs = document.querySelectorAll(".field-error");
    for (var i = 0; i < errs.length; i++) {
      errs[i].hidden = true;
      errs[i].textContent = "";
    }
    var fields = document.querySelectorAll(".field.has-error");
    for (var j = 0; j < fields.length; j++) fields[j].classList.remove("has-error");
  }

  /* ---------- Init ---------- */

  function init() {
    var form = document.getElementById("drink-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        renderResults();   // Stage 2 adds validation + real scoring before this
        startLoading();
      });
    }

    var startBtn = document.getElementById("start-over");
    if (startBtn) startBtn.addEventListener("click", startOver);

    showScreen("input");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Exposed for later stages and for quick manual testing. */
  window.DrHangover = window.DrHangover || {};
  window.DrHangover.showScreen = showScreen;
})();
