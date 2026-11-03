# Verified public release

Roam was published and verified November 3, 2026.

- **[Live demo](https://khalilbenali1.github.io/roam-sveltekit/)** — free GitHub Pages, with the repository subpath preserved.
- **[Source](https://github.com/khalilBenAli1/roam-sveltekit)** — original November 2026 portfolio application.
- **[Feature PR #1](https://github.com/khalilBenAli1/roam-sveltekit/pull/1)** — merged normally after both final `ef002361d7af251407532c858adabaab2b6d739b` checks passed. Foundation, core flow and hardening commits remain in history.
- **Implementation merge:** `cbb6262fdf8bb4d456ac2c6017e9e63941120a45`.
- **[Passing main release and Pages deployment](https://github.com/khalilBenAli1/roam-sveltekit/actions/runs/41565329697)** — both checks and deployment succeeded.

## Actual public-site verification

A fresh Chromium context opened the deployed site and confirmed:

- Home and all three direct trip routes return HTTP 200 and correct route titles.
- Six destination JPEGs, the favicon and the service worker return HTTP 200. Fonts and interface assets load with no HTTP failures.
- Creating an activity displays the correct cents estimate and overlap warning.
- Moving the activity to an empty day updates the planner; removal and undo work.
- After a complete service-worker installation, offline reload restores the saved edit and the day remains usable.
- An unknown public route returns the deliberate HTTP 404 with a return-to-trips link.
- No browser page errors or unexpected failed HTTP responses occurred.

The observed machine-readable results are in [live-verification.json](live-verification.json). Local and CI evidence includes 19 deterministic unit tests and 22 Chromium/WebKit journeys, plus strict application/worker type checks, lint, format, production build, Axe, reduced motion, keyboard/focus, 390/768/1440 reflow and content zoom. Actual screenshot captures and loaded font checks are in [browser-capture.json](browser-capture.json).

## Boundaries

No live travel prices, bookings, navigation, cloud persistence or collaborative sync are provided. Plans stay in this browser; export a backup. Offline first use requires a completed online installation; undo ends at reload. Real-device screen-reader verification remains outside this demo’s evidence. Current development-tool audit findings and measured payloads are documented honestly in [QA.md](QA.md). Original image and self-hosted font provenance is in [ASSETS.md](../ASSETS.md).
