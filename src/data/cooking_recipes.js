(function(global) {
    "use strict";
    global.COOKING_RECIPES = [
            // === +30 Stamina ===
            {
                id: 'spicy_crawdad',
                name: 'Spicy Crawdad',
                category: 'stamina',
                ingredients: [
                    { item: 'Furious Crawdad', qty: 1, type: 'ah' },
                ]
            },
            // === +20 Agility ===
            {
                id: 'warp_burger',
                name: 'Warp Burger',
                category: 'agility',
                ingredients: [
                    { item: 'Warped Flesh', qty: 1, type: 'ah' },
                ]
            },
            {
                id: 'grilled_mudfish',
                name: 'Grilled Mudfish',
                category: 'agility',
                ingredients: [
                    { item: "Figluster's Mudfish", qty: 1, type: 'ah' },
                ]
            },
            // === +20 Strength ===
            {
                id: 'roasted_clefthoof',
                name: 'Roasted Clefthoof',
                category: 'strength',
                ingredients: [
                    { item: 'Clefthoof Meat', qty: 1, type: 'ah' },
                ]
            },
            {
                id: 'smoked_desert_dumplings',
                name: 'Smoked Desert Dumplings',
                category: 'strength',
                ingredients: [
                    { item: 'Sandworm Meat', qty: 1, type: 'ah' },
                    { item: 'Soothing Spices', qty: 1, type: 'vendor' },
                ]
            },
            // === +20 Hit Rating ===
            {
                id: 'spicy_hot_talbuk',
                name: 'Spicy Hot Talbuk',
                category: 'hit',
                ingredients: [
                    { item: 'Talbuk Venison', qty: 1, type: 'ah' },
                    { item: 'Hot Spices', qty: 1, type: 'vendor' },
                ]
            },
            // === +23 Spell Power ===
            {
                id: 'blackened_basilisk',
                name: 'Blackened Basilisk',
                category: 'spellpower',
                ingredients: [
                    { item: "Chunk o' Basilisk", qty: 1, type: 'ah' },
                ]
            },
            {
                id: 'crunchy_serpent',
                name: 'Crunchy Serpent',
                category: 'spellpower',
                ingredients: [
                    { item: 'Serpent Flesh', qty: 1, type: 'ah' },
                ]
            },
            {
                id: 'poached_bluefish',
                name: 'Poached Bluefish',
                category: 'spellpower',
                ingredients: [
                    { item: 'Icefin Bluefish', qty: 1, type: 'ah' },
                ]
            },
            // === +44 Heal Power / +22 Spell / +6 Spirit ===
            {
                id: 'golden_fish_sticks',
                name: 'Golden Fish Sticks',
                category: 'healspirit',
                ingredients: [
                    { item: 'Golden Darter', qty: 1, type: 'ah' },
                ]
            },
            // === +20 Spell Crit ===
            {
                id: 'skullfish_soup',
                name: 'Skullfish Soup',
                category: 'spellcrit',
                ingredients: [
                    { item: 'Crescent-Tail Skullfish', qty: 1, type: 'ah' },
                ]
            },
        ];
})(window);
