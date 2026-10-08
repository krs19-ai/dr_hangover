/* =========================================================
   Dr. Hangover — app.js
   Screen switching, form handling, validation and rendering.
   Scoring lives in logic.js; recipe data lives in recipes.js.
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     VALIDATION LIMITS — tweak here (mirrors the HTML min/max)
     ========================================================= */
  var LIMITS = {
    amount: { min: 1,  max: 30,  label: "total drinks" },
    weight: { min: 30, max: 200, label: "body weight in kg" },
    hours:  { min: 0,  max: 72,  label: "hours since your last drink" }
  };

  /* Error slot + focus target for each logical field. */
  var FIELDS = [
    { key: "drink",  error: "drink-error",  focus: "drink" },
    { key: "mixed",  error: "mixed-error",  focus: "mixed-yes" },
    { key: "extra",  error: "extra-error",  focus: "extra-beer" },
    { key: "amount", error: "amount-error", focus: "amount" },
    { key: "water",  error: "water-error",  focus: "water-none" },
    { key: "weight", error: "weight-error", focus: "weight" },
    { key: "hours",  error: "hours-error",  focus: "hours" }
  ];

  /* ---------- Screen switching ---------- */

  var SCREEN_IDS = ["screen-input", "screen-loading", "screen-results"];

  /**
   * The one and only screen switcher: hide every section,
   * then show exactly the requested one. Never two at once —
   * not on load, not anywhere in the flow.
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
    if (loadingTimer) window.clearTimeout(loadingTimer);
    loadingTimer = window.setTimeout(function () {
      showScreen("results");
      renderResults();
    }, LOADING_MS);
  }

  /* =========================================================
     MIXED-DRINKS FOLLOW-UP
     ========================================================= */

  function isMixedYes() {
    var el = document.querySelector('input[name="mixed"]:checked');
    return !!el && el.value === "yes";
  }

  function extraBoxes() {
    return document.querySelectorAll('input[name="extra"]');
  }

  function checkedExtras() {
    var boxes = extraBoxes();
    var out = [];
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked && !boxes[i].disabled) out.push(boxes[i].value);
    }
    return out;
  }

  /* Keep the follow-up in sync: show only for "yes", and never
     let the same drink be picked twice. */
  function syncFollowup() {
    var wrap = document.getElementById("mixed-followup");
    if (wrap) wrap.hidden = !isMixedYes();

    var primary = document.getElementById("drink");
    var primaryValue = primary ? primary.value : "";
    var boxes = extraBoxes();
    for (var i = 0; i < boxes.length; i++) {
      var same = boxes[i].value === primaryValue && primaryValue !== "";
      boxes[i].disabled = same;
      if (same && boxes[i].checked) boxes[i].checked = false;
    }
    if (!isMixedYes()) clearError("extra");
  }

  /* =========================================================
     VALIDATION — friendly inline errors, nothing stored
     ========================================================= */

  function errorEl(key) {
    for (var i = 0; i < FIELDS.length; i++) {
      if (FIELDS[i].key === key) return document.getElementById(FIELDS[i].error);
    }
    return null;
  }

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  /* Every control that belongs to a logical field (radio groups
     and checkbox groups included), for aria-invalid marking. */
  function controlsFor(key) {
    if (key === "extra") return toArray(extraBoxes());
    if (key === "mixed") return toArray(document.querySelectorAll('input[name="mixed"]'));
    if (key === "water") return toArray(document.querySelectorAll('input[name="water"]'));
    var el = document.getElementById(key);
    return el ? [el] : [];
  }

  /* The control we should send focus to when a field is invalid. */
  function fieldEl(key) {
    if (key === "extra") {
      var boxes = extraBoxes();
      for (var i = 0; i < boxes.length; i++) if (!boxes[i].disabled) return boxes[i];
    }
    var matches = controlsFor(key);
    for (var j = 0; j < matches.length; j++) {
      if (matches[j] && !matches[j].disabled) return matches[j];
    }
    return matches[0] || null;
  }

  function markInvalid(key, invalid) {
    var controls = controlsFor(key);
    for (var i = 0; i < controls.length; i++) {
      if (controls[i] && controls[i].setAttribute) {
        controls[i].setAttribute("aria-invalid", invalid ? "true" : "false");
      }
    }
  }

  function showError(key, message) {
    var el = errorEl(key);
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
    var wrap = el ? el.closest(".field") : null;
    if (wrap) wrap.classList.add("has-error");
    markInvalid(key, true);
  }

  function clearError(key) {
    var el = errorEl(key);
    if (el) {
      el.textContent = "";
      el.hidden = true;
    }
    var wrap = el ? el.closest(".field") : null;
    if (wrap) wrap.classList.remove("has-error");
    markInvalid(key, false);
  }

  function clearAllErrors() {
    for (var i = 0; i < FIELDS.length; i++) clearError(FIELDS[i].key);
  }

  /* Which logical field does this control belong to? */
  function keyForControl(el) {
    if (!el) return null;
    if (el.name === "extra") return "extra";
    if (el.name === "mixed") return "mixed";
    if (el.name === "water") return "water";
    return el.id || null;
  }

  /* A whole number/decimal inside [min, max]? Returns a code. */
  function checkNumber(raw, limits) {
    var text = String(raw).trim();
    if (text === "") return "empty";
    var n = Number(text);
    if (!isFinite(n)) return "nan";
    if (n < 0) return "negative";
    if (n < limits.min) return "low";
    if (n > limits.max) return "high";
    return null;
  }

  function numberMessage(fieldKey, code) {
    if (fieldKey === "amount") {
      if (code === "empty")    return "Roughly how many? Pop a number in.";
      if (code === "nan")      return "Hmm, that doesn't look like a number.";
      if (code === "negative") return "No negatives \u2014 how many did you actually have?";
      if (code === "low")      return "At least 1 (even if it was \u201Cjust the one\u201D).";
      if (code === "high")     return "More than 30? Let's call it 30 and move on.";
    }
    if (fieldKey === "weight") {
      if (code === "empty")  return "Your weight helps gauge it \u2014 pop it in (nothing is stored).";
      if (code === "nan")    return "Just the number in kg, please.";
      if (code === "negative") return "Negative weight isn't a thing \u2014 try again.";
      if (code === "low")    return "Between 30 and 200 kg, please.";
      if (code === "high")   return "Between 30 and 200 kg, please.";
    }
    if (fieldKey === "hours") {
      if (code === "empty")    return "When did you stop? In hours, please.";
      if (code === "nan")      return "Just the number of hours, please.";
      if (code === "negative") return "That's in the future \u2014 hours ago, please.";
      if (code === "low")      return "Between 0 and 72 hours.";
      if (code === "high")     return "Over 3 days ago? You should be fine \u2014 enter 72.";
    }
    return "Please check this number.";
  }

  /**
   * Validate everything. Shows inline errors, returns the key of
   * the first invalid field (for focus) or null when all good.
   */
  function validateForm() {
    var firstBad = null;
    function bad(key, message) {
      showError(key, message);
      if (!firstBad) firstBad = key;
    }

    /* 1. drink */
    var drink = document.getElementById("drink").value;
    if (!drink) bad("drink", "Go on, pick a drink first.");
    else clearError("drink");

    /* 2. mixed yes/no */
    var mixedEl = document.querySelector('input[name="mixed"]:checked');
    if (!mixedEl) bad("mixed", "Did you mix? Pick yes or no.");
    else clearError("mixed");

    /* 2b. follow-up required when "yes" */
    if (mixedEl && mixedEl.value === "yes") {
      if (checkedExtras().length === 0) {
        bad("extra", "Pick at least one other drink \u2014 that's the mixing part.");
      } else {
        clearError("extra");
      }
    } else {
      clearError("extra");
    }

    /* 3. amount */
    var amountCode = checkNumber(document.getElementById("amount").value, LIMITS.amount);
    if (amountCode) bad("amount", numberMessage("amount", amountCode));
    else clearError("amount");

    /* 4. water */
    var waterEl = document.querySelector('input[name="water"]:checked');
    if (!waterEl) bad("water", "How much water? None, a little, or a good amount.");
    else clearError("water");

    /* 5. weight */
    var weightCode = checkNumber(document.getElementById("weight").value, LIMITS.weight);
    if (weightCode) bad("weight", numberMessage("weight", weightCode));
    else clearError("weight");

    /* 6. hours */
    var hoursCode = checkNumber(document.getElementById("hours").value, LIMITS.hours);
    if (hoursCode) bad("hours", numberMessage("hours", hoursCode));
    else clearError("hours");

    return firstBad;
  }

  /* ---------- Read the form into a plain object ---------- */

  function readForm() {
    var mixedEl = document.querySelector('input[name="mixed"]:checked');
    var waterEl = document.querySelector('input[name="water"]:checked');
    var drinks = [];
    var primary = document.getElementById("drink").value;
    if (primary) drinks.push(primary);

    var extras = checkedExtras();
    for (var i = 0; i < extras.length; i++) drinks.push(extras[i]);

    return {
      drinks: drinks,
      mixed: !!mixedEl && mixedEl.value === "yes",
      amount: Number(document.getElementById("amount").value),
      water: waterEl ? waterEl.value : "little",
      weight: Number(document.getElementById("weight").value),
      hours: Number(document.getElementById("hours").value)
    };
  }

  /* =========================================================
     RESULTS (real content arrives in Stage 3)
     ========================================================= */

  var lastResult = null;

  function renderResults() {
    var box = document.getElementById("results-content");
    if (!box) return;

    if (window.DrHangover && typeof window.DrHangover.renderTier === "function") {
      window.DrHangover.renderTier(box, lastResult ? lastResult.tier : "moderate");
      return;
    }
    box.innerHTML = '<p class="placeholder-note">Your remedies will appear here.</p>';
  }

  /* ---------- Start over ---------- */

  function startOver() {
    if (loadingTimer) { window.clearTimeout(loadingTimer); loadingTimer = null; }
    lastResult = null;
    var form = document.getElementById("drink-form");
    if (form) form.reset();
    syncFollowup();
    clearAllErrors();
    showScreen("input");
  }

  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    var form = document.getElementById("drink-form");
    if (!form) return;

    /* Toggle the follow-up whenever "yes"/"no"/drink changes. */
    form.addEventListener("change", function (e) {
      var key = keyForControl(e.target);
      if (key === "mixed" || key === "drink" || key === "extra") syncFollowup();
      if (key) clearError(key);
    });

    /* Clear a field's error as soon as the user retypes. */
    form.addEventListener("input", function (e) {
      var key = keyForControl(e.target);
      if (key === "mixed" || key === "drink" || key === "extra") syncFollowup();
      if (key) clearError(key);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = validateForm();
      if (firstBad) {
        showScreen("input");
        var control = fieldEl(firstBad);
        if (control && control.focus) control.focus();
        return;
      }
      var data = readForm();
      var logic = window.DrHangover && window.DrHangover.logic;
      lastResult = logic ? logic.evaluate(data) : { score: 0, tier: "moderate" };
      startLoading();
    });

    var startBtn = document.getElementById("start-over");
    if (startBtn) startBtn.addEventListener("click", startOver);

    syncFollowup();
    showScreen("input");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Public bits (also handy for quick manual testing). */
  window.DrHangover = window.DrHangover || {};
  window.DrHangover.showScreen = showScreen;
  window.DrHangover.readForm = readForm;
  window.DrHangover.validateForm = validateForm;
})();
