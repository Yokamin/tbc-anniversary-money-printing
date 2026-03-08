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
| `1.x`  | Bags |
| `2.x`  | Tailoring Gear |
| `3.x`  | Alchemy (elixirs, potions, flasks) |
| `4.x`  | Transmutes / Dailies |

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

## Spellcloth Yield

The user is specced for Spellcloth, which yields **2x** per craft (1 craft = 2 Spellcloth). `yieldQty: 2` in the CLOTH_DAILIES data. Revenue is calculated as `salePrice × yieldQty × (1 - AH cut)`.
