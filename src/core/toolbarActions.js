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

        function exportManualSnapshot() {
            var snapshot = {
                version: config.appVersion || "unknown",
                exportedAt: new Date().toISOString(),
                vendorPrices: {},
                deposits: {},
                ahCuts: {}
            };
            document.querySelectorAll('input[type="number"]').forEach(function(input) {
                var id = input.id || "";
                var val = parseFloat(input.value);
                if (id.indexOf("_vendor_") !== -1) snapshot.vendorPrices[id] = isNaN(val) ? 0 : val;
                else if (id.indexOf("_deposit_") !== -1 || id.indexOf("deposit_") === 0) snapshot.deposits[id] = isNaN(val) ? 0 : val;
                else if (id === "ah_cut" || id.slice(-7) === "_ah_cut") snapshot.ahCuts[id] = isNaN(val) ? 0 : val;
            });
            var out = document.getElementById("global_export_output");
            if (out) out.value = JSON.stringify(snapshot, null, 2);
        }

        function compareExports() {
            var inGame = document.getElementById("compare-export-modal-input");
            var siteOut = document.getElementById("global_export_output");
            if (!inGame || !siteOut) return;
            if (!siteOut.value.trim()) config.generateExport();

            function normalizeLine(line) {
                var parts = line.trim().split("^");
                if (!parts[0]) return null;
                var key = parts[0].trim();
                var items = parts.slice(1).map(function(p) { return p.trim(); }).filter(Boolean).sort();
                return key + "^" + items.join("^");
            }
            function linesMap(text) {
                var counts = {};
                text.split(/\r?\n/).map(function(l) { return normalizeLine(l); }).filter(Boolean).forEach(function(l) {
                    counts[l] = (counts[l] || 0) + 1;
                });
                return counts;
            }

            var site = linesMap(siteOut.value);
            var game = linesMap(inGame.value);
            var missing = [];
            var extra = [];
            var dupes = [];
            Object.keys(site).forEach(function(k) {
                var diff = site[k] - (game[k] || 0);
                for (var i = 0; i < diff; i++) missing.push(k);
            });
            Object.keys(game).forEach(function(k) {
                var extraCount = game[k] - (site[k] || 0);
                for (var i = 0; i < extraCount; i++) extra.push(k);
                if (game[k] > 1) dupes.push(k + " (" + game[k] + "x)");
            });

            var lines = [];
            lines.push("Compare summary");
            lines.push("- Missing in in-game export: " + missing.length);
            lines.push("- Extra in in-game export: " + extra.length);
            lines.push("- Duplicate in in-game export: " + dupes.length);
            if (missing.length) lines.push("\nMissing lines:\n" + missing.join("\n"));
            if (extra.length) lines.push("\nExtra lines:\n" + extra.join("\n"));
            if (dupes.length) lines.push("\nDuplicate lines:\n" + dupes.join("\n"));
            lines.push("\nGuidance: remove duplicate/extra lines in-game, then re-export and compare again until counts are 0.");
            var fullText = lines.join("\n");
            global.__lastCompareExportText = fullText;
            var bodyPre = document.getElementById("compare-export-body");
            if (bodyPre) {
                bodyPre.textContent = fullText;
                try { bodyPre.scrollTop = 0; } catch (e) {}
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
            exportManualSnapshot: exportManualSnapshot,
            compareExports: compareExports,
            resetAHPrices: resetAHPrices
        };
    }

    global.AppToolbarActions = { createToolbarActions: createToolbarActions };
})(window);
