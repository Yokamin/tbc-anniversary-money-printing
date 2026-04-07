(function(global) {
    "use strict";
    global.GEAR_RECIPES = [
            {
                id: 'spellstrike_pants',
                name: 'Spellstrike Pants',
                category: 'epic',
                ingredients: [
                    { item: 'Primal Might', qty: 5, type: 'ah' },
                    { item: 'Spellcloth', qty: 10, type: 'ah' },
                    { item: 'Primal Nether', qty: 1, type: 'bop' }
                ]
            },
            {
                id: 'spellstrike_hood',
                name: 'Spellstrike Hood',
                category: 'epic',
                ingredients: [
                    { item: 'Primal Might', qty: 5, type: 'ah' },
                    { item: 'Spellcloth', qty: 10, type: 'ah' },
                    { item: 'Primal Nether', qty: 1, type: 'bop' }
                ]
            },
            {
                id: 'mystic_spellthread',
                name: 'Mystic Spellthread',
                category: 'rare',
                ingredients: [
                    { item: 'Rune Thread', qty: 1, type: 'vendor' },
                    { item: 'Primal Mana', qty: 5, type: 'ah', craftFrom: { item: 'Mote of Mana', qty: 10 } }
                ]
            },
            {
                id: 'runic_spellthread',
                name: 'Runic Spellthread',
                category: 'epic',
                ingredients: [
                    { item: 'Rune Thread', qty: 1, type: 'vendor' },
                    { item: 'Primal Mana', qty: 10, type: 'ah', craftFrom: { item: 'Mote of Mana', qty: 10 } },
                    { item: 'Primal Nether', qty: 1, type: 'bop' }
                ]
            },
            {
                id: 'girdle_of_ruination',
                name: 'Girdle of Ruination',
                category: 'epic',
                ingredients: [
                    { item: 'Shadowcloth', qty: 10, type: 'ah' },
                    { item: 'Primal Fire', qty: 16, type: 'ah', craftFrom: { item: 'Mote of Fire', qty: 10 } },
                    { item: 'Primal Nether', qty: 1, type: 'bop' }
                ]
            },
            {
                id: 'bracers_of_havok',
                name: 'Bracers of Havok',
                category: 'epic',
                ingredients: [
                    {
                        item: 'Bolt of Imbued Netherweave', qty: 4, type: 'ah',
                        craftFrom: { mats: [
                            {
                                item: 'Bolt of Netherweave', qty: 3, type: 'ah',
                                craftFrom: { mats: [
                                    { item: 'Netherweave Cloth', qty: 6, type: 'ah' }
                                ]}
                            },
                            { item: 'Arcane Dust', qty: 2, type: 'ah' }
                        ]}
                    },
                    { item: 'Primal Earth', qty: 4, type: 'ah', craftFrom: { item: 'Mote of Earth', qty: 10 } },
                    { item: 'Primal Shadow', qty: 4, type: 'ah', craftFrom: { item: 'Mote of Shadow', qty: 10 } }
                ]
            },
            {
                id: 'cloak_black_void',
                name: 'Cloak of the Black Void',
                category: 'epic',
                ingredients: [
                    {
                        item: 'Bolt of Imbued Netherweave', qty: 6, type: 'ah',
                        craftFrom: { mats: [
                            {
                                item: 'Bolt of Netherweave', qty: 3, type: 'ah',
                                craftFrom: { mats: [
                                    { item: 'Netherweave Cloth', qty: 6, type: 'ah' }
                                ]}
                            },
                            { item: 'Arcane Dust', qty: 2, type: 'ah' }
                        ]}
                    },
                    { item: 'Primal Mana', qty: 3, type: 'ah', craftFrom: { item: 'Mote of Mana', qty: 10 } },
                    { item: 'Primal Shadow', qty: 3, type: 'ah', craftFrom: { item: 'Mote of Shadow', qty: 10 } }
                ]
            }
        ];
})(window);
