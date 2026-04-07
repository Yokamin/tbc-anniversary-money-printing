(function(global) {
    "use strict";
    global.ENCHANTING_RECIPES = [
            {
                id: 'large_prismatic_shard',
                name: 'Large Prismatic Shard',
                category: 'shard',
                ingredients: [
                    { item: 'Small Prismatic Shard', qty: 3, type: 'ah' }
                ]
            },
            {
                id: 'superior_mana_oil',
                name: 'Superior Mana Oil',
                category: 'oil',
                ingredients: [
                    { item: 'Netherbloom', qty: 1, type: 'ah' },
                    { item: 'Arcane Dust', qty: 3, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
            {
                id: 'superior_wizard_oil',
                name: 'Superior Wizard Oil',
                category: 'oil',
                ingredients: [
                    { item: 'Arcane Dust', qty: 3, type: 'ah' },
                    { item: 'Nightmare Vine', qty: 1, type: 'ah' },
                    { item: 'Imbued Vial', qty: 1, type: 'vendor' },
                ]
            },
        ];
})(window);
