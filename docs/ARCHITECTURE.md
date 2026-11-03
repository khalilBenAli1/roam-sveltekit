# How Roam fits together

Roam is an original November 2026 portfolio application. It is a static, local-first planner, with no server, API keys, analytics, live listings or bookings.

## Data flow and ownership

`fixtures.ts → domain.ts → Planner context → route composition → Board / ActivityCard / Editor`

`Planner context ↔ storage.ts → localStorage`

The root layout constructs one `Planner` per rendered component tree and supplies it through Svelte context. There is no module-scoped mutable trip state, so prerendering never shares customer state. `onMount` performs browser storage retrieval; the deterministic demo is the initial server and client state.

- **Routes** compose the overview and trip workspace. Three trip routes are prerendered with SvelteKit 3’s supported static adapter. `resolve` and `asset` handle the GitHub project base. A static `404.html` supports GitHub Pages, and `+error.svelte` handles client/framework errors.
- **Board** owns temporary day selection, category filter, saved-place view and editor visibility. **ActivityCard** exposes labelled native controls for edit, remove, visit order and day transfer. **Editor** owns unsaved form inputs in a native modal dialog, with Escape handling and focus restoration. Neither dialog nor form state is persisted.
- **domain.ts** contains explicit Activity/Day/Trip/Plans types and pure validation, cents conversion, overlap detection, summaries, reordering and moving. It has no Svelte, DOM or storage dependency. Start times are explicit minutes from midnight. Reordering changes visit order while preserving planned times; moving recomputes day summaries and overlaps, while preserving total trip cost. No inferred transport time is fabricated.
- **Planner** is a small Svelte 5 rune-based shared state class. Edits replace source state; totals and counts are derived in the view. A bounded twenty-snapshot history provides undo for edits, deletions, moves, imports and reset. Undo history is intentionally memory-only and ends when the page reloads.
- **storage.ts** is a typed persistence adapter. Unknown versions, corrupt JSON and invalid records return a temporary demo and a visible warning. Corrupt data is left untouched until the user explicitly replaces it. Failed reads or writes leave the session usable and explain the export fallback. Browser-local storage is not a cloud backup and tabs do not synchronize.

## Input and money rules

Version 1 exports contain all three destination plans, preserving the static route inventory. Import and persistence use the same validator: at most 300,000 UTF-8 bytes, three known unique destinations, 1–14 days per trip, 50 activities per day and 30 saved-place templates. Text lengths, actual calendar dates, unique identifiers, supported categories, integer fields and same-day activity endings are validated. Unknown object fields are discarded; no HTML is rendered from imported strings. Amounts are integer EUR cents; decimal input conversion avoids floating-point addition. Estimates are for the whole group and are fictional.

The day has at most 50 activities; pairwise interval comparison is simple and bounded. Adjacent endpoints do not overlap, nested intervals do, and manually reordered visits still detect conflicts correctly. Daily activity time sums durations; the last stop is the maximum end, not the last item in visit order. Budgets remain transparent even if the illustrative allowance is exceeded.

## Offline and update behavior

The supported SvelteKit service worker caches immutable code, self-hosted fonts, destination images and prerendered pages in a build-version cache. Documents are network-first with cached fallback; known assets are cached. The first complete cache installation requires a successful online visit. If installation/storage is blocked, the open page remains usable without external calls, but offline refresh cannot be promised. The worker claims clients after install; a new build waits for existing tabs to close before activating. Activation removes only older Roam-prefixed caches. No live navigation, map or transport routing is provided.

## Design boundaries

Roam’s app-first trip workspace combines a soft blue navigation rail, warm paper, cobalt actions, clear visit-order timeline and mobile day rail. Outfit is the geometric display family; Lato is the humanist interface family. Both are self-hosted, licensed Latin WOFF2 assets. Original generated destination imagery supplies atmosphere without claiming verified places or actual availability. The itinerary and budget remain the primary working surface.

## Verification and limits

Deterministic domain/persistence tests and Chromium/WebKit browser journeys cover the actual editing and recovery paths. Accessibility scans support keyboard and focus checks; they do not certify accessibility or replace testing with assistive technology. No real-device screen-reader audit was performed. There is no multi-device sync, collaborative editing, arbitrary trip creation, time-zone conversion or multi-currency conversion. Saved places are a curated destination-specific inspiration list. The plan dates use local calendar-day semantics and UTC solely for stable label formatting.

Current tooling audit findings are recorded in QA.md. The public app is static; build-time tooling stays outside the delivered browser bundle.
