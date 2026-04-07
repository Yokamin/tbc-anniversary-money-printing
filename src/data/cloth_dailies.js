(function(global) {
    "use strict";
    global.CLOTH_DAILIES = [
            {
                id: 'primal_mooncloth',
                name: 'Primal Mooncloth',
                cooldown: '3d 20h',
                yieldQty: 1,
                ingredients: [
                    { item: 'Bolt of Imbued Netherweave', qty: 1, type: 'imbued_bolt' },
                    { item: 'Primal Water', qty: 1, type: 'primal', primalId: 'water' },
                    { item: 'Primal Life',  qty: 1, type: 'primal', primalId: 'life'  },
                ]
            },
            {
                id: 'shadowcloth',
                name: 'Shadowcloth',
                cooldown: '3d 20h',
                yieldQty: 1,
                ingredients: [
                    { item: 'Bolt of Imbued Netherweave', qty: 1, type: 'imbued_bolt' },
                    { item: 'Primal Fire',   qty: 1, type: 'primal', primalId: 'fire'   },
                    { item: 'Primal Shadow', qty: 1, type: 'primal', primalId: 'shadow' },
                ]
            },
            {
                id: 'spellcloth',
                name: 'Spellcloth',
                cooldown: '3d 20h',
                yieldQty: 2, // specced — yields 2x per craft
                ingredients: [
                    { item: 'Bolt of Imbued Netherweave', qty: 1, type: 'imbued_bolt' },
                    { item: 'Primal Fire', qty: 1, type: 'primal', primalId: 'fire' },
                    { item: 'Primal Mana', qty: 1, type: 'primal', primalId: 'mana' },
                ]
            },
        ];
})(window);
