# TBC Crafting Calculator

## Version: 1.5

Single-page HTML app for calculating crafting profitability in WoW TBC Anniversary.

### Tabs

**Bags**
- Calculates craft vs buy decisions across a 3-tier crafting chain
- Tier 1: Bolt of Netherweave (6x Cloth), Greater Planar Essence (3x Lesser)
- Tier 2: Bolt of Imbued Netherweave (3x Bolt + 2x Arcane Dust)
- Final Products: Netherweave Bag, Imbued Netherweave Bag
- Smart sourcing: automatically picks cheapest option at each tier and cascades up

**Tailoring Gear**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Spellstrike Pants, Spellstrike Hood (Primal Might, Spellcloth, Primal Nether BOP)
  - Runic Spellthread (Rune Thread, Primal Mana, Primal Nether BOP)
  - Mystic Spellthread (Rune Thread, Primal Mana)
  - Bracers of Havok (Bolt of Imbued Netherweave, Primal Earth, Primal Shadow)
  - Cloak of the Black Void (Bolt of Imbued Netherweave, Primal Mana, Primal Shadow)
  - Girdle of Ruination (Shadowcloth, Primal Fire, Primal Nether BOP)
- Full recursive craft chain breakdown per ingredient (e.g. Bolt of Imbued NW → Bolt of NW → Cloth)
- Buy vs craft comparison at every tier, auto-selects cheapest source
- BOP items (Primal Nether) show profit-per-BOP metric instead of cost
- AH import supports item level suffixes e.g. "(112)"

**Alchemy**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Elixirs: Healing Power, Major Agility, Major Shadow Power, Major Defense, Major Mageblood, Adept's Elixir, Mastery, Major Fortitude, Major Strength, Onslaught, Major Firepower, Gift of Arthas, Elixir of Demonslaying, Elixir of Draenic Wisdom, Greater Arcane Elixir
  - Potions: Volatile Healing, Super Mana, Unstable Mana, Haste, Destruction, Ironshield, Heroic, Insane Strength, Super Rejuvenation, Fel Mana, Mad Alchemist's
  - Flasks: Fortification, Mighty Restoration, Relentless Assault, Pure Death, Blinding Light, Distilled Wisdom, Supreme Power
  - Misc / Enchanting: Brilliant Wizard Oil (craft-vs-buy comparison, crafted by Enchanter)
- Dropdown to view individual recipe details or "All (Profit Overview)" summary table
- Summary table sorted by profit (best first)
- Manage recipes modal: hide/show recipes you haven't unlocked

**Transmutes / Dailies**
- Mote → Primal profit table: all 7 primals (Air, Earth, Fire, Life, Mana, Shadow, Water)
  - Silver nudge buttons on mote prices
  - Shows cost (10× mote), revenue (primal sell − AH%), and profit per conversion
  - Sorted by profit descending
- Planar Essence conversion: 3× Lesser → 1× Greater profit view
- Alchemy transmutes (1-day cooldown):
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

- AH price import: paste Auctionator export data to bulk-update prices. **Reset** button clears the import field; **Reset** button on the export field clears the output.
- **Reset AH Prices** button (top-right of tab bar): zeroes all AH-imported prices across all tabs. Vendor prices (Imbued Vial, Rune Thread), deposit values, and AH cut % are preserved.
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
  - Synced: Netherweave Cloth, Arcane Dust, Bolt of Netherweave, Bolt of Imbued Netherweave, Rune Thread, Lesser/Greater Planar Essence, Mote/Primal of Fire, Earth, Mana, Shadow

**Cooking**
- Dynamically generated UI from recipe data array, same structure as Alchemy
- Recipes tracked by buff category:
  - +30 Stamina: Fisherman's Feast, Spicy Crawdad
  - +20 Agility: Warp Burger, Grilled Mudfish
  - +20 Strength: Roasted Clefthoof, Smoked Desert Dumplings ⚠ (worse option — see tooltip in profit overview)
  - +20 Hit Rating: Spicy Hot Talbuk
  - +23 Spell Power: Blackened Basilisk, Crunchy Serpent, Poached Bluefish
  - +44 Heal Power / +22 Spell / +6 Spirit: Golden Fish Sticks
  - +20 Spell Crit: Skullfish Soup
- Vendor items (Soothing Spices, Goldenbark Apple, Hot Spices) pre-filled with vendor prices

**Consumables** *(reference only — no price calculations)*
- Class/spec consumable cheat sheet for all 9 TBC classes
- Categories: Battle Elixir, Guardian Elixir, Flask, Food, Potion, Oil — colour-coded badges
- Primary consumables shown clearly; situational alternatives marked with **ALT** badge
- Notes shown inline (e.g. "Demons only", "400 Haste — when armour capped")
- WoWhead tooltip integration planned for a future update

### Auctionator Buy-List Export

The Transmutes / Dailies tab includes an in-app export generator. Click "Generate Lists" to produce a full set of Auctionator-formatted buy lists covering all tabs. Lists are numbered for consistent in-game sort order:

| Prefix | Category |
|--------|----------|
| `0.0`  | **Everything** — all AH items across all tabs, deduplicated |
| `1.x`  | Bags |
| `2.x`  | Tailoring Gear |
| `3.x`  | Alchemy (3.1=Elixirs, 3.2=Potions, 3.3=Flasks) |
| `4.x`  | Transmutes/Dailies (4.1=Mote→Primals, 4.2=Transmutes, 4.3=Cloth) |
| `5.x`  | Cooking |

See `DECISIONS.md` for full naming conventions and design rationale.
