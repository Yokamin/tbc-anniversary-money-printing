(function(global) {
    "use strict";

    function createEnchantingLogic(config) {
        function getCraftAmount(recipeId) {
            var el = document.getElementById("ench_qty_" + recipeId);
            var qty = el ? parseInt(el.value, 10) : 1;
            return qty > 0 ? qty : 1;
        }

        function calculate() {
            var ahCutEl = document.getElementById("ench_ah_cut");
            if (!ahCutEl) return;
            var ahCutPct = parseFloat(ahCutEl.value) / 100 || 0.05;
            var results = [];

            config.recipes.forEach(function(r) {
                var craftAmount = getCraftAmount(r.id);
                var craftCost = 0;
                r.ingredients.forEach(function(ing) {
                    var price = ing.type === "vendor"
                        ? (parseFloat((document.getElementById("ench_vendor_" + config.sanitizeId(ing.item)) || {}).value) || 0)
                        : (parseFloat((document.getElementById("ench_mat_" + config.sanitizeId(ing.item)) || {}).value) || 0);
                    var reqQty = ing.qty * craftAmount;
                    var ingCost = price * reqQty;
                    craftCost += ingCost;
                    var baseId = "ench_" + r.id + "_ing_" + config.sanitizeId(ing.item);
                    var costEl = document.getElementById(baseId);
                    if (costEl) costEl.textContent = config.gold(ingCost);
                    var qtyEl = document.getElementById(baseId + "_qty");
                    if (qtyEl) qtyEl.textContent = reqQty + "x " + ing.item + (ing.type === "vendor" ? " (vendor)" : "");
                });

                var saleEl = document.getElementById("ench_sale_" + r.id);
                var salePrice = (saleEl ? (parseFloat(saleEl.value) || 0) : 0) * craftAmount;
                var ahCut = salePrice * ahCutPct;
                var deposit = parseFloat((document.getElementById("ench_deposit_" + r.id) || {}).value) || 0;
                var profit = salePrice - ahCut - craftCost;

                var el = function(id) { return document.getElementById(id); };
                var craftEl = el("ench_" + r.id + "_craft_cost"); if (craftEl) craftEl.textContent = config.gold(craftCost);
                var saleDEl = el("ench_" + r.id + "_sale_display"); if (saleDEl) saleDEl.textContent = config.gold(salePrice);
                var cutEl = el("ench_" + r.id + "_ah_cut_display"); if (cutEl) cutEl.textContent = config.gold(ahCut);
                var profitEl = el("ench_" + r.id + "_profit");
                if (profitEl) profitEl.innerHTML = "<span class=\"" + config.profitClass(profit) + "\">" + (profit >= 0 ? "+" : "") + config.gold(profit) + "</span>";
                var depEl = el("ench_" + r.id + "_deposit_note"); if (depEl) depEl.textContent = "Deposit: " + config.gold(deposit) + " (lost if unsold)";
                results.push({ recipe: r, craftCost: craftCost, salePrice: salePrice, profit: profit });
            });

            config.setResults(results);
            config.sortResults(results, config.getSortBy());
            var tbody = "";
            results.forEach(function(r) {
                var cls = config.profitClass(r.profit);
                var pct = config.profitPctStr(r.profit, r.craftCost);
                tbody += "<tr class=\"ench-summary-row\" data-recipe=\"" + r.recipe.id + "\">" +
                    "<td>" + config.stalenessDotHtml(config.getStalenessInputs(r.recipe)) + r.recipe.name + "</td>" +
                    "<td>" + config.gold(r.craftCost) + "</td>" +
                    "<td>" + config.gold(r.salePrice) + "</td>" +
                    "<td class=\"" + cls + "\">" + (r.profit >= 0 ? "+" : "") + config.gold(r.profit) + "</td>" +
                    "<td class=\"" + cls + "\">" + pct + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "daily") + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "avgPrice") + "</td>" +
                "</tr>";
            });
            var summaryBody = document.getElementById("ench-summary-body");
            if (summaryBody && !(summaryBody.contains(document.activeElement) && document.activeElement.classList.contains("tsm-input"))) {
                summaryBody.innerHTML = tbody;
            }
            config.saveToStorage();
            if (window.updateMissingDefaultWarnings) window.updateMissingDefaultWarnings();
            config.evCalculate();
        }

        function selectRecipe(recipeId) {
            var dropdown = document.getElementById("ench-recipe-dropdown");
            config.syncDropdown("#ench-recipe-dropdown", "ench-recipe-dropdown-label", recipeId);
            if (dropdown) dropdown.classList.remove("open");
            var backBtn = document.getElementById("ench-recipe-back");
            if (backBtn) backBtn.style.display = recipeId === "all" ? "none" : "";
            var allView = document.getElementById("ench-view-all");
            if (allView) allView.style.display = recipeId === "all" ? "" : "none";
            document.querySelectorAll(".ench-view").forEach(function(v) {
                v.style.display = v.id === "ench-view-" + recipeId ? "" : "none";
            });
            var enchTab = document.getElementById("tab-enchanting");
            enchTab.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                if (recipeId === "all") { row.style.display = "flex"; return; }
                row.style.display = row.dataset.recipes.split(",").indexOf(recipeId) !== -1 ? "flex" : "none";
            });
            enchTab.querySelectorAll(".ench-filterable").forEach(function(panel) {
                var anyVisible = false;
                panel.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                    if (row.style.display !== "none") anyVisible = true;
                });
                panel.style.display = anyVisible ? "" : "none";
            });
            localStorage.setItem(config.recipeStorageKey, recipeId);
        }

        return { calculate: calculate, selectRecipe: selectRecipe };
    }

    global.AppEnchantingLogic = { createEnchantingLogic: createEnchantingLogic };
})(window);
