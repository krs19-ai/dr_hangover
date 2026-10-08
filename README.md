# Dr. Hangover

A tiny, mobile-first web app that asks what you drank last night and suggests
traditional home remedies that **may help**. Dark theme, no frameworks, no build
step, no backend, nothing stored or sent anywhere.

> Not medical advice. Dr. Hangover offers general home-remedy ideas only.

## Run it

Just open `index.html` in a browser (double-click it, or drag it into a window).
There is no install, no server and no build step.

- Everything is plain HTML/CSS/JS with regular `<script>` tags — no modules, no
  `fetch()`, so it works straight from the file system.
- All paths are relative (`style.css`, `logic.js`, `recipes.js`, `app.js`), so the
  folder can be moved around or wrapped for Android as-is.

## Files

| File | What's in it |
|---|---|
| `index.html` | The whole app: input, loading and results screens (one visible at a time) |
| `style.css` | Dark theme built from CSS variables at the top of the file |
| `logic.js` | Scoring and tier selection — all tuning constants live here |
| `recipes.js` | Every recipe, quick option, tip, electrolyte idea and caffeine line |
| `app.js` | Screen switching, form validation and rendering |

## Add a recipe

Open `recipes.js` and push another object into the `RECIPES` array. Nothing else
needs to change.

```js
{
  name: "Salted Rice Water",
  tier: "moderate",          // "light" | "moderate" | "heavy"
  type: "full",              // "full" (a proper recipe) | "quick" (under 5 min)
  prepTime: "3 min",
  ingredients: ["1 glass of cooled rice water", "1 pinch salt"],
  steps: [
    "Let the rice water cool down.",
    "Stir in the salt and sip slowly."
  ]
}
```

- `type: "full"` recipes show up under the tier's remedy section (2 per tier is
  the current pattern); `type: "quick"` ones land under the "too wrecked to cook"
  list (2-3 per tier).
- Tier copy — headline, hydration tip, electrolytes, caffeine line — lives in the
  `TIER_CONTENT` object just below `RECIPES`, one block per tier.

## Tune the scoring

Everything that affects the result is in one commented block at the top of
`logic.js`; the values are never scattered through the code.

| Constant | What it does |
|---|---|
| `DRINK_STRENGTH` | Rough strength per serving for beer, wine, whisky, rum, vodka, other |
| `MIXED_PENALTY` | Extra multiplier when the user says they mixed drinks (1.15 = +15%) |
| `WEIGHT_REF_KG` | Reference body weight; lighter people score higher |
| `HOURS_DECAY_PER_HOUR` | Score drop for every hour since the last drink |
| `MIN_TIME_FACTOR` | Floor on that decay, so yesterday's drinks still count |
| `WATER_FACTOR` | Multiplier for none / a little / a good amount of water |
| `LIGHT_MAX`, `MODERATE_MAX` | Tier thresholds — score at or below them is that tier |

The score is an internal number only: it is never displayed in the app, and only
maps to `light`, `moderate` or `heavy`.

## Wrap it for Android later

Because everything is relative and self-contained, you can drop this folder into
a Capacitor project later (`npx cap init`, add `index.html` as the web root, then
`npx cap add android`) without changing any code.
