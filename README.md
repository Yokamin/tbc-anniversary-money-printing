# TBC Crafting Calculator

## Version: 2.0.2

Single-page HTML app for calculating crafting profitability in WoW TBC Anniversary.

## Note on authorship and tooling

This project was made with AI-assisted tooling (started in Claude Code, now Cursor). I do not work in web stacks (HTML/CSS/JS) that much, so a lot of the code is AI-generated and then reviewed/tweaked until the result works the way I want.

## Project structure (current)

- **App shell**: `index.html`
- **Core modules**: `src/core/` (shared price store, tab registry, shared constants)
- **Tab modules**: `src/tabs/` (incremental tab-specific extraction, no build step)
- **UI polish layer**: `styles/main.css`
- **Design notes**: `DECISIONS.md`
- **Samples**: `export_example.txt` (example Auctionator buy-list export output)
- **Legacy / archived**: `legacy/` (old helpers and OS artifacts; see `legacy/README.md`)

## Development & deploy workflow

- **Source of truth**: `index.html` is edited directly.
- **Local testing**: open `index.html` in a browser and sanity-check calculations/import/export before pushing.
- **Deploy**: pushing to GitHub updates GitHub Pages (repo configured with `origin` at `git@github.com:Yokamin/tbc-anniversary-money-printing.git`).

If a future refactor reintroduces a build step, it should be documented in `DECISIONS.md` and reflected here.

## Versioning

- Versioning and stable release policy: `docs/VERSIONING.md`
- Patch smoke runbook: `docs/SMOKE_TEST_CHECKLIST.md`
- Current stable release line: `2.0.x`.
- Netherweave cloth handling policy: `docs/NETHERWEAVE_POLICY.md`

### Tabs

**Everything** *(default tab)*
- Combined profit overview of all craftable items across all tabs in one place
- Two views: **Flat List** (all items sorted together) or **By Section** (grouped by tab)
- Gold / % Margin sort toggle
- **Filter popup**: 3-level checkbox tree (tab → category → individual recipe) — hide anything you don't need; state persists across reloads
- Read-only Daily Sold / Avg Price columns pulled from per-tab TSM data

**Tailoring Gear**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Netherweave Bag, Imbued Netherweave Bag
  - Spellstrike Pants, Spellstrike Hood (Primal Might, Spellcloth, Primal Nether BOP)
  - Runic Spellthread (Rune Thread, Primal Mana, Primal Nether BOP)
  - Mystic Spellthread (Rune Thread, Primal Mana)
  - Bracers of Havok (Bolt of Imbued Netherweave, Primal Earth, Primal Shadow)
  - Cloak of the Black Void (Bolt of Imbued Netherweave, Primal Mana, Primal Shadow)
  - Girdle of Ruination (Shadowcloth, Primal Fire, Primal Nether BOP)
- Full recursive craft chain breakdown per ingredient (e.g. Bolt of Imbued NW -> Bolt of NW -> Cloth)
- Buy vs craft comparison at every tier, auto-selects cheapest source
- BOP items (Primal Nether) show profit-per-BOP metric instead of cost
- AH import supports item level suffixes e.g. "(112)"
- Historical bag economics (including cloth/buy-vs-craft logic) are now treated under Tailoring context.

**Alchemy**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Elixirs: Healing Power, Major Agility, Major Shadow Power, Major Defense, Major Mageblood, Adept's Elixir, Mastery, Major Fortitude, Major Strength, Onslaught, Major Firepower, Gift of Arthas, Elixir of Demonslaying, Elixir of Draenic Wisdom, Greater Arcane Elixir
  - Potions: Volatile Healing, Super Mana, Unstable Mana, Haste, Destruction, Ironshield, Heroic, Insane Strength, Super Rejuvenation, Fel Mana, Mad Alchemist's
  - Flasks: Fortification, Mighty Restoration, Relentless Assault, Pure Death, Blinding Light, Distilled Wisdom, Supreme Power
- Dropdown to view individual recipe details or "All (Profit Overview)" summary table
- **Batch toggle** (×1 / ×100 / ×1000): scales cost, revenue, and profit in the overview by batch size; non-transmute recipes include proc bonus yield at the configured proc rate; transmutes excluded from procs; margin % reflects procs
- **Proc Calculator**: "Proc" button per elixir/flask row opens a popup with crafts stepper, expected yield, and profit breakdown with vs without procs; also shown inline in individual recipe detail views
- Manage recipes modal: hide/show recipes you haven't unlocked — grouped by category with All/None quick-select per category
- Transmute cooldown: 20 hours (not 24)

**Transmutes / Dailies**
- Mote → Primal profit table: all 7 primals (Air, Earth, Fire, Life, Mana, Shadow, Water)
  - Silver nudge buttons on mote prices
  - Shows cost (10× mote), revenue (primal sell − AH%), and profit per conversion
  - Sorted by profit descending
- Planar Essence conversion: 3× Lesser → 1× Greater profit view
- Alchemy transmutes (20h cooldown):
  - Primal Might (all 5 primals)
  - Skyfire Diamond (gems + Primal Air/Fire)
  - Earthstorm Diamond (gems + Primal Water/Earth)
- Tailoring cloth dailies (3d 20h cooldown):
  - Primal Mooncloth (Bolt of Imbued NW + Primal Water + Primal Life)
  - Shadowcloth (Bolt of Imbued NW + Primal Fire + Primal Shadow)
  - Spellcloth (Bolt of Imbued NW + Primal Fire + Primal Mana) — yields 2× when specced
- All primal ingredients show buy vs 10× mote comparison
- Bolt of Imbued Netherweave shows full craft chain (buy vs craft from Bolt of NW → Cloth + Dust)
- **Auctionator Export**: generates formatted buy-list text for all tracked recipes, ready to import in-game

### Shared Features

- **🔍 Ingredients button** (global toolbar): search any ingredient name across all tabs — shows every recipe that uses it with tab badge, quantity, and profit; click a recipe to expand full ingredient list and a "Go to recipe" shortcut
- AH price import: paste Auctionator export data to bulk-update prices. **Reset** button clears the import field; **Reset** button on the export field clears the output.
- **Reset AH Prices** button (top-right of tab bar): zeroes all AH-imported prices across all tabs. Vendor prices (Imbued Vial, Rune Thread), deposit values, and AH cut % are preserved.
- **Wider layout**: no max-width constraint — uses full browser width
- **Profit % (Margin) column**: all profit overview tables show margin % alongside gold profit
- **Sort toggle**: each profit overview has Gold / % Margin sort buttons in the header
- **TSM notes columns**: "Daily Sold" (0–9999) and "Avg Price" (gold) editable per-recipe in all profit overview tables; Avg Price shows a live g/s/c colour preview; both fields show a "last updated" age indicator; persisted to localStorage per field with timestamp
- **Price staleness indicators**: colored dots next to every AH price input and in profit overview rows, showing how recently each price was imported:
  - 🔵 Blue — updated in the most recent import batch
  - 🟢 Green — < 5 min ago
  - 🟡 Yellow — 5–30 min ago
  - 🟠 Orange — 30–60 min ago
  - 🔴 Red — > 1 hr ago
  - ⚫ Grey — never imported
  - Profit overview rows show the **worst** staleness across all AH ingredients + sale price
  - Netherweave Cloth is exempt (always locked at a fixed price; excluded from staleness tracking)
  - Dots update on import and refresh automatically every 30 seconds
- **Back button** on recipe dropdowns: "← All" appears when viewing a specific recipe, returning to the profit overview without using the dropdown
- Lock buttons: prevent specific prices from being overwritten on import
- Silver nudge buttons (+/- 0.01g) next to mote price inputs
- Gold/Silver/Copper display next to each price input
- AH cut percentage setting (default 5%)
- AH deposit tracking per product
- Collapsible sidebar panels
- All prices saved to localStorage (persist across reloads)
- Tab and recipe selection remembered across sessions
- Shared price sync: updating a material in one tab auto-updates it in all other tabs
  - Synced: Netherweave Cloth, Arcane Dust (Gear/TX/Enchanting), Bolt of Netherweave, Bolt of Imbued Netherweave, Rune Thread, Lesser/Greater Planar Essence, Mote/Primal of Fire, Earth, Mana, Shadow

**Cooking**
- Dynamically generated UI from recipe data array, same structure as Alchemy
- Recipes tracked by buff category:
  - +30 Stamina: Spicy Crawdad
  - +20 Agility: Warp Burger, Grilled Mudfish
  - +20 Strength: Roasted Clefthoof, Smoked Desert Dumplings ⚠ (worse option — see tooltip in profit overview)
  - +20 Hit Rating: Spicy Hot Talbuk
  - +23 Spell Power: Blackened Basilisk, Crunchy Serpent, Poached Bluefish
  - +44 Heal Power / +22 Spell / +6 Spirit: Golden Fish Sticks
  - +20 Spell Crit: Skullfish Soup
- Vendor items (Soothing Spices, Goldenbark Apple, Hot Spices) pre-filled with vendor prices

**Enchanting**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Shards: Large Prismatic Shard (3× Small Prismatic Shard → 1× Large)
  - Oils: Superior Mana Oil (Netherbloom + Arcane Dust + Imbued Vial), Superior Wizard Oil (Arcane Dust + Nightmare Vine + Imbued Vial)
- Arcane Dust price syncs automatically with Tailoring Gear, Enchanting, and Transmutes tabs
- Full profit overview with Gold / % Margin sort, TSM note columns, staleness dots, back button

**Leatherworking**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Leg Armor: Cobrahide Leg Armor (4× Heavy Knothide Leather, 2× Cobra Scales, 4× Primal Air)
- Buy vs craft comparison per ingredient:
  - Heavy Knothide Leather: buy or craft from 5× Knothide Leather (auto-selects cheapest)
  - Primal Air: buy or use 10× Mote of Air (auto-selects cheapest)
- Full profit overview with TSM note columns, staleness dots, back button

**Consumables** *(reference only — no price calculations)*
- Class/spec consumable cheat sheet for all 9 TBC classes
- Categories: Battle Elixir, Guardian Elixir, Flask, Food, Potion, Oil — colour-coded badges
- Primary consumables shown clearly; situational alternatives marked with **ALT** badge
- Notes shown inline (e.g. "Demons only", "400 Haste — when armour capped")

### Auctionator Buy-List Export

The Transmutes / Dailies tab includes an in-app export generator. Click "Generate Lists" to produce a full set of Auctionator-formatted buy lists covering all tabs. Lists are numbered for consistent in-game sort order:

| Prefix | Category |
|--------|----------|
| `0.0`  | **Everything** — all AH items across all tabs, deduplicated |
| `1.x`  | Tailoring bags |
| `2.x`  | Tailoring Gear |
| `3.x`  | Alchemy (3.1=Elixirs, 3.2=Potions, 3.3=Flasks) |
| `4.x`  | Transmutes/Dailies (4.1=Mote→Primals, 4.2=Transmutes, 4.3=Cloth) |
| `5.x`  | Cooking |
| `6.x`  | Enchanting (6.1=Shards, 6.2=Oils) |
| `7.x`  | Leatherworking |

See `DECISIONS.md` for full naming conventions and design rationale.
