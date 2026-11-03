# Verification evidence

Verified November 3, 2026 with Node 22.23.1 and npm 10.9.8. These are observed local results, not invented performance/accessibility scores.

| Check                                                        | Result                                                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Clean `npm ci`                                               | Passed after explicitly resolving Vite 8’s optional YAML 2 peer                                |
| ESLint / Prettier                                            | Passed                                                                                         |
| Strict Svelte/TypeScript + separate service-worker typecheck | 0 errors, 0 warnings                                                                           |
| Vitest                                                       | 19 passing domain and persistence tests                                                        |
| Playwright                                                   | 22 passing journeys in Chromium and WebKit                                                     |
| Axe WCAG A/AA-tagged scans                                   | No violations on overview and itinerary at 390 / 768 / 1440 in both engines                    |
| Keyboard                                                     | Reorder, dialog Escape/focus return, native day-transfer controls exercised                    |
| Responsive / reduced motion                                  | 390 / 768 / 1440; 125% content zoom; long activity title and modal scrolling exercised         |
| Offline                                                      | Cached planner reload, existing edits, remove and undo pass in both engines                    |
| Real screenshot capture                                      | 0 browser page errors; computed fonts Outfit display and Lato body                             |
| Visual review                                                | 94/100 against original written art direction; see visual-review.json                          |
| Production output                                            | Prerendered home and three direct trip routes; deliberate static 404; supported static adapter |

The browser suite covers editing, mouse/keyboard order changes, moving between days with daily summaries, overlap feedback, undo deletion, reload persistence, filters, empty day/saved-place addition, end-after-midnight validation, valid JSON round trip, malformed/oversized/unknown-version import rejection, markup escaping, corrupt-storage preservation/replacement, blocked storage, direct routes, offline reload and zoom. Browser contexts isolate local storage. Tests use bounded fixture plans, not clocks or live services. Undo history ends at reload by design.

## Measured build output

`docs/build-measurements.json` records actual November 3 production output, with per-file gzip via Node zlib. These totals cover **all routes**, not initial page transfer or network latency:

| Asset group                          | Count | Actual bytes | Sum of per-file gzip bytes |
| ------------------------------------ | ----: | -----------: | -------------------------: |
| JavaScript, including service worker |    18 |      141,059 |                     56,949 |
| CSS                                  |     1 |       29,806 |                      7,072 |
| WOFF2 fonts                          |     3 |       60,376 |                     60,244 |
| Destination JPEGs (900px + 1536px)   |     6 |    2,563,800 |                  2,563,418 |
| HTML including static 404            |     5 |       76,027 |                     18,285 |

Responsive `srcset` selects smaller 900px images for phones and cards; those three files total 636,412 bytes. Large covers range from 536,630 to 776,588 bytes. The service worker deliberately precaches the complete app for offline use, so first-install background transfers include both image sizes, roughly 2.9 MB overall. No external fonts, image hotlinks, map tiles, analytics or travel API are needed. No Lighthouse run or score is claimed.

## Known verification limits

Automated scans do not establish accessibility certification. No real-device screen-reader audit was performed. CSS zoom approximates enlarged content; physical phone/browser zoom and all assistive-technology combinations remain untested. Offline refresh depends on a prior complete cache installation and browser storage availability; a first-ever offline visit cannot work.

The current npm audit on November 3 reports 11 **development dependency** findings (2 low and 9 moderate), involving deepmerge and minimatch in the framework/lint tooling graph. No high/critical findings were reported. We retained supported current packages rather than force-downgrading toolchains or adding unverified transitive overrides; monitor upstream fixes. Static browser delivery does not run the Node build tools. This is not a claim that the generated browser bundle has received an independent security audit.

Remote PR/Pages CI and successful public route/core-flow verification are recorded in RELEASE.md and live-verification.json. The first remote core checkpoint correctly failed on a YAML optional-peer lock resolution mismatch; the fix explicitly pins the compatible YAML 2 development peer and a fresh clean install has been verified.
