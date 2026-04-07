(function(global) {
    "use strict";

    function createTabRegistry() {
        var tabs = [];

        function register(def) {
            tabs.push(def);
        }

        function forEach(fnName) {
            tabs.forEach(function(tab) {
                if (typeof tab[fnName] === "function") tab[fnName]();
            });
        }

        function calculateCore() {
            tabs.forEach(function(tab) {
                if (tab.includeInCoreRecalc && typeof tab.calc === "function") tab.calc();
            });
        }

        function calculateAll() {
            forEach("calc");
        }

        return {
            register: register,
            initAll: function() { forEach("init"); },
            loadAll: function() { forEach("load"); },
            calculateCore: calculateCore,
            calculateAll: calculateAll
        };
    }

    global.AppTabRegistry = {
        create: createTabRegistry
    };
})(window);

