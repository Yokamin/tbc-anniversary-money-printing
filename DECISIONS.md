# TBC Crafting Calculator — Design Decisions & Conventions

> **Standing note:** These conventions should be revisited whenever the project grows significantly or a rule starts feeling wrong. Ask yourself: "does this still make sense?" before blindly following an old note.

---

## Auctionator Buy-List Export

### Format
Each list is one line: `<list-name>^"item1"^"item2"^...`
Generated in-app via the **Transmutes / Dailies** tab → Auctionator Export panel.

### Numbering scheme
The number prefix controls alphabetical sort order in Auctionator (where lists are sorted as strings):

| Prefix | Tab / Category |
|--------|---------------|
| `0.0`  | **Everything** — all AH items from all tabs, deduplicated (sorts first in Auctionator) |
| `1.x`  | Bags |
| `2.x`  | Tailoring Gear |
| `3.x`  | Alchemy (elixirs, potions, flasks) |
| `4.x`  | Transmutes / Dailies |
| `5.x`  | Cooking |

Sub-numbers within each category:
- `.0` = category-wide ALL list (sorts first within the category)
- `.1`, `.2`, `.3` = subcategory ALLs and individual items
  - e.g. `3.1` = ALL ELIXIRS + individual elixirs; `3.2` = ALL POTIONS + individual potions; `3.3` = ALL FLASKS + individual flasks

Individual items within a subcategory share the same `.N` prefix as their subcategory ALL.
`ALL` sorts before individual items because "ALL..." (starting A-L-L) comes before "Elixir...", "Potion...", "Flask...", "Transmute..." etc. alphabetically.

Exception: Tailoring individual items use `2.1` (not `2.0`) to guarantee `2.0 ALL TAILORING` sorts first regardless of item names.

### What is included in each list
- **Individual recipe list**: product name + all AH-searchable ingredients + mote alternatives for primals + craft-chain sub-ingredients (one level deep for bolts)
- **Category ALL list**: union of all individual lists in that category (deduplicated)
- **`1.0 ALL BAGS`**: hardcoded from `BAGS_EXPORT_ITEMS` constant (bag crafting has no recipe array)
- **`2.1 ALL PRIMAL NETHER`**: ingredients from all recipes that require a Primal Nether (BOP), so you can scan prices and decide which Primal Nether recipe is most profitable

### What is EXCLUDED from lists
- **Vendor items** (e.g. Imbued Vial, Rune Thread) — can't be searched on AH
- **BOP items** (Primal Nether) — can't be bought/sold on AH; their "cost" is implicit in the "Profit per BOP" metric shown in-app
- **Products sold by vendors** — same reason

### Individual item naming in Auctionator
To ensure subcategory `ALL` always sorts before individual items, items use a category prefix in their list name:
- Elixirs: `3.1 Elixir of Major Agility` (already starts with "Elixir"), `3.1 Elixir - Adept's Elixir`
- Potions: `3.2 Potion - Super Mana Potion`
- Flasks: `3.3 Flask of Blinding Light` (already starts with "Flask"), `3.3 Flask - SomeName`
- Transmutes: `4.2 Transmute - Primal Might`
- Cloth dailies: `4.3 Cloth - Spellcloth`
- Tailoring gear: `2.1 Bracers of Havok` (plain name, "ALL" sorts before any letter anyway)

---

## Tab Structure

| Tab | Contents |
|-----|----------|
| **Everything** | Default first tab. Combined profit overview of all craftable items across all tabs. |
| Bags | Static crafting tree for Netherweave bags. Hardcoded HTML + JS (`calculate()`) |
| Tailoring Gear | Dynamic UI from `GEAR_RECIPES` array |
| Alchemy | Dynamic UI from `ALCHEMY_RECIPES` array — elixirs, potions, flasks ONLY |
| Transmutes / Dailies | Mote→Primal profit table, Planar Essence, alchemy transmutes, tailoring cloth dailies |

### Why transmutes are NOT in the Alchemy tab
Transmutes (Primal Might, Skyfire Diamond, Earthstorm Diamond) and cloth dailies (Primal Mooncloth, Shadowcloth, Spellcloth) are all cooldown-based. They live in the Transmutes/Dailies tab to keep Alchemy clean and because they conceptually belong to the "primal economy" view, not the "herb/potion crafting" view.

### Why cloth dailies are in Transmutes (not Tailoring Gear)
Cloth dailies have a 3d 20h cooldown and consume primals. They're checked/updated on a cooldown timer, not on a per-craft basis. The Tailoring Gear tab is for on-demand gear crafting. The Transmutes tab groups all cooldown-gated crafting together.

---

## BOP Items (Primal Nether)

Primal Nether is Bind on Pickup — it cannot be bought or sold on the AH. In the app it shows as an amber "BOP" label with zero cost. The recipe's "Profit per Primal Nether" metric tells you how much value you get from spending one Primal Nether. Not searched in Auctionator lists.

---

## Shared Price Sync

Items that appear across multiple tabs are synced via `SHARED_PRICE_GROUPS` in the JS. When one input is updated, the others auto-update. Key synced items: Netherweave Cloth, Arcane Dust, Bolts of Netherweave, Motes of Fire/Earth (still in Alchemy for Elixir of Firepower and Ironshield Potion), Mote/Primal of Mana/Shadow/Fire/Earth between Gear and Transmutes tabs.

---

## Price Staleness Tracking

Each AH price input shows a colored dot indicating how recently that price was imported via "Update Prices". Dots are keyed by **item name** (not inputId) so items shared across tabs (e.g. Arcane Dust in Bags, Gear, TX) all reflect the same timestamp.

Color thresholds: Blue = most recent import batch → Green < 5 min → Yellow 5–30 min → Orange 30–60 min → Red > 1 hr → Grey = never imported.

Only `globalImportPrices()` updates timestamps. Manual field edits do not.

Locked items retain their last-imported timestamp; since imports skip locked prices, the timestamp stops updating when the lock is applied — the dot will age normally and turn red/orange over time.

**Netherweave Cloth soft-lock**: Netherweave Cloth is exempt from staleness tracking entirely — no dot is shown, and it is never counted when computing worst-staleness for profit overview rows. Rationale: the price is always locked at ~15s (manual floor price) and importing it would mislead the staleness indicator. It behaves like a vendor item for staleness purposes only.

Profit overview rows show the **worst** (oldest) staleness color across all AH ingredients and the product sale price. Vendor items and BOP items are excluded from this calculation.

---

## Profit Overview Table Columns

All 4 profit overview tables (Alchemy, Gear, TX, Cooking) share the same column set:
- **Recipe / Item** — with staleness dot
- **Craft Cost / Cost** — total ingredient cost
- **Sale Price / Revenue** — after AH cut
- **Profit** — colored green/red
- **Margin** — profit % of craft cost; shows `—` when craft cost ≤ 0
- **Daily Sold** — TSM note, free-text, persisted per recipe to localStorage
- **Avg Price** — TSM note, free-text, persisted per recipe to localStorage

### Sort Toggle
Each profit overview has Gold / % Margin sort buttons. Clicking switches sort order for that tab only. Sort state is in-memory only (resets to Gold on page reload — intentional, as gold profit is the primary decision metric).

### TSM Note Columns (Daily Sold / Avg Price)
`type="number"` inputs (Daily Sold: 0–9999, Avg Price: gold). Have no `id` attribute so they never trigger the recalculate event handlers. Save on every keystroke to `tbc_alch_tsm` / `tbc_gear_tsm` / `tbc_tx_tsm` / `tbc_cook_tsm` in localStorage. Pre-populated from localStorage on every calculate() call. A focused-input guard prevents tbody rebuild while a TSM input is active (avoids cursor-jump during typing).

Avg Price shows a live g/s/c colour preview to the right of the input. Both fields show a "last updated" age indicator (e.g. "3d ago") to the right; timestamps stored per-field as `dailyTs` / `avgPriceTs` alongside the value in the TSM localStorage object.

---

## Recipe Dropdown Back Button

All tabs with a recipe dropdown ("All / specific recipe" selector) include a "← All" button that appears only when a specific recipe is selected. It returns to the profit overview without opening the dropdown. The button is hidden in the "All" state.

---

## AH Cut

Default: **5%**. This is the standard faction AH fee in TBC. Adjustable per-tab in case it ever needs to change. Applies to all sell-price revenue calculations.

---

## Recipe Data Format

### ALCHEMY_RECIPES ingredient types
- `type: 'ah'` → bought on AH; generates price input
- `type: 'vendor'` → vendor price input; excluded from Auctionator lists
- `type: 'bop'` → BOP; no cost, shows "Profit per BOP" metric

### TRANSMUTE_RECIPES ingredient types
- `type: 'primal'` → primal ingredient with buy vs mote-craft comparison; `primalId` references TX_PRIMALS
- `type: 'gem'` → gem bought on AH

### CLOTH_DAILIES ingredient types
- `type: 'imbued_bolt'` → Bolt of Imbued NW with full craft chain (buy vs craft from 3× Bolt of NW, each craftable from 6× Cloth + 2× Dust)
- `type: 'primal'` → same as in TRANSMUTE_RECIPES

### GEAR_RECIPES ingredient types
- `type: 'ah'` → AH item; may have `craftFrom: { item, qty }` (mote alt) or `craftFrom: { mats: [...] }` (full craft chain)
- `type: 'vendor'` → vendor price
- `type: 'bop'` → BOP item

---

## Bags Tab: Best Use of Netherweave Cloth

The card formerly called "Bandage Vendor Alternative" is now **"Best Use: Netherweave Cloth"**. It shows **profit per cloth** for all 6 uses of Netherweave Cloth:

| Option | Formula |
|--------|---------|
| Vendor (bandage) | `0.15 − cloth` (2 cloth → 30s fixed) |
| Sell raw cloth | `cloth × (1 − AH%) − cloth` (always ≈ −AH fee) |
| Bolt of NW | `(boltAH × (1 − AH%)) / 6 − cloth` |
| Bolt of Imbued NW | `(imbuedBoltAH × (1 − AH%) − 2×Dust) / 18 − cloth` |
| NW Bag | `(bagSale × (1 − AH%) − Thread) / 24 − cloth` |
| Imbued Bag | `(bagSale × (1 − AH%) − Dust×8 − Silk×2 − greaterBest) / 72 − cloth` |

The metric is consistent: "if you buy cloth at market price and convert it using each method, how much profit do you make per cloth?" Non-cloth material costs are deducted from revenue before dividing by cloth count. Verdict sorts all 6 and highlights the winner.

NW Bag and Imbued Bag profit rows also show a Margin % (profit / optimal cost).

---

## Everything Tab

The Everything tab is the default landing tab. It provides a combined profit overview of all craftable items across all tabs in one place, without switching between tabs.

### Views
- **Flat List** — all items sorted together by profit or margin
- **By Section** — items grouped by tab with section headers, same sort within each section

### Data flow
Each per-tab `calculate()` function populates a global result array after its own rendering:
- `bagsResults` — populated at end of `calculate()` (Bags tab)
- `gearResults` — populated at end of `gearCalculate()`
- `alchResults` — already existed; read directly
- `txSummaryRows` — `txCalculate()` assigns `txSummaryRows = []; var summaryRows = txSummaryRows;` so all existing `.push()` calls populate the global
- `cookResults` — populated at end of `cookCalculate()`

`evCalculate()` reads these globals directly — no tight coupling back to each tab.

### Filter popup
3-level checkbox tree: tab → category → individual recipe. Stored in `tbc_ev_hidden` as `{tab_X: true, cat_X: true, item_X: true}`. An item is visible only if none of its parent chain is hidden. State persists across reloads.

### TSM columns (read-only)
Daily Sold / Avg Price shown in the Everything table pull from the per-tab TSM localStorage keys (`tbc_alch_tsm`, `tbc_gear_tsm`, etc.) — same data as the editable columns in each tab, displayed read-only here.

### Sort state
Stored in `tbc_ev_sort` (gold/margin). View state stored in `tbc_ev_view`. Both persist across reloads.

---

## Ingredient Search

Global toolbar "🔍 Ingredients" button opens a floating modal. Type any ingredient name to live-search across all recipes in all tabs.

### Index structure
`ingSearchIndex` is built lazily on first open (to avoid startup cost):
```
ingSearchIndex[itemName.toLowerCase()] = {
    displayName: string,
    recipes: [{ recipeId, recipeName, tab, tabLabel, qty, viaItem? }]
}
```
Covers ALCHEMY_RECIPES, GEAR_RECIPES, COOKING_RECIPES, TRANSMUTE_RECIPES, CLOTH_DAILIES, and hardcoded Bags ingredients.

### Navigation
`ingGotoRecipe(tab, recipeId)` switches to the correct tab and calls the tab-specific select function (`alchSelectRecipe`, `gearSelectRecipe`, `txSelectRecipe`, `cookSelectRecipe`). Bags tab navigates to `tab-bags` only (no per-recipe selector).

---

## Alchemy Batch Proc Toggle

The Alchemy profit overview has a ×1 / ×100 / ×1000 toggle in the header. Setting persists to `tbc_alch_batch`.

### Math
- **×1**: columns show per-craft Cost, Sale Price, Profit (unchanged from before)
- **×N (N > 1)**: `Total Cost = craftCost × N`; `Total Revenue = salePrice × (1 − AHcut) × N × (1 + procRate/100)` for non-transmutes; transmutes excluded from proc bonus (proc multiplier = 1)
- `Total Profit = Total Revenue − Total Cost`
- Margin % reflects procs in batch mode
- Sorting in batch mode uses `_batchProfit` / `_batchCost` temp properties (not stored permanently on result objects)

### Transmute exclusion
Transmutes have no proc mechanic. When batch mode is active, transmute rows are scaled by N but receive no proc multiplier.

---

## Alchemy Inline Proc Card

When viewing a specific recipe detail in the Alchemy tab (non-transmute only), a "Proc Calculator" card is rendered below the ingredient breakdown. It mirrors the modal proc calculator but is always visible — no need to open a popup.

The shared `renderProcResultsHTML(crafts, procRate, craftCost, revenuePerUnit)` helper generates the breakdown HTML for both the popup modal and the inline card, keeping the math consistent.

---

## Manage Recipes Modal (Alchemy)

The manage-recipes modal uses a wider layout with:
- Purple category header rows (`recipe-manage-cat`) with All / None quick-select buttons per category
- Items indented 30px under their category
- Scrollable inner body (`recipe-manage-scroll`) with fixed modal height, so long lists don't overflow the viewport
- × close button in the header (alongside the title)

`toggleManageCat(categoryStr, doHide)` handles the All/None per-category buttons, toggling all recipes in those categories at once and updating checkboxes live.

---

## Spellcloth Yield

The user is specced for Spellcloth, which yields **2x** per craft (1 craft = 2 Spellcloth). `yieldQty: 2` in the CLOTH_DAILIES data. Revenue is calculated as `salePrice × yieldQty × (1 - AH cut)`.
