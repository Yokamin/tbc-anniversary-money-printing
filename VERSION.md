# TBC Crafting Calculator

## Version: 1.0

Single-page HTML app for calculating crafting profitability in WoW TBC.

### Tabs

**Tailoring**
- Calculates craft vs buy decisions across a 3-tier crafting chain
- Tier 1: Bolt of Netherweave (6x Cloth), Greater Planar Essence (3x Lesser)
- Tier 2: Bolt of Imbued Netherweave (3x Bolt + 2x Arcane Dust)
- Final Products: Netherweave Bag (4x Bolt + 1x Rune Thread), Imbued Netherweave Bag (4x Imbued Bolt + 2x Netherweb Spider Silk + 1x Greater Planar Essence)
- Each card shows craft cost, AH price, best source (craft vs buy), AH cut, and profit
- Smart sourcing: automatically picks cheapest option at each tier and cascades up

**Alchemy**
- Dynamically generated UI from recipe data array
- Recipes tracked:
  - Elixirs: Healing Power, Major Agility, Major Shadow Power, Major Defense, Major Mageblood, Adept's Elixir
  - Potions: Volatile Healing, Super Mana, Haste, Destruction, Ironshield, Heroic, Insane Strength
  - Flasks: Relentless Assault, Pure Death, Blinding Light
  - Transmutes: Primal Might, Skyfire Diamond
- Dropdown to view individual recipe details or "All (Profit Overview)" summary table
- Summary table sorted by profit (best first)
- Transmute materials (Primals/Motes) auto-compare buy vs craft from motes

### Shared Features

- AH price import: paste Auctionator export data to bulk-update prices
- Lock buttons: prevent specific prices from being overwritten on import
- Gold/Silver/Copper display next to each price input
- AH cut percentage setting (default 5%)
- AH deposit tracking per product
- All prices saved to localStorage (persist across reloads)
- Tab selection remembered across sessions
