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
   *
   * Accessibility: each change scrolls back to the top and
   * hands keyboard/screen-reader focus to that screen's
   * heading, so nobody is left mid-page or mid-form.
   */
  function showScreen(name) {
    var target = "screen-" + name;
    for (var i = 0; i < SCREEN_IDS.length; i++) {
      var el = document.getElementById(SCREEN_IDS[i]);
      if (el) el.hidden = (SCREEN_IDS[i] !== target);
    }
    var shown = document.getElementById(target);
    if (shown) focusScreen(shown);
  }

  /* Scroll to the very top, then focus the screen's heading. */
  function focusScreen(screenEl) {
    var heading = screenEl.querySelector("h1, h2, h3");
    var target = heading || screenEl;
    if (target !== screenEl && !target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
    }
    if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
    try {
      target.focus({ preventScroll: true });
    } catch (err) {
      target.focus();   /* older browsers: no options object */
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
      renderResults();
      showScreen("results");
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
     RESULTS RENDERING
     ========================================================= */

  var lastResult = null;

  /* Escape anything that comes from the data files. */
  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bullets(items, tag) {
    var html = "<" + tag + ">";
    for (var i = 0; i < items.length; i++) html += "<li>" + esc(items[i]) + "</li>";
    return html + "</" + tag + ">";
  }

  function recipeCard(r) {
    var html = '<article class="recipe-card">';
    html += '<h4 class="recipe-name">' + esc(r.name) + "</h4>";
    html += '<p class="recipe-meta">Prep: ' + esc(r.prepTime) + "</p>";
    if (r.ingredients && r.ingredients.length) {
      html += '<p class="recipe-sub">You will need</p>' + bullets(r.ingredients, "ul");
    }
    if (r.steps && r.steps.length) {
      html += '<p class="recipe-sub">Method</p>' + bullets(r.steps, "ol");
    }
    return html + "</article>";
  }

  function block(label, inner, extraClass) {
    return '<section class="result-block' + (extraClass ? " " + extraClass : "") + '">' +
      "<h3>" + esc(label) + "</h3>" + inner + "</section>";
  }

  /* Build the whole results screen for one tier. */
  function renderTier(box, tier) {
    var app = window.DrHangover || {};
    var content = (app.TIER_CONTENT && app.TIER_CONTENT[tier]) || app.TIER_CONTENT.moderate;
    var recipes = app.RECIPES || [];

    var fulls = [];
    var quicks = [];
    for (var i = 0; i < recipes.length; i++) {
      var r = recipes[i];
      if (r.tier !== tier) continue;
      if (r.type === "full") fulls.push(r);
      else if (r.type === "quick") quicks.push(r);
    }

    var html = "";

    html += '<p class="results-headline">' + esc(content.headline) + "</p>";
    html += '<p class="results-intro">' + esc(content.intro) + "</p>";

    if (quicks.length) {
      html += block(content.quickLabel, quicks.map(recipeCard).join(""));
    }

    if (fulls.length) {
      html += block(content.fullLabel, fulls.map(recipeCard).join(""));
    }

    html += block(content.sipLabel,
      '<p class="tip-line">' + esc(content.hydrationTip) + "</p>");

    html += block(content.electrolyteLabel,
      bullets(content.electrolytes, "ul"));

    html += block(content.caffeineLabel,
      '<p class="tip-line">' + esc(content.caffeine) + "</p>");

    /* Required disclaimer */
    html += '<p class="disclaimer">Not medical advice. Dr. Hangover offers general home-remedy ideas only.</p>';

    /* Required severe-symptom warning */
    html += '<aside class="warning" role="note" aria-labelledby="warning-title">' +
      '<h3 id="warning-title">Get medical help immediately</h3>' +
      "<p>Home remedies are for rough mornings, not emergencies. Seek help straight away if there is:</p>" +
      bullets([
        "Repeated vomiting",
        "Confusion or trouble staying oriented",
        "Seizures",
        "Trouble breathing",
        "Extreme drowsiness, or being unable to wake the person up",
        "Bluish skin or lips",
        "Chest pain",
        "A very large amount of alcohol in one go"
      ], "ul") +
      "<p>When in doubt, do not wait it out \u2014 call your local emergency number.</p>" +
      "</aside>";

    box.innerHTML = html;
  }

  function renderResults() {
    var box = document.getElementById("results-content");
    if (!box) return;
    var tier = lastResult ? lastResult.tier : "moderate";
    renderTier(box, tier);
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
    /* Never restore an old scroll position: every screen
       change starts at the top of the page. */
    if (window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

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
  window.DrHangover.renderTier = renderTier;
})();
