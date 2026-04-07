(function(global) {
    "use strict";
    global.TRANSMUTE_RECIPES = [
            {
                id: 'primal_might',
                name: 'Primal Might',
                product: 'Primal Might',
                cooldown: '1 day',
                ingredients: [
                    { item: 'Primal Fire',  qty: 1, type: 'primal', primalId: 'fire'  },
                    { item: 'Primal Water', qty: 1, type: 'primal', primalId: 'water' },
                    { item: 'Primal Earth', qty: 1, type: 'primal', primalId: 'earth' },
                    { item: 'Primal Air',   qty: 1, type: 'primal', primalId: 'air'   },
                    { item: 'Primal Mana',  qty: 1, type: 'primal', primalId: 'mana'  },
                ]
            },
            {
                id: 'skyfire_diamond',
                name: 'Skyfire Diamond',
                product: 'Skyfire Diamond',
                cooldown: '1 day',
                ingredients: [
                    { item: 'Azure Moonstone',  qty: 3, type: 'gem' },
                    { item: 'Flame Spessarite', qty: 3, type: 'gem' },
                    { item: 'Blood Garnet',     qty: 3, type: 'gem' },
                    { item: 'Primal Air',  qty: 2, type: 'primal', primalId: 'air'  },
                    { item: 'Primal Fire', qty: 2, type: 'primal', primalId: 'fire' },
                ]
            },
            {
                id: 'earthstorm_diamond',
                name: 'Earthstorm Diamond',
                product: 'Earthstorm Diamond',
                cooldown: '1 day',
                ingredients: [
                    { item: 'Golden Draenite', qty: 3, type: 'gem' },
                    { item: 'Shadow Draenite', qty: 3, type: 'gem' },
                    { item: 'Deep Peridot',    qty: 3, type: 'gem' },
                    { item: 'Primal Water', qty: 2, type: 'primal', primalId: 'water' },
                    { item: 'Primal Earth', qty: 2, type: 'primal', primalId: 'earth' },
                ]
            },
        ];
})(window);
