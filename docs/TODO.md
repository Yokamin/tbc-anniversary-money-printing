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

