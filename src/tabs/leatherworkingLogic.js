(function(global) {
    "use strict";

    function createLeatherworkingLogic(config) {
        function getCraftAmount(recipeId) {
            var el = document.getElementById("lw_qty_" + recipeId);
            var qty = el ? parseInt(el.value, 10) : 1;
            return qty > 0 ? qty : 1;
        }

        function updateIngQtyLabels(ing, recipeId, totalQty) {
            var baseId = "lw_" + recipeId + "_ing_" + config.sanitizeId(ing.item);
            var fixedQty = document.getElementById(baseId + "_qty");
            if (fixedQty) fixedQty.textContent = totalQty + "x " + ing.item + (ing.type === "vendor" ? " (vendor)" : "");
            var buyQty = document.getElementById(baseId + "_buy_qty");
            if (buyQty) buyQty.textContent = totalQty + "x " + ing.item;
            var craftQty = document.getElementById(baseId + "_craft_qty");
            if (craftQty && ing.craftFrom && ing.craftFrom.item) craftQty.textContent = (totalQty * ing.craftFrom.qty) + "x " + ing.craftFrom.item;
            else if (craftQty) craftQty.textContent = totalQty + "x " + ing.item;
            if (ing.craftFrom && ing.craftFrom.mats) {
                ing.craftFrom.mats.forEach(function(mat) { updateIngQtyLabels(mat, recipeId, totalQty * mat.qty); });
            }
        }

        function computeIngCost(ing, recipeId, totalQty) {
            var baseId = "lw_" + recipeId + "_ing_" + config.sanitizeId(ing.item);
            if (ing.type === "bop") return 0;
            if (ing.craftFrom && ing.craftFrom.item) {
                var buyCost = config.getVal("lw_mat_" + config.sanitizeId(ing.item)) * totalQty;
                var craftCost = config.getVal("lw_mat_" + config.sanitizeId(ing.craftFrom.item)) * ing.craftFrom.qty * totalQty;
                var useCraft = craftCost < buyCost;
                var buyLbl = document.getElementById(baseId + "_buy_label");
                if (buyLbl) {
                    var buyPEl = document.getElementById(baseId + "_buy_price");
                    var craftLbl = document.getElementById(baseId + "_craft_label");
                    var craftPEl = document.getElementById(baseId + "_craft_price");
                    buyLbl.className = "opt" + (!useCraft ? " active" : "");
                    buyPEl.className = "opt" + (!useCraft ? " active" : "");
                    buyPEl.innerHTML = config.gold(buyCost) + (!useCraft ? "<span class=\"using\">USING</span>" : "");
                    craftLbl.className = "opt" + (useCraft ? " active" : "");
                    craftPEl.className = "opt" + (useCraft ? " active" : "");
                    craftPEl.innerHTML = config.gold(craftCost) + (useCraft ? "<span class=\"using\">USING</span>" : "");
                }
                return useCraft ? craftCost : buyCost;
            }
            if (ing.craftFrom && ing.craftFrom.mats) {
                var buyCost2 = config.getVal("lw_mat_" + config.sanitizeId(ing.item)) * totalQty;
                var craftSubCost = 0;
                ing.craftFrom.mats.forEach(function(mat) { craftSubCost += computeIngCost(mat, recipeId, totalQty * mat.qty); });
                var useCraft2 = craftSubCost < buyCost2;
                var buyLbl2 = document.getElementById(baseId + "_buy_label");
                if (buyLbl2) {
                    var buyPEl2 = document.getElementById(baseId + "_buy_price");
                    var craftLbl2 = document.getElementById(baseId + "_craft_label");
                    var craftPEl2 = document.getElementById(baseId + "_craft_price");
                    buyLbl2.className = "opt" + (!useCraft2 ? " active" : "");
                    buyPEl2.className = "opt" + (!useCraft2 ? " active" : "");
                    buyPEl2.innerHTML = config.gold(buyCost2) + (!useCraft2 ? "<span class=\"using\">USING</span>" : "");
                    craftLbl2.className = "opt" + (useCraft2 ? " active" : "");
                    craftPEl2.className = "opt" + (useCraft2 ? " active" : "");
                    craftPEl2.innerHTML = config.gold(craftSubCost) + (useCraft2 ? "<span class=\"using\">USING</span>" : "");
                }
                return useCraft2 ? craftSubCost : buyCost2;
            }
            var price = ing.type === "vendor" ? config.getVal("lw_vendor_" + config.sanitizeId(ing.item)) : config.getVal("lw_mat_" + config.sanitizeId(ing.item));
            var cost = (price || 0) * totalQty;
            var costEl = document.getElementById(baseId);
            if (costEl) costEl.textContent = config.gold(cost);
            return cost;
        }

        function calculate() {
            var ahCutEl = document.getElementById("lw_ah_cut");
            if (!ahCutEl) return;
            var ahCutPct = parseFloat(ahCutEl.value) / 100 || 0.05;
            var results = [];
            config.recipes.forEach(function(r) {
                var craftAmount = getCraftAmount(r.id);
                var craftCost = 0;
                r.ingredients.forEach(function(ing) {
                    updateIngQtyLabels(ing, r.id, ing.qty * craftAmount);
                    craftCost += computeIngCost(ing, r.id, ing.qty * craftAmount);
                });
                var salePrice = config.getVal("lw_sale_" + r.id) * craftAmount;
                var ahCut = salePrice * ahCutPct;
                var deposit = config.getVal("lw_deposit_" + r.id);
                var profit = salePrice - ahCut - craftCost;
                var el = function(id) { return document.getElementById(id); };
                var craftEl = el("lw_" + r.id + "_craft_cost"); if (craftEl) craftEl.textContent = config.gold(craftCost);
                var saleDEl = el("lw_" + r.id + "_sale_display"); if (saleDEl) saleDEl.textContent = config.gold(salePrice);
                var cutEl = el("lw_" + r.id + "_ah_cut_display"); if (cutEl) cutEl.textContent = config.gold(ahCut);
                var profitEl = el("lw_" + r.id + "_profit");
                if (profitEl) profitEl.innerHTML = "<span class=\"" + config.profitClass(profit) + "\">" + (profit >= 0 ? "+" : "") + config.gold(profit) + "</span>";
                var depEl = el("lw_" + r.id + "_deposit_note"); if (depEl) depEl.textContent = "Deposit: " + config.gold(deposit) + " each (lost if unsold)";
                results.push({ recipe: r, craftCost: craftCost, salePrice: salePrice, profit: profit });
            });
            config.setResults(results);
            config.sortResults(results, config.getSortBy());
            var tbody = "";
            results.forEach(function(r) {
                var cls = config.profitClass(r.profit);
                var pct = config.profitPctStr(r.profit, r.craftCost);
                tbody += "<tr class=\"lw-summary-row\" data-recipe=\"" + r.recipe.id + "\">" +
                    "<td>" + config.stalenessDotHtml(config.getStalenessInputs(r.recipe)) + r.recipe.name + "</td>" +
                    "<td>" + config.gold(r.craftCost) + "</td>" +
                    "<td>" + config.gold(r.salePrice) + "</td>" +
                    "<td class=\"" + cls + "\">" + (r.profit >= 0 ? "+" : "") + config.gold(r.profit) + "</td>" +
                    "<td class=\"" + cls + "\">" + pct + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "daily") + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "avgPrice") + "</td>" +
                "</tr>";
            });
            var summaryBody = document.getElementById("lw-summary-body");
            if (summaryBody && !(summaryBody.contains(document.activeElement) && document.activeElement.classList.contains("tsm-input"))) {
                summaryBody.innerHTML = tbody;
            }
            config.saveToStorage();
            if (window.updateMissingDefaultWarnings) window.updateMissingDefaultWarnings();
            config.evCalculate();
        }

        function selectRecipe(recipeId) {
            var dropdown = document.getElementById("lw-recipe-dropdown");
            config.syncDropdown("#lw-recipe-dropdown", "lw-recipe-dropdown-label", recipeId);
            if (dropdown) dropdown.classList.remove("open");
            var backBtn = document.getElementById("lw-recipe-back");
            if (backBtn) backBtn.style.display = recipeId === "all" ? "none" : "";
            var allView = document.getElementById("lw-view-all");
            if (allView) allView.style.display = recipeId === "all" ? "" : "none";
            document.querySelectorAll(".lw-view").forEach(function(v) {
                v.style.display = v.id === "lw-view-" + recipeId ? "" : "none";
            });
            var lwTab = document.getElementById("tab-leatherworking");
            lwTab.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                if (recipeId === "all") { row.style.display = "flex"; return; }
                row.style.display = row.dataset.recipes.split(",").indexOf(recipeId) !== -1 ? "flex" : "none";
            });
            lwTab.querySelectorAll(".lw-filterable").forEach(function(panel) {
                var anyVisible = false;
                panel.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                    if (row.style.display !== "none") anyVisible = true;
                });
                panel.style.display = anyVisible ? "" : "none";
            });
            localStorage.setItem(config.recipeStorageKey, recipeId);
        }

        return { computeIngCost: computeIngCost, calculate: calculate, selectRecipe: selectRecipe };
    }

    global.AppLeatherworkingLogic = { createLeatherworkingLogic: createLeatherworkingLogic };
})(window);
