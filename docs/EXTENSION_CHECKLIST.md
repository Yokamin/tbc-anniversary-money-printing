# Extension checklist (recipes + tabs)

Use this when adding new recipes, categories, or tabs so changes are complete on first run.

## Add a recipe to an existing tab

1. Add the recipe data entry in the correct `src/data/*.js` file.
2. Follow the tab's existing recipe schema exactly (`id`, `name`, `category`, `ingredients`, optional `yieldQty`, etc.).
3. Ensure every new ingredient type used by the recipe is already supported by that tab's logic module.
4. If a new ingredient type is required, add handling in the tab logic module (`src/tabs/*Logic.js`) and verify cost/profit calculation.
5. Confirm view rendering picks up the recipe automatically (dropdown, detail panel, summary row).
6. Confirm staleness dots include the correct inputs for the new recipe.
7. Confirm TSM fields render and persist for the new recipe row.
8. Confirm "Everything" tab shows the new recipe with correct category grouping and profit.
9. Confirm ingredient search finds the new recipe and "Go to recipe" routes correctly.
10. Confirm Auctionator export includes/excludes the new recipe as intended.
11. If the recipe belongs to the Bags subset, keep it under the dedicated `1.0/1.x` Bags export grouping (even though Bags are merged into Tailoring UI).
12. If the recipe adds deeper craft chains (`craftFrom.mats` / nested alternatives), confirm export generation includes all relevant AH-searchable sub-materials.
13. For nested craft chains, verify detail-view structure at every tier:
   - each craftable tier shows both `buy` and `craft` rows,
   - deeper materials are indented under the parent `craft` branch,
   - active `USING` highlight correctly reflects the cheapest option at each tier.

## UI conventions (HTML/CSS)

1. **Numeric inputs**: Use the same dark theme as existing price fields (see `.price-control input` in `index.html`). Native stepper arrows are **disabled globally** for `input[type="number"]` — do not re-enable them on new fields unless there is an explicit, documented exception.

## Add a new tab

1. Create data module(s) in `src/data/` for tab recipe/constants.
2. Create `src/tabs/<tab>View.js` for tab UI builders.
3. Create `src/tabs/<tab>Logic.js` for calculations/selection behavior.
4. Add script includes in `index.html`:
   - data modules first,
   - then view/logic modules,
   - before app initialization runs.
5. Add tab section markup in `index.html` (`tab button`, `tab panel`, expected IDs/classes).
6. Add tab state variables in `index.html` (results/sort/maps/TSM storage keys as needed).
7. Add thin wrappers in `index.html` (`<tab>Init`, `<tab>Calculate`, `<tab>SelectRecipe`, save/load wrappers).
8. Register tab in runtime wiring (`AppRuntimeTabs.registerDefaultTabs(...)`).
9. Add tab to shared sync map build (`buildAllNameToInputs` inputs source list).
10. Add tab to recipe navigation routes and active-tab "reset to main view" behavior.
11. Add tab to global import lock key routing if it has lockable AH fields.
12. Add tab to "Everything" logic aggregation and section ordering.
13. Add tab to ingredient search data/getters.
14. Add tab to export generation if it should be included.
15. Preserve existing export section contracts unless intentionally changed (for example: keep `1.0 ALL BAGS` separate from `2.0 ALL TAILORING`).
16. Add tab storage keys to constants and storage bootstrap reads.
17. Add docs updates (`README.md`, `docs/ARCHITECTURE.md`, any tab-specific policy docs).

## Release verification checklist (must pass)

1. Import sample Auctionator data; verify all affected rows update.
2. Edit one shared item; verify cross-tab sync.
3. Open each tab and one detail view; re-click active tab to return to overview.
4. Verify sort toggles, profit columns, and no blank/NaN outputs.
5. Verify TSM daily/avg edits persist after reload.
6. Verify ingredient search + routing.
7. Verify export text generation and copy flow.
8. Verify locks protect values during import.
9. Reload page; verify selected tab/recipe and values persist.

## Checklist maintenance rule (important)

When implementation misses a step and causes a bug:

1. Fix the bug.
2. Identify the missing checklist step that would have prevented it.
3. Add that step to this file in the correct section.
4. Note the change in release notes/docs update.
5. Add a short entry in `docs/DEV_LOG.md` even if the fix was not a tracked TODO item.

Do not treat checklist updates as optional cleanup. Missing-step discoveries should always improve this runbook.
