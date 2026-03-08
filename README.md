# TBC Crafting Calculator

## Version: 1.2

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
  - Elixirs: Healing Power, Major Agility, Major Shadow Power, Major Defense, Major Mageblood, Adept's Elixir, Mastery, Major Fortitude, Major Strength, Onslaught, Major Firepower
  - Potions: Volatile Healing, Super Mana, Haste, Destruction, Ironshield, Heroic, Insane Strength, Super Rejuvenation
  - Flasks: Fortification, Mighty Restoration, Relentless Assault, Pure Death, Blinding Light
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

- AH price import: paste Auctionator export data to bulk-update prices
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

### Auctionator Buy-List Export

The Transmutes / Dailies tab includes an in-app export generator. Click "Generate Lists" to produce a full set of Auctionator-formatted buy lists covering all tabs. Lists are numbered for consistent in-game sort order:

| Prefix | Category |
|--------|----------|
| `1.x`  | Bags |
| `2.x`  | Tailoring Gear |
| `3.x`  | Alchemy (3.1=Elixirs, 3.2=Potions, 3.3=Flasks) |
| `4.x`  | Transmutes/Dailies (4.1=Mote→Primals, 4.2=Transmutes, 4.3=Cloth) |

See `DECISIONS.md` for full naming conventions and design rationale.
