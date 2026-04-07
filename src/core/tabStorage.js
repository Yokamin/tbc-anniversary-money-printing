(function(global) {
    "use strict";

    function createTabStorage() {
        function save(tabSelector, storageKey) {
            var data = {};
            document.querySelectorAll(tabSelector + " input").forEach(function(input) {
                if (input.id) data[input.id] = input.value;
            });
            localStorage.setItem(storageKey, JSON.stringify(data));
        }

        function load(tabSelector, storageKey, errorLabel) {
            var stored = localStorage.getItem(storageKey);
            if (!stored) return;
            try {
                var data = JSON.parse(stored);
                Object.keys(data).forEach(function(id) {
                    var input = document.getElementById(id);
                    if (input && input.closest(tabSelector)) input.value = data[id];
                });
            } catch (e) {
                if (errorLabel) console.error("Failed to load " + errorLabel + " data:", e);
            }
        }

        return { save: save, load: load };
    }

    global.AppTabStorage = { createTabStorage: createTabStorage };
})(window);
