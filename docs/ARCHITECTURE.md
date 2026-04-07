# Architecture (current)

This project is a **single-file** GitHub Pages app: everything (UI, styles, logic, data) lives in `index.html`.

## Source of truth

- **`index.html`**: runtime + data (recipe arrays/constants, UI generation, calculations, persistence).
- There is **no active build step** in the repo at the moment (see `DECISIONS.md` for details).

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

Shared sync is driven by a global map:

- **`ALL_NAME_TO_INPUTS`**: `{ itemName: [inputId1, inputId2, ...] }`
- Built by **`buildAllNameToInputs()`** using per-tab `xxxNameToInput` maps.
- Used by:
  - **`syncSharedPrice(changedId)`**: propagate a single item update.
  - **`globalImportPrices()`**: when importing Auctionator CSV, update all matching inputs across all tabs.

If you add a new tab and its inputs don’t update when another tab changes the same item, the most common cause is: **the tab’s `xxxNameToInput` map wasn’t included in `buildAllNameToInputs()`**.

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

