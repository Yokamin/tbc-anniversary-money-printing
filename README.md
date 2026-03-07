# TBC Crafting Calculator

## Version: 1.1

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
- Full recursive craft chain breakdown per ingredient (e.g. Bolt of Imbued NW → Bolt of NW → Cloth)
- Buy vs craft comparison at every tier, auto-selects cheapest source
- BOP items (Primal Nether) show profit-per-BOP metric instead of cost
- AH import supports item level suffixes e.g. "(112)"

**Alchemy**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Elixirs: Healing Power, Major Agility, Major Shadow Power, Major Defense, Major Mageblood, Adept's Elixir, Mastery, Major Fortitude, Major Strength, Onslaught, Major Firepower
  - Potions: Volatile Healing, Super Mana, Haste, Destruction, Ironshield, Heroic, Insane Strength
  - Flasks: Fortification, Mighty Restoration, Relentless Assault, Pure Death, Blinding Light
  - Transmutes: Primal Might, Skyfire Diamond
- Dropdown to view individual recipe details or "All (Profit Overview)" summary table
- Summary table sorted by profit (best first)
- Primal ingredients auto-compare buy vs craft from 10x Motes
- Manage recipes modal: hide/show recipes you haven't unlocked

### Shared Features

- AH price import: paste Auctionator export data to bulk-update prices
- Lock buttons: prevent specific prices from being overwritten on import
- Silver nudge buttons (+/- 0.01g) next to each price input
- Gold/Silver/Copper display next to each price input
- AH cut percentage setting (default 5%)
- AH deposit tracking per product
- Collapsible sidebar panels
- All prices saved to localStorage (persist across reloads)
- Tab and recipe selection remembered across sessions
- Shared price sync: updating a material in one tab auto-updates it in all other tabs
  - Synced materials: Netherweave Cloth, Arcane Dust, Bolt of Netherweave, Bolt of Imbued Netherweave, Rune Thread, Primal Mana, Mote of Mana, Primal Shadow, Mote of Shadow, Primal Earth, Mote of Earth
