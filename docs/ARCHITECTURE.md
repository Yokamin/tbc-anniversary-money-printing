# Architecture (current)

This project is in a **single-file to modular migration** for GitHub Pages.

Current state:
- Main app shell and most logic still live in `index.html`.
- Core architecture pieces have been extracted into plain JS modules under `src/core/`.
- UI polish overrides are in `styles/main.css` (non-redesign, usability-focused layer).
- Standalone Bags navigation has been merged into Tailoring-facing flows (with compatibility data paths retained during transition).

## Source of truth

- **`index.html`**: runtime shell + main wiring + current tab implementations.
- **`src/core/priceStore.js`**: centralized shared-price grouping/sync engine.
- **`src/core/tabRegistry.js`**: tab lifecycle registration and grouped recalculation.
- **`src/core/runtimeTabs.js`**: default tab wiring and grouped recalc helpers used by bootstrap.
- **`src/core/uiUtils.js`**: shared numeric/UI helpers (g/s/c formatting, sizing, input display).
- There is **no build step** (plain files directly served by GitHub Pages).

## High-level flow

```mermaid
flowchart TD
  UserEdits[User edits inputs/buttons] --> DelegatedHandlers[Global delegated handlers]
  DelegatedHandlers --> Sync[Shared price sync]
  DelegatedHandlers --> Recalc[Recalculate affected tabs]

  Sync --> SyncOne[syncSharedPrice(changedId)]
  Sync --> SyncAll[syncAllSharedPrices()]

  Recalc --> BagsCalc[calculate()_Bags]
  Recalc --> AlchCalc[alchCalculate()]
  Recalc --> GearCalc[gearCalculate()]
  Recalc --> TxCalc[txCalculate()]
  Recalc --> CookCalc[cookCalculate()]
  Recalc --> EnchCalc[enchCalculate()]
  Recalc --> LwCalc[lwCalculate()]

  BagsCalc --> Everything[evCalculate()_EverythingTab]
  AlchCalc --> Everything
  GearCalc --> Everything
  TxCalc --> Everything
  CookCalc --> Everything
  EnchCalc --> Everything
  LwCalc --> Everything
```

## Shared price sync (why “some items update everywhere”)

Shared sync is now driven by the `PriceStore` module, with compatibility exposure via `ALL_NAME_TO_INPUTS`:

- `buildAllNameToInputs()` builds the store from per-tab `xxxNameToInput` maps.
- `syncSharedPrice(changedId)` delegates to `PriceStore.syncChanged(...)`.
- `syncAllSharedPrices()` delegates to `PriceStore.syncAll(...)`.
- `globalImportPrices()` resolves canonical item names through `PriceStore` before stamping timestamps.

If you add a new tab and its inputs don’t update when another tab changes the same item, the most common cause is still: **the tab’s `xxxNameToInput` map wasn’t included in `buildAllNameToInputs()`**.

## Persistence

Most state is stored in `localStorage`:

- Per-tab price inputs (e.g. `tbc_alchemy_calculator`, `tbc_gear_calculator`, etc.)
- UI state (selected tab, dropdown selection)
- Locks, staleness timestamps, and “Everything” tab filters/sort/view.

## Data

Recipe data is embedded inside `index.html` as arrays/constants such as:

- `ALCHEMY_RECIPES`
- `GEAR_RECIPES`
- `TX_PRIMALS`, `TRANSMUTE_RECIPES`, `CLOTH_DAILIES`
- `COOKING_RECIPES`
- `ENCHANTING_RECIPES`
- `LW_RECIPES`

`DECISIONS.md` documents the expected data formats and ingredient types.

