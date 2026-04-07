# Smoke test checklist

Use this before pushing a stable patch release (`2.0.x`).

## Core flow checks

1. Import a known Auctionator sample and confirm prices populate expected rows.
2. Verify no blank/`NaN` values appear in profit tables after import.
3. Edit one shared item (example: `Arcane Dust`) and confirm sync across tabs.
4. Open a detail recipe in each calculator tab and click the active tab button to return to overview.
5. Confirm summary row hover + keyboard focus states are visible and consistent.
6. Generate Auctionator export and verify expected section prefixes are present.
7. Reload and confirm tab/recipe selection plus numeric inputs persist.

## Quick spot checks

- Toggle sort mode (`Gold` / `% Margin`) in multiple tabs.
- Edit one TSM note field (`Daily Sold` and `Avg Price`) and verify it persists.
- Use ingredient search and confirm "Go to recipe" still routes correctly.
