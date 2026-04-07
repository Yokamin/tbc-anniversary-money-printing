(function(global) {
    "use strict";

    function createGearLogic(config) {
        function computeIngCost(ing, recipeId, totalQty) {
            var baseId = "gear_" + recipeId + "_ing_" + config.sanitizeId(ing.item);
            if (ing.type === "bop") return 0;

            if (ing.craftFrom && ing.craftFrom.item) {
                var buyCost = config.getVal("gear_mat_" + config.sanitizeId(ing.item)) * totalQty;
                var craftCost = config.getVal("gear_mat_" + config.sanitizeId(ing.craftFrom.item)) * ing.craftFrom.qty * totalQty;
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
                var buyCost2 = config.getVal("gear_mat_" + config.sanitizeId(ing.item)) * totalQty;
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

            var price = ing.type === "vendor" ? config.getVal("gear_vendor_" + config.sanitizeId(ing.item)) : config.getVal("gear_mat_" + config.sanitizeId(ing.item));
            var cost = (price || 0) * totalQty;
            var costEl = document.getElementById(baseId);
            if (costEl) costEl.textContent = config.gold(cost);
            return cost;
        }

        function calculate() {
            var ahCutPct = config.getVal("gear_ah_cut") / 100;
            var results = [];
            config.getAllGearRecipes().forEach(function(r) {
                var craftCost = 0;
                r.ingredients.forEach(function(ing) { craftCost += computeIngCost(ing, r.id, ing.qty); });
                var salePrice = config.getVal("gear_sale_" + r.id);
                var ahCut = salePrice * ahCutPct;
                var deposit = config.getVal("gear_deposit_" + r.id);
                var profit = salePrice - ahCut - craftCost;
                var elById = function(id) { return document.getElementById(id); };
                var craftEl = elById("gear_" + r.id + "_craft_cost"); if (craftEl) craftEl.textContent = config.gold(craftCost);
                var saleEl = elById("gear_" + r.id + "_sale_display"); if (saleEl) saleEl.textContent = config.gold(salePrice);
                var cutEl = elById("gear_" + r.id + "_ah_cut_display"); if (cutEl) cutEl.textContent = config.gold(ahCut);
                var profitEl = elById("gear_" + r.id + "_profit");
                if (profitEl) profitEl.innerHTML = "<span class=\"" + config.profitClass(profit) + "\">" + (profit >= 0 ? "+" : "") + config.gold(profit) + "</span>";
                var depositEl = elById("gear_" + r.id + "_deposit_note");
                if (depositEl) depositEl.textContent = "Deposit: " + config.gold(deposit) + " (lost if unsold)";

                var bopIng = r.ingredients.find(function(i) { return i.type === "bop"; });
                if (bopIng && depositEl) {
                    var profitPerBop = profit / bopIng.qty;
                    var bopNoteId = "gear_" + r.id + "_bop_note";
                    var existing = elById(bopNoteId);
                    var bopHtml = "<div class=\"card-row highlight\" id=\"" + bopNoteId + "\" style=\"border-top:none; margin-top:4px; padding-top:4px;\">" +
                        "<span class=\"label\">Profit per " + bopIng.item + "</span>" +
                        "<span class=\"value\"><span class=\"" + config.profitClass(profitPerBop) + "\">" + (profitPerBop >= 0 ? "+" : "") + config.gold(profitPerBop) + "</span></span>" +
                    "</div>";
                    if (existing) existing.outerHTML = bopHtml;
                    else depositEl.insertAdjacentHTML("beforebegin", bopHtml);
                }
                results.push({ recipe: r, craftCost: craftCost, salePrice: salePrice, profit: profit });
            });

            config.setResults(results);
            var summaryRows = results.map(function(r) {
                return { recipeId: r.recipe.id, recipeName: r.recipe.name, craftCost: r.craftCost, salePrice: r.salePrice, profit: r.profit, stalenessInputs: config.getStalenessInputs(r.recipe), tsmId: r.recipe.id };
            });
            config.sortResults(summaryRows, config.getSortBy());
            var tbody = "";
            summaryRows.forEach(function(r) {
                var cls = config.profitClass(r.profit);
                var pct = config.profitPctStr(r.profit, r.craftCost);
                var tsmDaily = r.tsmId ? config.tsmInputHtml(r.tsmId, "daily") : "\u2014";
                var tsmAvg = r.tsmId ? config.tsmInputHtml(r.tsmId, "avgPrice") : "\u2014";
                tbody += "<tr class=\"gear-summary-row\" data-recipe=\"" + r.recipeId + "\">" +
                    "<td>" + config.stalenessDotHtml(r.stalenessInputs) + r.recipeName + "</td>" +
                    "<td>" + config.gold(r.craftCost) + "</td>" +
                    "<td>" + config.gold(r.salePrice) + "</td>" +
                    "<td class=\"" + cls + "\">" + (r.profit >= 0 ? "+" : "") + config.gold(r.profit) + "</td>" +
                    "<td class=\"" + cls + "\">" + pct + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + tsmDaily + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + tsmAvg + "</td>" +
                "</tr>";
            });
            var summaryBody = document.getElementById("gear-summary-body");
            if (summaryBody && !(summaryBody.contains(document.activeElement) && document.activeElement.classList.contains("tsm-input"))) summaryBody.innerHTML = tbody;
            config.saveToStorage();
            config.evCalculate();
        }

        function selectRecipe(recipeId) {
            var dropdown = document.getElementById("gear-recipe-dropdown");
            config.syncDropdown("#gear-recipe-dropdown", "gear-recipe-dropdown-label", recipeId);
            if (dropdown) dropdown.classList.remove("open");
            var backBtn = document.getElementById("gear-recipe-back");
            if (backBtn) backBtn.style.display = recipeId === "all" ? "none" : "";
            var allView = document.getElementById("gear-view-all");
            if (allView) allView.style.display = recipeId === "all" ? "" : "none";
            config.getAllGearRecipes().forEach(function(r) {
                var view = document.getElementById("gear-view-" + r.id);
                if (view) view.style.display = r.id === recipeId ? "" : "none";
            });
            var colLeft = document.getElementById("gear-col-left");
            var colRight = document.getElementById("gear-col-right");
            [colLeft, colRight].forEach(function(col) {
                if (!col) return;
                col.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                    if (recipeId === "all") { row.style.display = "flex"; return; }
                    row.style.display = row.dataset.recipes.split(",").indexOf(recipeId) !== -1 ? "flex" : "none";
                });
                col.querySelectorAll(".gear-filterable").forEach(function(panel) {
                    var anyVisible = false;
                    panel.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) { if (row.style.display !== "none") anyVisible = true; });
                    panel.style.display = anyVisible ? "" : "none";
                });
            });
            localStorage.setItem(config.recipeStorageKey, recipeId);
        }

        return { computeIngCost: computeIngCost, calculate: calculate, selectRecipe: selectRecipe };
    }

    global.AppGearLogic = { createGearLogic: createGearLogic };
})(window);
