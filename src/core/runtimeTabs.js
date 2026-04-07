(function(global) {
    "use strict";

    function registerDefaultTabs(registry, hooks) {
        registry.register({ id: "alchemy", init: hooks.alchInit, load: hooks.alchLoadFromStorage, calc: hooks.alchCalculate, includeInCoreRecalc: true });
        registry.register({ id: "gear", init: hooks.gearInit, load: hooks.gearLoadFromStorage, calc: hooks.gearCalculate, includeInCoreRecalc: true });
        registry.register({ id: "tx", init: hooks.txInit, load: hooks.txLoadFromStorage, calc: hooks.txCalculate, includeInCoreRecalc: true });
        registry.register({ id: "cook", init: hooks.cookInit, load: hooks.cookLoadFromStorage, calc: hooks.cookCalculate, includeInCoreRecalc: false });
        registry.register({ id: "ench", init: hooks.enchInit, load: hooks.enchLoadFromStorage, calc: hooks.enchCalculate, includeInCoreRecalc: false });
        registry.register({ id: "lw", init: hooks.lwInit, load: hooks.lwLoadFromStorage, calc: hooks.lwCalculate, includeInCoreRecalc: false });
    }

    function calculateCoreTabs(registry) {
        registry.calculateCore();
    }

    function calculateAllTabs(registry) {
        registry.calculateAll();
    }

    global.AppRuntimeTabs = {
        registerDefaultTabs: registerDefaultTabs,
        calculateCoreTabs: calculateCoreTabs,
        calculateAllTabs: calculateAllTabs
    };
})(window);

