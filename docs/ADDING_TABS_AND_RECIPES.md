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

- If you rely on the existing global delegated handlers, make sure your tab’s input IDs follow the expected patterns and that your tab is included where the code calls `...Calculate()` after imports/nudges/resets.
- Otherwise, add the call to your `xxxCalculate()` in the same spots other tabs are called (imports, reset, and input change handlers).

### 5) Everything tab integration (optional but recommended)

If you want the Everything tab to show your new tab’s recipes:

- Ensure your tab produces a stable result list (similar to `alchResults`, `gearResults`, etc.).
- Ensure `evCalculate()` reads it.

## “Definition of done” for a new tab

- **Shared sync**: changing a shared item price updates all tabs that include that item.
- **Global import**: importing Auctionator prices updates all matching inputs in the new tab.
- **Persistence**: reload keeps inputs (if the tab is intended to persist).
- **Everything tab**: new tab’s recipes show up (if intended).

