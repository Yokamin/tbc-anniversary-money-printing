(function(global) {
    "use strict";
    global.ALCHEMY_RECIPES = [
            // === Elixirs ===
            {
                id: 'elixir_healing_power',
                name: 'Elixir of Healing Power',
                category: 'elixir',
                ingredients: [
                    { item: 'Golden Sansam', qty: 1, type: 'ah' },
                    { item: 'Dreaming Glory', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_major_agility',
                name: 'Elixir of Major Agility',
                category: 'elixir',
                ingredients: [
                    { item: 'Felweed', qty: 2, type: 'ah' },
                    { item: 'Terocone', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_major_shadow_power',
                name: 'Elixir of Major Shadow Power',
                category: 'elixir',
                ingredients: [
                    { item: 'Ancient Lichen', qty: 1, type: 'ah' },
                    { item: 'Nightmare Vine', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_major_defense',
                name: 'Elixir of Major Defense',
                category: 'elixir',
                ingredients: [
                    { item: 'Ancient Lichen', qty: 3, type: 'ah' },
                    { item: 'Terocone', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_major_mageblood',
                name: 'Elixir of Major Mageblood',
                category: 'elixir',
                ingredients: [
                    { item: 'Ancient Lichen', qty: 1, type: 'ah' },
                    { item: 'Netherbloom', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'adepts_elixir',
                name: "Adept's Elixir",
                category: 'elixir',
                ingredients: [
                    { item: 'Dreamfoil', qty: 1, type: 'ah' },
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_of_mastery',
                name: 'Elixir of Mastery',
                category: 'elixir',
                ingredients: [
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Terocone', qty: 3, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_major_fortitude',
                name: 'Elixir of Major Fortitude',
                category: 'elixir',
                ingredients: [
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Ragveil', qty: 2, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_major_strength',
                name: 'Elixir of Major Strength',
                category: 'elixir',
                ingredients: [
                    { item: 'Mountain Silversage', qty: 1, type: 'ah' },
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_onslaught',
                name: 'Onslaught Elixir',
                category: 'elixir',
                ingredients: [
                    { item: 'Mountain Silversage', qty: 1, type: 'ah' },
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            // === Potions ===
            {
                id: 'volatile_healing_potion',
                name: 'Volatile Healing Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Golden Sansam', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'super_mana_potion',
                name: 'Super Mana Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Dreaming Glory', qty: 2, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'unstable_mana_potion',
                name: 'Unstable Mana Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Ragveil', qty: 2, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'haste_potion',
                name: 'Haste Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Terocone', qty: 2, type: 'ah' },
                    { item: 'Netherbloom', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'destruction_potion',
                name: 'Destruction Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Nightmare Vine', qty: 2, type: 'ah' },
                    { item: 'Netherbloom', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'ironshield_potion',
                name: 'Ironshield Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Ancient Lichen', qty: 2, type: 'ah' },
                    { item: 'Mote of Earth', qty: 3, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'heroic_potion',
                name: 'Heroic Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Terocone', qty: 2, type: 'ah' },
                    { item: 'Ancient Lichen', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'insane_strength_potion',
                name: 'Insane Strength Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Terocone', qty: 3, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'super_rejuvenation_potion',
                name: 'Super Rejuvenation Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Netherbloom', qty: 1, type: 'ah' },
                    { item: 'Mana Thistle', qty: 2, type: 'ah' },
                    { item: 'Dreaming Glory', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'fel_mana_potion',
                name: 'Fel Mana Potion',
                category: 'potion',
                ingredients: [
                    { item: 'Mana Thistle', qty: 1, type: 'ah' },
                    { item: 'Nightmare Vine', qty: 2, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'mad_alchemists_potion',
                name: "Mad Alchemist's Potion",
                category: 'potion',
                ingredients: [
                    { item: 'Ragveil', qty: 2, type: 'ah' },
                    { item: 'Crystal Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_major_firepower',
                name: 'Elixir of Major Firepower',
                category: 'elixir',
                ingredients: [
                    { item: 'Mote of Fire', qty: 2, type: 'ah' },
                    { item: 'Ancient Lichen', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'gift_of_arthas',
                name: 'Gift of Arthas',
                category: 'elixir',
                ingredients: [
                    { item: "Arthas' Tears", qty: 1, type: 'ah' },
                    { item: 'Blindweed', qty: 1, type: 'ah' },
                    { item: 'Crystal Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_demonslaying',
                name: 'Elixir of Demonslaying',
                category: 'elixir',
                ingredients: [
                    { item: 'Gromsblood', qty: 1, type: 'ah' },
                    { item: 'Ghost Mushroom', qty: 1, type: 'ah' },
                    { item: 'Crystal Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'elixir_draenic_wisdom',
                name: 'Elixir of Draenic Wisdom',
                category: 'elixir',
                ingredients: [
                    { item: 'Felweed', qty: 1, type: 'ah' },
                    { item: 'Terocone', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'greater_arcane_elixir',
                name: 'Greater Arcane Elixir',
                category: 'elixir',
                ingredients: [
                    { item: 'Dreamfoil', qty: 3, type: 'ah' },
                    { item: 'Mountain Silversage', qty: 1, type: 'ah' },
                    { item: 'Crystal Vial', qty: 1, type: 'vendor' },
                ]
            },
            // === Flasks ===
            {
                id: 'flask_fortification',
                name: 'Flask of Fortification',
                category: 'flask',
                ingredients: [
                    { item: 'Fel Lotus', qty: 1, type: 'ah' },
                    { item: 'Mana Thistle', qty: 3, type: 'ah' },
                    { item: 'Ancient Lichen', qty: 7, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'flask_mighty_restoration',
                name: 'Flask of Mighty Restoration',
                category: 'flask',
                ingredients: [
                    { item: 'Fel Lotus', qty: 1, type: 'ah' },
                    { item: 'Mana Thistle', qty: 3, type: 'ah' },
                    { item: 'Dreaming Glory', qty: 7, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'flask_relentless_assault',
                name: 'Flask of Relentless Assault',
                category: 'flask',
                ingredients: [
                    { item: 'Fel Lotus', qty: 1, type: 'ah' },
                    { item: 'Terocone', qty: 7, type: 'ah' },
                    { item: 'Mana Thistle', qty: 3, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'flask_pure_death',
                name: 'Flask of Pure Death',
                category: 'flask',
                ingredients: [
                    { item: 'Fel Lotus', qty: 1, type: 'ah' },
                    { item: 'Mana Thistle', qty: 3, type: 'ah' },
                    { item: 'Nightmare Vine', qty: 7, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'flask_blinding_light',
                name: 'Flask of Blinding Light',
                category: 'flask',
                ingredients: [
                    { item: 'Fel Lotus', qty: 1, type: 'ah' },
                    { item: 'Mana Thistle', qty: 3, type: 'ah' },
                    { item: 'Netherbloom', qty: 7, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'flask_distilled_wisdom',
                name: 'Flask of Distilled Wisdom',
                category: 'flask',
                ingredients: [
                    { item: 'Dreamfoil', qty: 7, type: 'ah' },
                    { item: 'Icecap', qty: 3, type: 'ah' },
                    { item: 'Black Lotus', qty: 1, type: 'ah' },
                    { item: 'Crystal Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'flask_supreme_power',
                name: 'Flask of Supreme Power',
                category: 'flask',
                ingredients: [
                    { item: 'Dreamfoil', qty: 7, type: 'ah' },
                    { item: 'Mountain Silversage', qty: 3, type: 'ah' },
                    { item: 'Black Lotus', qty: 1, type: 'ah' },
                    { item: 'Crystal Vial', qty: 1, type: 'vendor' },
                ]
            },
        ];
})(window);
