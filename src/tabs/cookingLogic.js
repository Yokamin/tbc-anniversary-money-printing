(function(global) {
    "use strict";

    function createCookingLogic(config) {
        function getCraftAmount(recipeId) {
            var el = document.getElementById("cook_qty_" + recipeId);
            var qty = el ? parseInt(el.value, 10) : 1;
            return qty > 0 ? qty : 1;
        }

        function calculate() {
            var ahCutEl = document.getElementById("cook_ah_cut");
            if (!ahCutEl) return;
            var ahCutPct = parseFloat(ahCutEl.value) / 100 || 0.05;
            var results = [];

            config.recipes.forEach(function(r) {
                var craftAmount = getCraftAmount(r.id);
                var craftCost = 0;
                r.ingredients.forEach(function(ing) {
                    var baseId = "cook_" + r.id + "_ing_" + config.sanitizeId(ing.item);
                    var price = ing.type === "vendor"
                        ? (parseFloat(document.getElementById("cook_vendor_" + config.sanitizeId(ing.item)) ? document.getElementById("cook_vendor_" + config.sanitizeId(ing.item)).value : 0) || 0)
                        : (parseFloat(document.getElementById("cook_mat_" + config.sanitizeId(ing.item)) ? document.getElementById("cook_mat_" + config.sanitizeId(ing.item)).value : 0) || 0);
                    var reqQty = ing.qty * craftAmount;
                    var ingCost = price * reqQty;
                    craftCost += ingCost;
                    var costEl = document.getElementById(baseId);
                    if (costEl) costEl.textContent = config.gold(ingCost);
                    var qtyEl = document.getElementById(baseId + "_qty");
                    if (qtyEl) qtyEl.innerHTML = reqQty + "x " + ing.item + (ing.type === "vendor" ? ' <span style="color:#888;font-size:0.8em">(vendor)</span>' : "");
                });

                var saleEl = document.getElementById("cook_sale_" + r.id);
                var salePrice = (saleEl ? (parseFloat(saleEl.value) || 0) : 0) * craftAmount;
                var ahCut = salePrice * ahCutPct;
                var deposit = parseFloat((document.getElementById("cook_deposit_" + r.id) || {}).value) || 0;
                var profit = salePrice - ahCut - craftCost;

                var el = function(id) { return document.getElementById(id); };
                var craftEl = el("cook_" + r.id + "_craft_cost"); if (craftEl) craftEl.textContent = config.gold(craftCost);
                var saleDEl = el("cook_" + r.id + "_sale_display"); if (saleDEl) saleDEl.textContent = config.gold(salePrice);
                var cutEl = el("cook_" + r.id + "_ah_cut_display"); if (cutEl) cutEl.textContent = config.gold(ahCut);
                var profitEl = el("cook_" + r.id + "_profit");
                if (profitEl) profitEl.innerHTML = "<span class=\"" + config.profitClass(profit) + "\">" + (profit >= 0 ? "+" : "") + config.gold(profit) + "</span>";
                var depEl = el("cook_" + r.id + "_deposit_note"); if (depEl) depEl.textContent = "Deposit: " + config.gold(deposit) + " (lost if unsold)";

                results.push({ recipe: r, craftCost: craftCost, salePrice: salePrice, profit: profit });
            });

            config.setResults(results);
            config.sortResults(results, config.getSortBy());
            var tbody = "";
            results.forEach(function(r) {
                var cls = config.profitClass(r.profit);
                var pct = config.profitPctStr(r.profit, r.craftCost);
                var nameHtml = config.stalenessDotHtml(config.getStalenessInputs(r.recipe)) + r.recipe.name;
                if (r.recipe.id === "smoked_desert_dumplings") {
                    nameHtml += " <span style=\"color:#f87171;cursor:help;\" title=\"Worse version of Roasted Clefthoof — provides the same buff without Spirit, but is typically more expensive and far less traded\">(!)</span>";
                }
                tbody += "<tr class=\"cook-summary-row\" data-recipe=\"" + r.recipe.id + "\">" +
                    "<td>" + nameHtml + "</td>" +
                    "<td>" + config.gold(r.craftCost) + "</td>" +
                    "<td>" + config.gold(r.salePrice) + "</td>" +
                    "<td class=\"" + cls + "\">" + (r.profit >= 0 ? "+" : "") + config.gold(r.profit) + "</td>" +
                    "<td class=\"" + cls + "\">" + pct + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "daily") + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "avgPrice") + "</td>" +
                "</tr>";
            });
            var summaryBody = document.getElementById("cook-summary-body");
            if (summaryBody && !(summaryBody.contains(document.activeElement) && document.activeElement.classList.contains("tsm-input"))) {
                summaryBody.innerHTML = tbody;
            }

            config.saveToStorage();
            if (window.updateMissingDefaultWarnings) window.updateMissingDefaultWarnings();
            config.evCalculate();
        }

        function selectRecipe(recipeId) {
            var dropdown = document.getElementById("cook-recipe-dropdown");
            config.syncDropdown("#cook-recipe-dropdown", "cook-recipe-dropdown-label", recipeId);
            if (dropdown) dropdown.classList.remove("open");
            var backBtn = document.getElementById("cook-recipe-back");
            if (backBtn) backBtn.style.display = recipeId === "all" ? "none" : "";
            var allView = document.getElementById("cook-view-all");
            if (allView) allView.style.display = recipeId === "all" ? "" : "none";
            document.querySelectorAll(".cook-view").forEach(function(v) {
                v.style.display = v.id === "cook-view-" + recipeId ? "" : "none";
            });
            var cookTab = document.getElementById("tab-cooking");
            cookTab.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                if (recipeId === "all") { row.style.display = "flex"; return; }
                row.style.display = row.dataset.recipes.split(",").indexOf(recipeId) !== -1 ? "flex" : "none";
            });
            cookTab.querySelectorAll(".cook-filterable").forEach(function(panel) {
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

    global.AppCookingLogic = { createCookingLogic: createCookingLogic };
})(window);
