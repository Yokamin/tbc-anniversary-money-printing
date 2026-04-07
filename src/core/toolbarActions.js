(function(global) {
    "use strict";

    function createToolbarActions(config) {
        function globalExport() {
            config.generateExport();
        }

        function globalCopyExport() {
            var t = document.getElementById("global_export_output");
            if (!t || !t.value) return;
            t.select();
            document.execCommand("copy");
            var btn = document.querySelector(".toolbar-export .toolbar-btn:not(.toolbar-btn-reset):last-of-type");
            if (btn) {
                var orig = btn.textContent;
                btn.textContent = "Copied!";
                setTimeout(function() { btn.textContent = orig; }, 1500);
            }
        }

        function resetAHPrices() {
            if (!confirm("Reset all AH prices to 0?\n\nVendor prices, deposits, and AH cut % will be kept.")) return;
            document.querySelectorAll('input[type=number]').forEach(function(input) {
                var id = input.id;
                if (!id) return;
                if (id.indexOf("_vendor_") !== -1) return;
                if (id === "ah_cut" || id.slice(-7) === "_ah_cut") return;
                if (id.slice(0, 8) === "deposit_" || id.indexOf("_deposit_") !== -1) return;
                input.value = 0;
                config.updateGSCDisplay(id);
                config.autoSizeInput(input);
            });
            config.recalculateAllTabs();
        }

        return {
            globalExport: globalExport,
            globalCopyExport: globalCopyExport,
            resetAHPrices: resetAHPrices
        };
    }

    global.AppToolbarActions = { createToolbarActions: createToolbarActions };
})(window);
