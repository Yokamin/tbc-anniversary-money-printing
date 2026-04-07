(function(global) {
    "use strict";

    function createSharedPriceSync(config) {
        function buildGroups() {
            var excludePattern = /(_ah_cut|_deposit_)/;
            config.priceStore.build(config.getAllMaps(), excludePattern);
            config.setAllNameToInputs(config.priceStore.getGroups());
        }

        function syncOne(changedId) {
            config.priceStore.syncChanged(changedId, config.getInputById, function(id, inputEl) {
                config.updateGSCDisplay(id);
                config.autoSizeInput(inputEl);
            });
        }

        function syncAll() {
            config.priceStore.syncAll(config.getInputById, function(group, getInputById) {
                var source = null;
                group.forEach(function(id) {
                    var el = getInputById(id);
                    if (el && parseFloat(el.value) && source === null) source = { id: id, value: el.value };
                });
                return source;
            }, function(id, inputEl) {
                config.updateGSCDisplay(id);
                config.autoSizeInput(inputEl);
            });
        }

        return { buildGroups: buildGroups, syncOne: syncOne, syncAll: syncAll };
    }

    global.AppSharedPriceSync = { createSharedPriceSync: createSharedPriceSync };
})(window);
