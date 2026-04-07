(function(global) {
    "use strict";
    global.LW_RECIPES = [
            {
                id: 'cobrahide_leg_armor',
                name: 'Cobrahide Leg Armor',
                category: 'leg_armor',
                ingredients: [
                    {
                        item: 'Heavy Knothide Leather',
                        qty: 4,
                        type: 'ah',
                        craftFrom: {
                            mats: [
                                {
                                    item: 'Knothide Leather',
                                    qty: 5,
                                    type: 'ah',
                                    craftFrom: {
                                        mats: [
                                            { item: 'Knothide Leather Scraps', qty: 5, type: 'ah' },
                                        ]
                                    }
                                },
                            ]
                        }
                    },
                    { item: 'Cobra Scales', qty: 2, type: 'ah' },
                    { item: 'Primal Air', qty: 4, type: 'ah', craftFrom: { item: 'Mote of Air', qty: 10 } },
                ]
            },
        ];
})(window);
