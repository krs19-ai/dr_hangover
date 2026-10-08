/* =========================================================
   Dr. Hangover — recipes.js
   ALL content data lives here: recipes, quick options,
   hydration tips, electrolyte ideas and caffeine guidance.

   To add a recipe later, just push another object into
   RECIPES — logic.js and app.js never need to change.

   Recipe shape:
     {
       name: "Classic Nimbu Paani",
       tier: "light" | "moderate" | "heavy",
       type: "full" | "quick",
       prepTime: "5 min",
       ingredients: ["...", "..."],
       steps: ["...", "..."]
     }

   Tier copy lives in TIER_CONTENT, one block per tier.
   Nothing is shared between tiers — every tier has its own
   headline, tips, electrolytes and caffeine line.
   ========================================================= */

(function (root) {
  "use strict";

  /* =========================================================
     RECIPES — 2 full remedies per tier + quick options
     ========================================================= */
  var RECIPES = [

    /* ----------------------------------------------------
       LIGHT TIER — nimbu paani-style drinks
       ---------------------------------------------------- */

    {
      name: "Classic Nimbu Paani",
      tier: "light",
      type: "full",
      prepTime: "5 min",
      ingredients: [
        "1 lemon",
        "1 glass (250 ml) cold water",
        "1 tsp sugar or honey",
        "1 pinch black salt",
        "1 pinch roasted cumin powder (optional)"
      ],
      steps: [
        "Roll the lemon on the counter with your palm, then cut it in half \u2014 it gives up its juice more willingly.",
        "Squeeze both halves into the glass, catching any seeds with your fingers.",
        "Add the sugar, black salt and cumin powder, and stir until it dissolves.",
        "Top up with cold water, drop in one squeezed lemon half, and sip it slowly."
      ]
    },
    {
      name: "Pudina Kala Nimbu Sharbat",
      tier: "light",
      type: "full",
      prepTime: "7 min",
      ingredients: [
        "1 lemon",
        "8-10 fresh mint leaves (pudina)",
        "1 tsp sugar",
        "1 pinch black salt",
        "1 pinch roasted cumin powder",
        "1 glass cold water",
        "A few ice cubes"
      ],
      steps: [
        "Tear the mint leaves and drop them into the glass.",
        "Squeeze in the lemon, then add the sugar, black salt and cumin.",
        "Press everything gently with the back of a spoon to bruise the mint.",
        "Fill with ice and cold water, stir once, and drink it slowly."
      ]
    },
    {
      name: "Lemon Slice Sipper",
      tier: "light",
      type: "quick",
      prepTime: "1 min",
      ingredients: [
        "1 lemon slice",
        "1 glass cold water",
        "1 pinch salt"
      ],
      steps: [
        "Drop the lemon slice into a glass of cold water.",
        "Add the pinch of salt, stir once, and sip slowly."
      ]
    },
    {
      name: "Banana, Slowly",
      tier: "light",
      type: "quick",
      prepTime: "2 min",
      ingredients: [
        "1 ripe banana",
        "1 glass of water"
      ],
      steps: [
        "Peel the banana and eat it slowly \u2014 two or three bites at a time.",
        "Follow it with a few small sips of water."
      ]
    },
    {
      name: "Soaked Almonds & A Sip",
      tier: "light",
      type: "quick",
      prepTime: "3 min",
      ingredients: [
        "4-5 almonds",
        "A small bowl of warm water",
        "1 glass of water"
      ],
      steps: [
        "Cover the almonds with warm water and leave them for 3 minutes.",
        "Peel them and chew them slowly.",
        "Finish with a few sips of water."
      ]
    },

    /* ----------------------------------------------------
       MODERATE TIER — curd-based dishes
       ---------------------------------------------------- */

    {
      name: "Masala Chaas",
      tier: "moderate",
      type: "full",
      prepTime: "5 min",
      ingredients: [
        "\u00BD cup fresh curd",
        "1 cup cold water",
        "\u00BC tsp roasted cumin powder",
        "1 pinch black salt",
        "4-5 fresh mint leaves",
        "A small piece of fresh ginger (optional)"
      ],
      steps: [
        "Add the curd and cold water to a jug.",
        "Whisk with a fork or whisk until smooth and a little frothy.",
        "Stir in the cumin, black salt and mint; grate in the ginger if you have it.",
        "Let it sit for two minutes, then pour a glass and sip it slowly."
      ]
    },
    {
      name: "Curd Rice Bowl (Thayir Sadam)",
      tier: "moderate",
      type: "full",
      prepTime: "10 min",
      ingredients: [
        "\u00BD cup cooked rice, cooled",
        "\u00BD cup curd",
        "1 pinch salt",
        "\u00BC tsp roasted cumin powder",
        "\u00BD tsp mustard seeds with 2 curry leaves, tempered (optional)"
      ],
      steps: [
        "Fork-mash the cooled rice so there are no big clumps left.",
        "Fold in the curd and salt until it turns creamy.",
        "Sprinkle over the cumin, and add the mustard-seed tempering if you have it.",
        "Eat it at room temperature, a small spoonful at a time, and rest afterwards."
      ]
    },
    {
      name: "Fridge Chaas in a Mug",
      tier: "moderate",
      type: "quick",
      prepTime: "3 min",
      ingredients: [
        "2 tbsp fresh curd",
        "1 cup cold water",
        "1 pinch salt"
      ],
      steps: [
        "Tip the curd into a mug and add the cold water.",
        "Whisk hard with a fork until it is smooth.",
        "Add the salt, stir, and drink it over the next couple of minutes."
      ]
    },
    {
      name: "Plain Biscuits & Water",
      tier: "moderate",
      type: "quick",
      prepTime: "4 min",
      ingredients: [
        "A handful of plain biscuits or crackers",
        "1 glass of water"
      ],
      steps: [
        "Eat a few plain biscuits slowly \u2014 no spice, no drama.",
        "Take small sips of water between them."
      ]
    },
    {
      name: "Curd Toast",
      tier: "moderate",
      type: "quick",
      prepTime: "4 min",
      ingredients: [
        "1 slice of bread or toast",
        "2 tbsp fresh curd",
        "1 pinch salt"
      ],
      steps: [
        "Toast the bread if you can be bothered; plain bread works too.",
        "Spread the curd over it and sprinkle on the salt.",
        "Eat it sitting up, slowly."
      ]
    },

    /* ----------------------------------------------------
       HEAVY TIER — different curd-based dishes
       ---------------------------------------------------- */

    {
      name: "Dahi Boondi Bowl",
      tier: "heavy",
      type: "full",
      prepTime: "5 min",
      ingredients: [
        "1 cup curd",
        "\u00BD cup boondi (fried chickpea pearls)",
        "\u00BC tsp roasted cumin powder",
        "1 pinch black salt",
        "1 pinch red chilli powder (optional)"
      ],
      steps: [
        "Whisk the curd with two tablespoons of water until it is soft and spoonable.",
        "Rinse the boondi under cold water for a second, or soak it for two minutes, if you want it soft.",
        "Fold the boondi into the curd with the cumin and black salt.",
        "Finish with a pinch of chilli powder if you can take it, and eat it slowly."
      ]
    },
    {
      name: "Curd & Banana Comfort Bowl",
      tier: "heavy",
      type: "full",
      prepTime: "4 min",
      ingredients: [
        "\u00BD cup curd",
        "1 ripe banana",
        "1 tsp sugar or honey",
        "1 pinch cardamom powder (optional)",
        "1 tiny pinch salt"
      ],
      steps: [
        "Peel the banana and mash it with a fork until no big lumps remain.",
        "Fold the mashed banana into the curd.",
        "Add the sugar or honey, cardamom and the tiny pinch of salt, then stir.",
        "Let it sit for a minute, then eat a few spoonfuls at a time."
      ]
    },
    {
      name: "Honey-Curd Spoon",
      tier: "heavy",
      type: "quick",
      prepTime: "1 min",
      ingredients: [
        "2-3 tbsp chilled curd",
        "1 tsp honey"
      ],
      steps: [
        "Spoon the chilled curd into a small bowl.",
        "Drizzle the honey over it and eat it slowly, one spoonful at a time."
      ]
    },
    {
      name: "Cucumber Slices With Salt",
      tier: "heavy",
      type: "quick",
      prepTime: "3 min",
      ingredients: [
        "\u00BD cucumber",
        "1 pinch salt"
      ],
      steps: [
        "Slice the cucumber however you like \u2014 no precision required.",
        "Sprinkle on the salt and eat it slowly."
      ]
    },
    {
      name: "Slow Ice Sips",
      tier: "heavy",
      type: "quick",
      prepTime: "2 min",
      ingredients: [
        "A few ice cubes",
        "1 glass"
      ],
      steps: [
        "Put a couple of ice cubes into a glass.",
        "Let one melt in your mouth at a time \u2014 tiny, steady sips of cold."
      ]
    }
  ];

  /* =========================================================
     TIER COPY — one full block per tier, nothing shared
     ========================================================= */
  var TIER_CONTENT = {

    light: {
      headline: "A gentle nudge back to normal",
      intro: "A modest one, all things considered. These traditional home remedies may help you feel a bit more human \u2014 nothing here is a guaranteed cure, mind.",
      quickLabel: "Quick wins (under 5 minutes)",
      fullLabel: "Two nimbu sips to mix up",
      sipLabel: "How to sip",
      hydrationTip: "Keep a glass of water within reach and take about 200-250 ml every hour \u2014 small, steady sips rather than a heroic chug.",
      electrolyteLabel: "Electrolytes, the easy way",
      electrolytes: [
        "Nimbu paani with a pinch of salt",
        "Tender coconut water",
        "An ORS sachet stirred into a glass of water"
      ],
      caffeineLabel: "Caffeine: yes, but",
      caffeine: "A small tea or coffee is fine once you have had a glass of water first. One cup is plenty \u2014 don't let it turn into a pot."
    },

    moderate: {
      headline: "Today is a recovery day",
      intro: "A decent night with the bill arriving this morning. These curd-based home remedies may take the edge off, served the traditional way: slowly and without promises.",
      quickLabel: "Too wrecked to cook? Start here",
      fullLabel: "Two curd-based remedies",
      sipLabel: "Keep the water coming",
      hydrationTip: "Aim for a glass (around 200-250 ml) every 30-45 minutes over the next few hours, kept at room temperature and drunk in steady sips rather than all at once.",
      electrolyteLabel: "Refill the tank",
      electrolytes: [
        "A pinch of salt plus a spoon of sugar in a glass of water (home-made ORS)",
        "A spoon of honey stirred into a glass of lukewarm water",
        "Cooled rice water (maand) from the pressure cooker"
      ],
      caffeineLabel: "Caffeine: one cup, later",
      caffeine: "Wait until you have had some water and a little food in you, then one small cup of tea or coffee is okay. Skip the extra shots for today."
    },

    heavy: {
      headline: "Right. Let's take this slowly.",
      intro: "You went large, and your stomach has started filing complaints. These gentle curd-based home remedies may help \u2014 take them a spoonful at a time, and remember none of it is a cure.",
      quickLabel: "Zero-effort options",
      fullLabel: "Two gentle curd remedies",
      sipLabel: "Tiny sips only",
      hydrationTip: "Start with one or two mouthfuls every few minutes \u2014 about 100-150 ml at a time \u2014 and stop the moment your stomach objects. Build up to a glass an hour as things settle.",
      electrolyteLabel: "Electrolytes, slowly",
      electrolytes: [
        "A pinch of salt in a glass of lukewarm water",
        "Salted chaas, a few spoonfuls at a time",
        "The thin curd water from the top of the set curd, sipped slowly"
      ],
      caffeineLabel: "Caffeine: not yet",
      caffeine: "Skip caffeine until you have rehydrated \u2014 it can set you back further when you are already low on fluid. Once water is going down easily, start with one small cup."
    }
  };

  /* =========================================================
     EXPORT — plain script tag, no modules.
     ========================================================= */
  root.DrHangover = root.DrHangover || {};
  root.DrHangover.RECIPES = RECIPES;
  root.DrHangover.TIER_CONTENT = TIER_CONTENT;
})(typeof window !== "undefined" ? window : this);
