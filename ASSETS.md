# Asset provenance

All destination images are original AI-generated illustrative artwork created November 3, 2026 with the built-in Image Generation tool for this portfolio. They depict imagined travel scenes and do not verify actual businesses, accommodation or navigational conditions. There are no hotlinked images or private client assets.

| Local asset                   | Subject                           | Generation source                               |
| ----------------------------- | --------------------------------- | ----------------------------------------------- |
| `static/images/kyoto.jpg`     | Kyoto old-town lane at dawn       | `exec-751d2e31-5007-4bc1-9209-09753d74d660.png` |
| `static/images/lisbon.jpg`    | Lisbon street and yellow tram     | `exec-17f99ac7-9054-410c-b190-3c1049f8dcb9.png` |
| `static/images/dolomites.jpg` | Dolomite peaks and turquoise lake | `exec-d655712f-14e6-4053-b68f-6a08a0aad1d5.png` |

JPEG delivery assets are resized/compressed derivatives, with no external runtime dependency. The original PNGs remain in the local generation archive and are not required to build this repository.

## Generation prompts

**Kyoto:** “Use case: photorealistic-natural. Create one wide landscape editorial travel photograph for an original fictional itinerary planning portfolio application, Roam. Subject: Kyoto old town at dawn, quiet stone lane in Higashiyama, layered wooden machiya houses and Yasaka pagoda in the middle distance, soft warm sunlight, one very small distant figure, a small subtle cherry blossom branch at edge. Refined travel magazine photography, natural film grain, muted slate blue sky, warm terracotta and honey wood, real material texture, calm and uncommercial. Landscape 3:2 composition. No writing, no logos, no frame, no watermark. This is illustrative generated destination artwork, not a factual travel listing.”

**Lisbon:** “Use case: photorealistic-natural. Wide editorial travel photograph for original fictional Roam itinerary planner. Lisbon Portugal: quiet steep old cobbled street with a small classic yellow tram, faded peach and cream buildings, blue and white azulejo tiles, blue sky, distant river, late afternoon Mediterranean light. Understated travel magazine analogue photography, tactile, calm, lively pastel color. Landscape 3:2 composition. No words, logos, signage text or watermark. Illustrative generated travel artwork.”

**Dolomites:** “Use case: photorealistic-natural. One wide landscape editorial travel photograph for original fictional Roam itinerary planner. Italian Dolomites: striking jagged pale limestone alpine peaks in the distance, quiet dark turquoise lake and green meadows with a few larch trees, tiny walking path, crisp late spring morning, hazy pale blue sky, serene and inviting. Refined travel magazine analogue photography, natural textures and muted sophisticated color, landscape 3:2 composition. No text, no logo, no watermark. Illustrative generated destination artwork.”

## Typography and interface art

- Outfit, variable Latin WOFF2, and Lato, regular/bold Latin WOFF2, self-hosted in `src/lib/assets`. SIL Open Font License 1.1; full notices in `docs/licenses`. Obtained from the official Google Fonts stylesheet and fonts.gstatic.com on November 3, 2026. Upstream license sources: [Outfit](https://github.com/google/fonts/tree/main/ofl/outfit), [Lato](https://github.com/google/fonts/tree/main/ofl/lato). Font source URLs are recorded in `docs/fonts-source.css`.
- Roam wordmark, compass favicon, inline SVG interface glyphs, colors and layouts are original code created for this application. No third-party icon package.
- `docs/screenshots` contains real browser captures of the running application, not reference mockups. No supplied Roam screenshot exists; the design follows the original written art direction in `docs/PLAN.md`.

The MIT code license does not replace the fonts’ OFL or make exclusive authorship claims about generated artwork.
