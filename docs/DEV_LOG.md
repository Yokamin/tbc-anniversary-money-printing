# Dev Log

Chronological summary of major completed work.

## 2026-04-07 — v2.1.0 overhaul milestone

- Finalized modular architecture sweep.
- Extracted domain logic into dedicated tab modules:
  - `src/tabs/alchemyLogic.js`
  - `src/tabs/gearLogic.js`
  - `src/tabs/transmutesLogic.js`
  - `src/tabs/cookingLogic.js`
  - `src/tabs/enchantingLogic.js`
  - `src/tabs/leatherworkingLogic.js`
  - `src/tabs/everythingLogic.js`
- Extracted recipe data constants to `src/data/*.js`.
- Added/refined shared core modules for storage/sync/import/navigation helpers.
- Added extension and smoke runbooks:
  - `docs/EXTENSION_CHECKLIST.md`
  - `docs/SMOKE_TEST_CHECKLIST.md`
- Preserved Auctionator export contract:
  - keep `1.0 ALL BAGS` separate from Tailoring sections.
- Removed legacy archived artifacts no longer used at runtime.

## 2026-04-07 — post-overhaul follow-up

- Added deeper Leatherworking sourcing for Cobrahide:
  - `Heavy Knothide Leather -> Knothide Leather -> Knothide Leather Scraps`.
- Updated Leatherworking view + logic to support nested `craftFrom.mats` paths.
- Updated export generator recursion so nested AH sub-materials are included (covers the new scraps path and future nested chains).
- Updated extension checklist with an explicit nested-craft export verification step.

## 2026-04-07 — v2.2.0 release (shipped)

- Centered recipe dropdown and **← All** in the main content header on calculator tabs.
- Per-recipe **Crafting amount** in detail views (quantity-aware ingredients, cost, profit); **Reset** control sets amount back to ×1.
- Missing-default reminders: warning icon on overview rows; high-contrast banner in detail when vendor/deposit defaults are incomplete.
- **Manual Snapshot** toolbar action: JSON export of vendor prices, deposits, and AH cut for backup/default promotion.
- **Compare export** toolbar action (next to **Ingredients**): modal to paste in-game Auctionator export and diff against current **Export Lists** output (order-insensitive; missing, extra, duplicates).
- Leatherworking: nested `craftFrom.mats` support and export generator recursion for nested AH-searchable materials (Cobrahide / scraps chain).
- Documentation: README tab order and Shared Features; smoke and versioning runbooks updated for `2.2.x`.

## Ongoing policy

- When a missed implementation step causes a bug:
  1. fix the bug,
  2. add the missing prevention step to checklist docs,
  3. note it in release/dev log updates.
- Dev log entries should be keyed by date and release version (when applicable); commit hashes are optional.
- Log completed work even when it was not pre-listed in `docs/TODO.md`.
