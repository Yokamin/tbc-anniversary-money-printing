(function(global) {
    "use strict";

    function createGlobalImport(config) {
        function getLocksKey(id) {
            if (id.startsWith("alch_")) return config.lockKeys.alch;
            if (id.startsWith("gear_")) return config.lockKeys.gear;
            if (id.startsWith("tx_")) return config.lockKeys.tx;
            if (id.startsWith("cook_")) return config.lockKeys.cook;
            if (id.startsWith("ench_")) return config.lockKeys.ench;
            if (id.startsWith("lw_")) return config.lockKeys.lw;
            return config.lockKeys.alch;
        }

        function run() {
            var textarea = document.getElementById("global_import_input");
            var status = document.getElementById("global_import_status");
            var text = (textarea ? textarea.value : "").trim();
            if (!text) { status.textContent = "Paste data first"; status.style.color = "#f87171"; return; }

            var batchTime = Date.now();
            var lines = text.split("\n");
            var updated = 0, skipped = 0;

            for (var i = 0; i < lines.length; i++) {
                var match = lines[i].match(/^"?(\d+)"?,\s*"([^"]+)"/);
                if (!match) continue;
                var copperPrice = parseInt(match[1], 10);
                var name = match[2];
                var clean = name.replace(/\s*\(\d+\)$/, "");
                var allIds = config.getAllNameToInputs()[name] || config.getAllNameToInputs()[clean] || [];
                if (allIds.length === 0) continue;

                var goldPrice = Math.round(copperPrice) / 10000;
                var anyUpdated = false, anySkipped = false;
                allIds.forEach(function(inputId) {
                    var locks = config.getLocks(getLocksKey(inputId));
                    if (locks[inputId]) { anySkipped = true; return; }
                    var iName = config.getItemName(inputId) || config.getAhInputToName()[inputId] || name;
                    config.getPriceTimestamps()[iName] = batchTime;
                    var input = document.getElementById(inputId);
                    if (input) {
                        input.value = goldPrice;
                        config.updateGSCDisplay(inputId);
                        config.autoSizeInput(input);
                        anyUpdated = true;
                    }
                });

                if (anyUpdated) updated++;
                else if (anySkipped) skipped++;
            }

            config.setLastImportBatchTime(batchTime);
            localStorage.setItem(config.timestampsKey, JSON.stringify(config.getPriceTimestamps()));
            localStorage.setItem(config.batchKey, String(batchTime));
            config.syncAllSharedPrices();
            config.calculateAllTabs();
            config.updateStalenessDots();

            var msg = "Updated " + updated + " price" + (updated !== 1 ? "s" : "");
            if (skipped > 0) msg += ", " + skipped + " locked";
            status.textContent = msg;
            status.style.color = updated > 0 ? "#4ade80" : "#f87171";
        }

        return { run: run };
    }

    global.AppGlobalImport = { createGlobalImport: createGlobalImport };
})(window);
