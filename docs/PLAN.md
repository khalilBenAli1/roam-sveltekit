# Implementation plan

1. Foundation: strict SvelteKit 3 + static adapter, supported packages, independent Git history. Verify typecheck and production build before foundation push.
2. Core slice: destination overview and direct trip routes; editable day timeline, ordered activities, schedule conflicts, integer cents budgets, saved places and category filters.
3. Resilience: bounded validated versioned local storage; undo, import/export and reset; recover blocked/corrupt storage without crashing or silently overwriting corrupt data.
4. Verify: deterministic unit tests; browser journeys covering editing, reorder/move, conflict, undo, persistence/import/export/rejection and recovery; keyboard, Axe, reduced motion and 390/768/1440 reflow.
5. Delivery: inspect real build screenshots, record visual verdicts and actual bundle sizes, complete architecture/provenance documentation, passing feature PR CI and history-preserving merge; publish free GitHub Pages and verify routes/assets/core flow.

## Visual target

A refined travel notebook: warm #f7f7f2 paper, soft blue sidebar, cobalt accents, editorial destination imagery and large typographic headings. Desktop: compact persistent navigation, wide cover, slim day rail, spacious timeline and a useful trip summary. Mobile: top navigation, horizontal day rail, full-width activity controls. No supplied Roam reference exists; assess against this original art direction.

## Final typography decision

The portfolio-wide uniqueness requirement reserves **Outfit display + Lato interface** for Roam. These self-hosted OFL families replace the early typography experiment. The final composition stays app-first: editable day timeline, day rail and derived summary, supported by destination imagery. Final screenshots and visual review are in docs/screenshots and docs/visual-review.json.
