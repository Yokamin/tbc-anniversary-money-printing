# TODO / ideas

This file is meant to track **future work**, not day-to-day experiments.

## High priority (maintenance / correctness)

- **Extensibility audit**: when adding a new tab, ensure it participates in:\n  - shared price sync (`buildAllNameToInputs()` registration)\n  - global import\n  - Everything tab aggregation (if desired)\n  - localStorage persistence\n- **Name normalization**: decide on one canonical name per item and enforce it (to prevent sync/import bugs from casing/spelling differences).
- **Basic regression checklist** for each “stable” release:\n  - Global import updates shared items across all tabs\n  - Staleness dots update on import and age correctly\n  - Everything tab: Flat and By Section views render\n  - Export generator produces consistent list ordering

## Medium priority (code health)

- **Split `index.html` logically** (even if still shipped as one file):\n  - move data blocks into a dedicated “data section”\n  - move helpers into a dedicated “utils section”\n  - group each tab into a self-contained section\n- **Introduce a lightweight “tab registration” pattern** so adding tabs is declarative (reduces missed wiring).

## Low priority / nice-to-have

- Add a small “About / Help” section in the UI that links to docs and reminds users how to import Auctionator exports.
- Add optional export formats (e.g. CSV) if it helps your workflow.
- **TSM ledger lookup helper (TBC Anniversary context)**:
  - Goal: make it easy to query specific items from accumulated TSM ledger data (expenses/revenue) without manual searching in addon UI.
  - Scope discovery first: confirm which TSM files/exports are accessible and whether data is encrypted/encoded.
  - If feasible, add a local parser/lookup utility that can answer item-level questions quickly (profit/cost history summaries).
- **Auctionator export compare tool**:
  - Add an input that accepts an in-game Auctionator export and compares it against the site's generated export.
  - Comparison should be set-based (ignore ordering), and highlight missing items, extras/duplicates, and likely outdated lists.
  - Include a small workflow hint for "manual in-game additions" so the diff can drive either site updates or in-game list cleanup.
- **Move recipe dropdown/back controls to center/main view area**:
  - Put recipe selector + back button above profit overview/detail area (instead of left input column) for shorter mouse travel and cleaner input column.
- **Alchemy batch custom amount**:
  - Extend ×1/×100/×1000 with a `Custom` mode + numeric input, used in main overview math/sorting.
- **LocalStorage snapshot/export helper**:
  - Add a way to export current local prices/settings (especially vendor prices + deposits) so defaults can be promoted into code more easily.
- **Missing defaults indicators**:
  - Add warnings for missing deposit/vendor values:
    - lightweight row indicator in overview (e.g. `!`),
    - clear banner/notice in recipe detail when required deposit/vendor values are missing.

