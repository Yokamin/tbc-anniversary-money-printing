(function(global) {
    "use strict";

    function createStaleness(config) {
        var state = config.state;
        var maps = config.maps;
        var data = config.data;
        var sanitizeId = config.sanitizeId;

        function getStalenessColor(inputId) {
            var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
            var timestamps = typeof state.getPriceTimestamps === "function" ? state.getPriceTimestamps() : state.priceTimestamps;
            var lastImportBatchTime = typeof state.getLastImportBatchTime === "function" ? state.getLastImportBatchTime() : state.lastImportBatchTime;
            var itemName = ahMap[inputId];
            var ts = itemName ? timestamps[itemName] : undefined;
            if (ts === undefined || ts === null) return "#888";
            if (lastImportBatchTime > 0 && ts >= lastImportBatchTime) return "#60a5fa";
            var age = Date.now() - ts;
            if (age < 5 * 60 * 1000) return "#4ade80";
            if (age < 30 * 60 * 1000) return "#fbbf24";
            if (age < 60 * 60 * 1000) return "#fb923c";
            return "#f87171";
        }

        function getWorstStalenessColor(inputIds) {
            if (!inputIds || inputIds.length === 0) return null;
            var worstIdx = state.colorOrder.length;
            inputIds.forEach(function(id) {
                var color = getStalenessColor(id);
                var idx = state.colorOrder.indexOf(color);
                if (idx !== -1 && idx < worstIdx) worstIdx = idx;
            });
            return worstIdx < state.colorOrder.length ? state.colorOrder[worstIdx] : null;
        }

        function stalenessDotHtml(inputIds) {
            var color = getWorstStalenessColor(inputIds);
            if (!color) return "";
            return '<span class="staleness-dot" style="background:' + color + '" aria-hidden="true"></span>';
        }

        function buildAhInputMap() {
            var nonAhPattern = /^(alch_vendor_|alch_deposit_|gear_vendor_|gear_deposit_|cook_vendor_|cook_deposit_|tx_deposit_|ench_vendor_|ench_deposit_|lw_vendor_|lw_deposit_)/;
            [maps.alch, maps.gear, maps.tx, maps.cook, maps.ench, maps.lw].forEach(function(map) {
                for (var name in map) {
                    var id = map[name];
                    if (!id || nonAhPattern.test(id) || id.indexOf("_ah_cut") !== -1) continue;
                    var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
                    ahMap[id] = name;
                }
            });
        }

        function injectStalenessDotsToRows() {
            document.querySelectorAll(".price-table-row").forEach(function(row) {
                if (row.querySelector(".staleness-dot")) return;
                var input = row.querySelector('.price-control input[type="number"]');
                if (!input) return;
                var inputId = input.id;
                var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
                var itemName = ahMap[inputId];
                if (!itemName || state.exemptItems.has(itemName)) return;
                var ptName = row.querySelector(".pt-name");
                if (!ptName) return;
                var dot = document.createElement("span");
                dot.className = "staleness-dot";
                dot.setAttribute("data-staleness-input", inputId);
                row.insertBefore(dot, ptName);
            });
            updateStalenessDotsOnRows();
        }

        function updateStalenessDotsOnRows() {
            document.querySelectorAll("[data-staleness-input]").forEach(function(dot) {
                dot.style.background = getStalenessColor(dot.getAttribute("data-staleness-input"));
            });
        }

        function getAlchRecipeStalenessInputs(r) {
            var ids = [];
            var productId = "alch_sale_" + r.id;
            var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
            if (ahMap[productId]) ids.push(productId);
            r.ingredients.forEach(function(ing) {
                if (state.exemptItems.has(ing.item)) return;
                var id = maps.alch[ing.item];
                if (id && ahMap[id]) ids.push(id);
                if (ing.craftFrom && ing.craftFrom.item && !state.exemptItems.has(ing.craftFrom.item)) {
                    var cfId = maps.alch[ing.craftFrom.item];
                    if (cfId && ahMap[cfId]) ids.push(cfId);
                }
            });
            return ids;
        }

        function getGearRecipeStalenessInputs(r) {
            var ids = [];
            var productId = "gear_sale_" + r.id;
            var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
            if (ahMap[productId]) ids.push(productId);
            r.ingredients.forEach(function(ing) {
                if (ing.type === "bop" || ing.type === "vendor" || state.exemptItems.has(ing.item)) return;
                var id = maps.gear[ing.item];
                if (id && ahMap[id]) ids.push(id);
                if (ing.craftFrom) {
                    if (ing.craftFrom.item && !state.exemptItems.has(ing.craftFrom.item)) {
                        var cfId = maps.gear[ing.craftFrom.item];
                        if (cfId && ahMap[cfId]) ids.push(cfId);
                    }
                    if (ing.craftFrom.mats) {
                        ing.craftFrom.mats.forEach(function(mat) {
                            if (mat.type === "vendor" || state.exemptItems.has(mat.item)) return;
                            var matId = maps.gear[mat.item];
                            if (matId && ahMap[matId]) ids.push(matId);
                        });
                    }
                }
            });
            return ids;
        }

        function getTxStalenessInputs(recipeId, primalId) {
            var ids = [];
            if (recipeId === "mote_primals") {
                if (primalId) {
                    ids.push("tx_mote_" + primalId);
                    ids.push("tx_primal_" + primalId);
                } else {
                    data.txPrimals.forEach(function(p) { ids.push("tx_mote_" + p.id); ids.push("tx_primal_" + p.id); });
                }
            } else if (recipeId === "planar_essence") {
                ids.push("tx_lesser_planar");
                ids.push("tx_greater_planar");
            } else {
                var saleId = "tx_sale_" + recipeId;
                var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
                if (ahMap[saleId]) ids.push(saleId);
                var recipe = data.transmuteRecipes.find(function(x) { return x.id === recipeId; }) || data.clothDailies.find(function(x) { return x.id === recipeId; });
                if (recipe) {
                    recipe.ingredients.forEach(function(ing) {
                        if (state.exemptItems.has(ing.item)) return;
                        if (ing.type === "primal") {
                            var p = data.txPrimals.find(function(x) { return x.id === ing.primalId; });
                            if (p) { ids.push("tx_mote_" + p.id); ids.push("tx_primal_" + p.id); }
                        } else if (ing.type === "gem") {
                            var gId = "tx_gem_" + sanitizeId(ing.item);
                            if (ahMap[gId]) ids.push(gId);
                        } else if (ing.type === "imbued_bolt") {
                            ids.push("tx_imbued_bolt"); ids.push("tx_bolt_nw"); ids.push("tx_dust");
                        } else if (ing.type === "ah") {
                            var id = maps.tx[ing.item];
                            if (id && ahMap[id]) ids.push(id);
                        }
                    });
                }
            }
            return ids;
        }

        function getCookRecipeStalenessInputs(r) {
            var ids = [];
            var saleId = "cook_sale_" + r.id;
            var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
            if (ahMap[saleId]) ids.push(saleId);
            r.ingredients.forEach(function(ing) {
                if (ing.type === "vendor" || state.exemptItems.has(ing.item)) return;
                var id = maps.cook[ing.item];
                if (id && ahMap[id]) ids.push(id);
            });
            return ids;
        }

        function getEnchRecipeStalenessInputs(r) {
            var ids = [];
            var saleId = "ench_sale_" + r.id;
            var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
            if (ahMap[saleId]) ids.push(saleId);
            r.ingredients.forEach(function(ing) {
                if (ing.type === "vendor" || state.exemptItems.has(ing.item)) return;
                var id = maps.ench[ing.item];
                if (id && ahMap[id]) ids.push(id);
            });
            return ids;
        }

        function getLwRecipeStalenessInputs(r) {
            var ids = [];
            var saleId = "lw_sale_" + r.id;
            var ahMap = typeof state.getAhInputToName === "function" ? state.getAhInputToName() : state.ahInputToName;
            if (ahMap[saleId]) ids.push(saleId);
            r.ingredients.forEach(function(ing) {
                if (ing.type === "bop" || ing.type === "vendor" || state.exemptItems.has(ing.item)) return;
                var id = maps.lw[ing.item];
                if (id && ahMap[id]) ids.push(id);
                if (ing.craftFrom && ing.craftFrom.item && !state.exemptItems.has(ing.craftFrom.item)) {
                    var cfId = maps.lw[ing.craftFrom.item];
                    if (cfId && ahMap[cfId]) ids.push(cfId);
                }
            });
            return ids;
        }

        return {
            getStalenessColor: getStalenessColor,
            stalenessDotHtml: stalenessDotHtml,
            buildAhInputMap: buildAhInputMap,
            injectStalenessDotsToRows: injectStalenessDotsToRows,
            updateStalenessDotsOnRows: updateStalenessDotsOnRows,
            getAlchRecipeStalenessInputs: getAlchRecipeStalenessInputs,
            getGearRecipeStalenessInputs: getGearRecipeStalenessInputs,
            getTxStalenessInputs: getTxStalenessInputs,
            getCookRecipeStalenessInputs: getCookRecipeStalenessInputs,
            getEnchRecipeStalenessInputs: getEnchRecipeStalenessInputs,
            getLwRecipeStalenessInputs: getLwRecipeStalenessInputs
        };
    }

    global.AppStaleness = { createStaleness: createStaleness };
})(window);
