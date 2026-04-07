# Adding tabs and recipes (checklist)

This doc is intentionally practical: when you’re adding content, follow this checklist to avoid regressions (especially shared-price sync issues).

## Adding a recipe to an existing tab

- **Update the tab’s recipe array** in `index.html` (e.g. append an entry to `ALCHEMY_RECIPES`, `GEAR_RECIPES`, `COOKING_RECIPES`, etc.).
- **Use the correct ingredient shape** for that tab (see `DECISIONS.md` → “Recipe Data Format”).
- **Keep item names consistent** with other tabs when you want shared sync (e.g. `Arcane Dust`, not `Arcane dust`).
- **Update any category ordering lists** if the tab uses them (e.g. `GEAR_CATEGORY_ORDER`).
- **Sanity-check**:
  - recipe appears in dropdown and profit overview,
  - craft cost and profit update when you change an ingredient price,
  - staleness dot logic behaves as expected (import updates dots, manual edits don’t).

## Moving/merging existing recipes across tabs

When migrating recipes (example: Bags -> Tailoring), keep feature parity deliberately:

- **Staleness parity**: migrated rows must still show staleness dots using equivalent tracked inputs/sale price.
- **Everything parity**: rows should still appear in Everything with correct tab/category grouping.
- **Search parity**: ingredient search should still find the recipe and navigate to a valid destination.
- **Navigation parity**: old tab keys/routes should have fallback aliases (avoid broken saved state).
- **Import/sync parity**: existing item imports and shared-price sync behavior should remain unchanged.
- **Detail-view parity**: migrated recipes must retain access to full detail context (left-side relevant inputs, not just summary cards).
- **Sourcing-depth parity**: if a recipe previously showed buy-vs-craft chain decisions (including recursive sub-crafts), the migrated view must keep equivalent decision detail.
- **Recipe-specific context parity**: preserve any unique per-recipe helper information (e.g. additional breakdown notes/cards) before removing old paths.

## Adding a new tab (minimum wiring)

### 1) Create data + per-tab maps

- Add a new `const XXX_RECIPES = [...]` (or appropriate data constant).
- Ensure the tab has a **name→input map**: `const xxxNameToInput = {};` populated as inputs are created.

### 2) UI generation and calculate function

Implement (pattern-match existing tabs):

- `xxxInit()` to build the UI and populate `xxxNameToInput`.
- `xxxCalculate()` to compute craft cost/revenue/profit and render the summary table.
- `xxxSaveToStorage()` / `xxxLoadFromStorage()` (if you want the tab’s inputs persisted like the others).
- `xxxSelectRecipe()` if you want an “All (Profit Overview) / per recipe” dropdown.

### 3) Shared-price sync registration (critical)

To participate in shared syncing and global import:

- Add `xxxNameToInput` to **`buildAllNameToInputs()`**’s `allMaps` array in `index.html`.

If you forget this, the exact symptom is:

- “I added a new tab, but items that exist in other tabs don’t update here when changed/imported.”

### 4) Hook it into global recalculation

Ensure the tab’s calculate function is triggered when needed:

- Register the tab lifecycle in `registerTabs()` so `TAB_REGISTRY` knows how to init/load/calc it.
- If you rely on delegated handlers, ensure handlers call your tab calc function where appropriate.
- Prefer registry-driven grouped recalc paths (`calculateCoreTabs()` / `calculateAllTabs()`) instead of adding new ad-hoc manual chains.

### 5) Everything tab integration (optional but recommended)

If you want the Everything tab to show your new tab’s recipes:

- Ensure your tab produces a stable result list (similar to `alchResults`, `gearResults`, etc.).
- Ensure `evCalculate()` reads it.

## “Definition of done” for a new tab

- **Shared sync**: changing a shared item price updates all tabs that include that item.
- **Global import**: importing Auctionator prices updates all matching inputs in the new tab.
- **Persistence**: reload keeps inputs (if the tab is intended to persist).
- **Everything tab**: new tab’s recipes show up (if intended).
- **Navigation aliases**: if a tab was renamed/merged (e.g. Bags -> Tailoring), add routing fallback in `switchTab()` so old persisted tab keys do not break startup.

