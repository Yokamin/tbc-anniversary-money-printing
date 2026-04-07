# Architecture (current)

This project uses a **modular plain-file architecture** for GitHub Pages (no build step).

Current state:
- Main app shell and wiring live in `index.html`.
- Core cross-cutting concerns are extracted into plain JS modules under `src/core/`.
- UI polish overrides are in `styles/main.css` (non-redesign, usability-focused layer).
- Standalone Bags navigation/DOM has been removed; bag recipes are part of Tailoring flows.

## Source of truth

- **`index.html`**: runtime shell + main wiring + current tab implementations.
- **`src/data/*.js`**: extracted recipe/market dataset constants (`ALCHEMY_RECIPES`, `GEAR_RECIPES`, `TX_*`, `COOKING_RECIPES`, `ENCHANTING_RECIPES`, `LW_RECIPES`) loaded as globals before tab logic.
- **`src/core/priceStore.js`**: centralized shared-price grouping/sync engine.
- **`src/core/constants.js`**: centralized storage-key constants used by runtime wiring.
- **`src/core/tabRegistry.js`**: tab lifecycle registration and grouped recalculation.
- **`src/core/runtimeTabs.js`**: default tab wiring and grouped recalc helpers used by bootstrap.
- **`src/core/tabNavigation.js`**: tab switching + active-tab re-click reset behavior.
- **`src/core/recipeRouting.js`**: shared recipe-selection routing by tab context.
- **`src/core/recipeNavigationClicks.js`**: recipe/tab click-dispatch behavior for dropdowns, summary rows, and tab buttons.
- **`src/core/recipeSelectionHelpers.js`**: shared dropdown-sync + tab reset-to-main helpers.
- **`src/core/uiUtils.js`**: shared numeric/UI helpers (g/s/c formatting, sizing, input display).
- **`src/core/profitUtils.js`**: shared profit margin and result-sorting helpers used across overview tables.
- **`src/core/sortControls.js`**: per-tab sort state and sort-toggle button synchronization.
- **`src/core/tsmUi.js`**: TSM notes helpers (age labels, g/s/c preview HTML, per-field save/input rendering).
- **`src/core/procControls.js`**: proc calculator modal/inline controls and proc-rate update handlers.
- **`src/core/toolbarActions.js`**: global export/copy and AH reset toolbar actions.
- **`src/core/locks.js`**: lock state read/write and lock-button display behavior.
- **`src/core/storageRead.js`**: shared localStorage value readers for json/number/int bootstrap state.
- **`src/core/tabStorage.js`**: shared per-tab save/load localStorage helpers.
- **`src/core/sharedPriceSync.js`**: wrapper around `PriceStore` build/sync orchestration.
- **`src/core/globalImport.js`**: global AH import parser + lock-aware write orchestration.
- **`src/core/cooldowns.js`**: cooldown tracker state + timer/render orchestration.
- **`src/core/staleness.js`**: AH input mapping and staleness-dot computation/render helpers.
- **`src/core/ingredientSearch.js`**: ingredient search index build, modal behavior, and results rendering helpers.
- **`src/core/everythingControls.js`**: Everything-tab filter/sort/view control handlers and persistence wiring.
- **`src/tabs/enchantingView.js`**: extracted Enchanting view builders used by `enchInit()`.
- **`src/tabs/leatherworkingView.js`**: extracted Leatherworking view builders used by `lwInit()`.
- **`src/tabs/cookingView.js`**: extracted Cooking view builders used by `cookInit()`.
- **`src/tabs/transmutesView.js`**: extracted Transmutes/Dailies view builders used by `txInit()`.
- **`src/tabs/consumablesView.js`**: extracted Consumables view renderer used by `consumablesInit()`.
- **`src/tabs/alchemyView.js`**: extracted Alchemy view builders used by `alchInit()`.
- **`src/tabs/alchemyLogic.js`**: extracted Alchemy visibility/selection/batch/calc logic used by `alch*` runtime wrappers.
- **`src/tabs/gearLogic.js`**: extracted Gear ingredient-cost, calc, and selection logic used by `gear*` runtime wrappers.
- **`src/tabs/transmutesLogic.js`**: extracted Transmutes/Dailies calc, selection, and export builder logic used by `tx*` runtime wrappers.
- **`src/tabs/cookingLogic.js`**: extracted Cooking calc and selection logic used by `cook*` runtime wrappers.
- **`src/tabs/enchantingLogic.js`**: extracted Enchanting calc and selection logic used by `ench*` runtime wrappers.
- **`src/tabs/leatherworkingLogic.js`**: extracted Leatherworking ingredient-cost, calc, and selection logic used by `lw*` runtime wrappers.
- **`src/tabs/everythingLogic.js`**: Everything tab TSM/read rendering helpers and calc engine.
- There is **no build step** (plain files directly served by GitHub Pages).

## High-level flow

```mermaid
flowchart TD
  UserEdits[User edits inputs/buttons] --> DelegatedHandlers[Global delegated handlers]
  DelegatedHandlers --> Sync[Shared price sync]
  DelegatedHandlers --> Recalc[Recalculate affected tabs]

  Sync --> SyncOne[syncSharedPrice(changedId)]
  Sync --> SyncAll[syncAllSharedPrices()]

  Recalc --> AlchCalc[alchCalculate()]
  Recalc --> GearCalc[gearCalculate()]
  Recalc --> TxCalc[txCalculate()]
  Recalc --> CookCalc[cookCalculate()]
  Recalc --> EnchCalc[enchCalculate()]
  Recalc --> LwCalc[lwCalculate()]

  AlchCalc --> Everything[evCalculate()_EverythingTab]
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

Recipe data is extracted into `src/data/*.js` and exposed as global constants, then consumed by the runtime shell:

- `ALCHEMY_RECIPES`
- `GEAR_RECIPES`
- `TX_PRIMALS`, `TRANSMUTE_RECIPES`, `CLOTH_DAILIES`
- `COOKING_RECIPES`
- `ENCHANTING_RECIPES`
- `LW_RECIPES`

`DECISIONS.md` documents the expected data formats and ingredient types.

