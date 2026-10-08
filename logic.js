/* =========================================================
   Dr. Hangover — logic.js
   Rule-based scoring and tier selection. No DOM code here,
   so this file is safe to tweak on its own.

   HOW THE SCORE IS BUILT (in order):
     1. AVERAGE strength of every drink you picked
        (the first one plus anything from the mixed-drinks
        follow-up) gives the "strength per serving".
     2. x TOTAL amount you had.
     3. x body-weight adjustment (lighter -> higher score).
     4. x time factor (the longer ago you stopped, the lower).
     5. x water factor (little/no water pushes it up).
     6. x mixed penalty if you mixed drinks.

   The score is NEVER shown to the user. It is only mapped
   to a tier: "light", "moderate" or "heavy".
   ========================================================= */

(function (root) {
  "use strict";

  /* =========================================================
     TUNING CONSTANTS — all knobs live here, nowhere else.
     ========================================================= */

  /* 1. Rough strength of one serving, relative units.
        Beer is the baseline at 1.0; spirits are roughly double. */
  var DRINK_STRENGTH = {
    beer:   1.0,
    wine:   1.3,
    whisky: 2.0,
    rum:    1.9,
    vodka:  2.0,
    other:  1.5   // default for anything unlisted
  };

  /* 2. Multiplier applied when the user says they mixed drinks.
        "Slightly" is the brief: 1.15 = +15%. */
  var MIXED_PENALTY = 1.15;

  /* 3. Reference body weight in kg. A 70kg person scores 1.0x;
        a 50kg person scores 70/50 = 1.4x, a 95kg person 0.74x. */
  var WEIGHT_REF_KG = 70;

  /* 4. Score drops by this fraction for every hour since the
        last drink (0.06 = 6% per hour). */
  var HOURS_DECAY_PER_HOUR = 0.06;

  /* 5. Never let time alone drop the score below this fraction,
        so a heavy night still counts the next morning. */
  var MIN_TIME_FACTOR = 0.40;

  /* 6. Water multiplier: none = +15%, a little = +5%, good = -10%. */
  var WATER_FACTOR = {
    none:   1.15,
    little: 1.05,
    good:   0.90
  };

  /* 7. Tier thresholds (inclusive upper bounds of each tier).
        score <= LIGHT_MAX      -> "light"
        score <= MODERATE_MAX   -> "moderate"
        score >  MODERATE_MAX   -> "heavy"  */
  var LIGHT_MAX    = 5;
  var MODERATE_MAX = 12;

  /* =========================================================
     SCORING
     ========================================================= */

  /* Strength of a single drink key, falling back to DEFAULT. */
  function strengthOf(drinkKey) {
    if (Object.prototype.hasOwnProperty.call(DRINK_STRENGTH, drinkKey)) {
      return DRINK_STRENGTH[drinkKey];
    }
    return DRINK_STRENGTH.other;
  }

  /* Average strength across all selected drinks. */
  function averageStrength(drinks) {
    var list = (drinks && drinks.length) ? drinks : ["other"];
    var total = 0;
    for (var i = 0; i < list.length; i++) total += strengthOf(list[i]);
    return total / list.length;
  }

  /**
   * Score an input object.
   * @param {Object} input
   *   drinks[]  selected drink keys (first + mixed extras)
   *   amount    total pegs/glasses/pints
   *   mixed     boolean
   *   water     "none" | "little" | "good"
   *   weight    kg
   *   hours     hours since the last drink
   * @returns {number} internal score, rounded to 2 decimals
   */
  function calculateScore(input) {
    input = input || {};

    var drinks  = (input.drinks && input.drinks.length) ? input.drinks : ["other"];
    var amount  = isFinite(input.amount) ? Number(input.amount) : 0;
    var weight  = (isFinite(input.weight) && Number(input.weight) > 0) ? Number(input.weight) : WEIGHT_REF_KG;
    var hours   = isFinite(input.hours) ? Number(input.hours) : 0;
    var water   = Object.prototype.hasOwnProperty.call(WATER_FACTOR, input.water) ? input.water : "little";

    /* 1 + 2 — average strength of everything you drank, times the total */
    var score = averageStrength(drinks) * amount;

    /* 3 — body weight */
    score = score * (WEIGHT_REF_KG / weight);

    /* 4 — time passed, floored so old drinks still register */
    var timeFactor = 1 - (hours * HOURS_DECAY_PER_HOUR);
    if (timeFactor < MIN_TIME_FACTOR) timeFactor = MIN_TIME_FACTOR;
    score = score * timeFactor;

    /* 5 — water alongside it */
    score = score * WATER_FACTOR[water];

    /* 6 — mixing penalty, on top of everything else */
    if (input.mixed) score = score * MIXED_PENALTY;

    return Math.round(score * 100) / 100;
  }

  /* Map a score to a tier. */
  function selectTier(score) {
    if (score <= LIGHT_MAX) return "light";
    if (score <= MODERATE_MAX) return "moderate";
    return "heavy";
  }

  /* Convenience: score + tier in one call. */
  function evaluate(input) {
    var score = calculateScore(input);
    return { score: score, tier: selectTier(score) };
  }

  /* =========================================================
     EXPORT — plain script tag, no modules.
     ========================================================= */
  root.DrHangover = root.DrHangover || {};
  root.DrHangover.logic = {
    DRINK_STRENGTH: DRINK_STRENGTH,
    MIXED_PENALTY: MIXED_PENALTY,
    WEIGHT_REF_KG: WEIGHT_REF_KG,
    HOURS_DECAY_PER_HOUR: HOURS_DECAY_PER_HOUR,
    MIN_TIME_FACTOR: MIN_TIME_FACTOR,
    WATER_FACTOR: WATER_FACTOR,
    LIGHT_MAX: LIGHT_MAX,
    MODERATE_MAX: MODERATE_MAX,
    averageStrength: averageStrength,
    calculateScore: calculateScore,
    selectTier: selectTier,
    evaluate: evaluate
  };
})(typeof window !== "undefined" ? window : this);
