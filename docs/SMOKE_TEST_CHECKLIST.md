# Smoke test checklist

Use this before pushing a stable release (patch or minor, for example `2.1.x`, `2.2.x`).

## Core flow checks

1. Import a known Auctionator sample and confirm prices populate expected rows.
2. Verify no blank/`NaN` values appear in profit tables after import.
3. Edit one shared item (example: `Arcane Dust`) and confirm sync across tabs.
4. Open a detail recipe in each calculator tab and click the active tab button to return to overview.
5. Confirm summary row hover + keyboard focus states are visible and consistent.
6. Generate Auctionator export and verify expected section prefixes are present.
7. Reload and confirm tab/recipe selection plus numeric inputs persist.
8. In one recipe detail per tab, set craft amount > 1 and verify ingredient totals/cost/profit scale correctly.
9. Trigger missing-default warning (set one vendor/deposit to 0) and verify overview warning icon + red detail banner.
10. Open **Compare export**, paste sample in-game text, click **Compare**, verify result panel + **Copy result**.
11. Use `Manual Snapshot` and verify output includes vendor/deposit/AH cut values.
12. Paste an in-game export into compare input and verify compare output reports missing/extra/duplicates.

## Quick spot checks

- Toggle sort mode (`Gold` / `% Margin`) in multiple tabs.
- Edit one TSM note field (`Daily Sold` and `Avg Price`) and verify it persists.
- Use ingredient search and confirm "Go to recipe" still routes correctly.
