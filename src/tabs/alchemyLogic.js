(function(global) {
    "use strict";

    function createAlchemyLogic(config) {
        function getHiddenRecipes() {
            try { return JSON.parse(localStorage.getItem(config.hiddenKey)) || {}; }
            catch (e) { return {}; }
        }

        function setHiddenRecipes(hidden) {
            localStorage.setItem(config.hiddenKey, JSON.stringify(hidden));
        }

        function selectRecipe(recipeId) {
            var validRecipe = recipeId === "all" || config.recipes.some(function(r) { return r.id === recipeId; });
            if (!validRecipe) recipeId = "all";
            var dropdown = document.getElementById("recipe-dropdown");
            config.syncDropdown("#recipe-dropdown", "recipe-dropdown-label", recipeId);
            if (dropdown) dropdown.classList.remove("open");
            var backBtn = document.getElementById("alch-recipe-back");
            if (backBtn) backBtn.style.display = recipeId === "all" ? "none" : "";
            var allView = document.getElementById("alch-view-all");
            if (allView) allView.style.display = recipeId === "all" ? "" : "none";
            config.recipes.forEach(function(r) {
                var view = document.getElementById("alch-view-" + r.id);
                if (view) view.style.display = r.id === recipeId ? "" : "none";
            });
            var alchTab = document.getElementById("tab-alchemy");
            alchTab.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                if (recipeId === "all") row.style.display = "flex";
                else row.style.display = row.dataset.recipes.split(",").indexOf(recipeId) !== -1 ? "flex" : "none";
            });
            alchTab.querySelectorAll(".alch-filterable").forEach(function(panel) {
                var anyVisible = false;
                panel.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) { if (row.style.display !== "none") anyVisible = true; });
                panel.style.display = anyVisible ? "" : "none";
            });
            localStorage.setItem(config.recipeStorageKey, recipeId);
        }

        function applyHiddenRecipes() {
            var hidden = getHiddenRecipes();
            document.querySelectorAll("#recipe-dropdown .recipe-item[data-recipe]").forEach(function(el) {
                if (el.dataset.recipe === "all") return;
                el.classList.toggle("recipe-hidden", !!hidden[el.dataset.recipe]);
            });
            var currentRecipe = localStorage.getItem(config.recipeStorageKey);
            if (currentRecipe && currentRecipe !== "all" && hidden[currentRecipe]) selectRecipe("all");
            calculate();
        }

        function toggleManageCat(includesStr, doHide) {
            var includes = includesStr.split(",");
            var hidden = getHiddenRecipes();
            config.recipes.filter(function(r) { return includes.indexOf(r.category) !== -1; }).forEach(function(r) {
                if (doHide) hidden[r.id] = true;
                else delete hidden[r.id];
                var cb = document.querySelector("[data-recipe-manage=\"" + r.id + "\"]");
                if (cb) cb.checked = !doHide;
            });
            setHiddenRecipes(hidden);
            applyHiddenRecipes();
        }

        function setBatch(size) {
            config.setBatchSize(size);
            localStorage.setItem(config.batchKey, size);
            document.querySelectorAll(".alch-batch-btn").forEach(function(b) {
                b.classList.toggle("active", parseInt(b.dataset.batch, 10) === size);
            });
            var costHdr = document.getElementById("alch-hdr-cost");
            var revHdr = document.getElementById("alch-hdr-revenue");
            var noteEl = document.getElementById("alch-batch-note");
            if (size === 1) {
                if (costHdr) costHdr.textContent = "Craft Cost";
                if (revHdr) revHdr.textContent = "Sale Price";
                if (noteEl) noteEl.textContent = "";
            } else {
                if (costHdr) costHdr.textContent = "Total Cost";
                if (revHdr) revHdr.textContent = "Total Revenue";
                if (noteEl) noteEl.textContent = "\u00d7" + size + " crafts \u00b7 " + config.getProcRate() + "% proc";
            }
            calculate();
        }

        function calculate() {
            var ahCutPct = config.getVal("alch_ah_cut") / 100;
            var results = [];
            config.recipes.forEach(function(r) {
                var craftCost = 0;
                r.ingredients.forEach(function(ing) {
                    var baseId = "alch_" + r.id + "_ing_" + config.sanitizeId(ing.item);
                    var ingCost;
                    if (ing.craftFrom) {
                        var buyPrice = config.getVal("alch_mat_" + config.sanitizeId(ing.item));
                        var motePrice = config.getVal("alch_mat_" + config.sanitizeId(ing.craftFrom.item));
                        var buyCost = buyPrice * ing.qty;
                        var moteCost = motePrice * ing.craftFrom.qty * ing.qty;
                        var useMotes = moteCost < buyCost;
                        ingCost = useMotes ? moteCost : buyCost;
                        var buyLabel = document.getElementById(baseId + "_buy_label");
                        var buyPriceEl = document.getElementById(baseId + "_buy_price");
                        var craftLabel = document.getElementById(baseId + "_craft_label");
                        var craftPriceEl = document.getElementById(baseId + "_craft_price");
                        if (buyLabel) {
                            buyLabel.className = "opt" + (!useMotes ? " active" : "");
                            buyPriceEl.className = "opt" + (!useMotes ? " active" : "");
                            buyPriceEl.innerHTML = config.gold(buyCost) + (!useMotes ? "<span class=\"using\">USING</span>" : "");
                            craftLabel.className = "opt" + (useMotes ? " active" : "");
                            craftPriceEl.className = "opt" + (useMotes ? " active" : "");
                            craftPriceEl.innerHTML = config.gold(moteCost) + (useMotes ? "<span class=\"using\">USING</span>" : "");
                        }
                    } else {
                        var price = ing.type === "ah" ? config.getVal("alch_mat_" + config.sanitizeId(ing.item)) : config.getVal("alch_vendor_" + config.sanitizeId(ing.item));
                        ingCost = (price || 0) * ing.qty;
                        var costEl = document.getElementById(baseId);
                        if (costEl) costEl.textContent = config.gold(ingCost);
                    }
                    craftCost += ingCost;
                });
                var salePrice = config.getVal("alch_sale_" + r.id);
                var ahCut = salePrice * ahCutPct;
                var deposit = config.getVal("alch_deposit_" + r.id);
                var profit = salePrice - ahCut - craftCost;
                var el = function(id) { return document.getElementById(id); };
                var craftEl = el("alch_" + r.id + "_craft_cost"); if (craftEl) craftEl.textContent = config.gold(craftCost);
                var saleEl = el("alch_" + r.id + "_sale_display"); if (saleEl) saleEl.textContent = config.gold(salePrice);
                var cutEl = el("alch_" + r.id + "_ah_cut_display"); if (cutEl) cutEl.textContent = config.gold(ahCut);
                var profitEl = el("alch_" + r.id + "_profit");
                if (profitEl) profitEl.innerHTML = "<span class=\"" + config.profitClass(profit) + "\">" + (profit >= 0 ? "+" : "") + config.gold(profit) + "</span>";
                var depositEl = el("alch_" + r.id + "_deposit_note"); if (depositEl) depositEl.textContent = "Deposit: " + config.gold(deposit) + " (lost if unsold)";
                results.push({ recipe: r, craftCost: craftCost, salePrice: salePrice, profit: profit });
            });

            config.setResults(results);
            config.procModalUpdate();
            results.forEach(function(r) { if (r.recipe.category !== "transmute") config.procInlineUpdate(r.recipe.id); });
            config.evCalculate();
            var hidden = getHiddenRecipes();
            var visibleResults = results.filter(function(r) { return !hidden[r.recipe.id]; });
            var batchAhCutPct = config.getVal("alch_ah_cut") / 100;
            if (config.getBatchSize() > 1) {
                visibleResults.forEach(function(r) {
                    var procMult = r.recipe.category !== "transmute" ? (1 + config.getProcRate() / 100) : 1;
                    r._batchCost = r.craftCost * config.getBatchSize();
                    r._batchProfit = r.salePrice * (1 - batchAhCutPct) * config.getBatchSize() * procMult - r._batchCost;
                });
                config.sortResults(visibleResults, config.getSortBy(), "_batchProfit", "_batchCost");
            } else config.sortResults(visibleResults, config.getSortBy());

            var tbody = "";
            visibleResults.forEach(function(r) {
                var isProcRecipe = r.recipe.category !== "transmute";
                var procMult2 = (config.getBatchSize() > 1 && isProcRecipe) ? (1 + config.getProcRate() / 100) : 1;
                var displayCost = r.craftCost * config.getBatchSize();
                var displayRev = config.getBatchSize() === 1 ? r.salePrice : r.salePrice * (1 - batchAhCutPct) * config.getBatchSize() * procMult2;
                var displayProfit = config.getBatchSize() === 1 ? r.profit : displayRev - displayCost;
                var cls = config.profitClass(displayProfit);
                var pct = config.profitPctStr(displayProfit, displayCost);
                var procBtnHtml = isProcRecipe ? "<button class=\"proc-btn\" data-recipe=\"" + r.recipe.id + "\" onclick=\"openProcModal('" + r.recipe.id + "');event.stopPropagation()\">Proc</button>" : "";
                tbody += "<tr class=\"alch-summary-row\" data-recipe=\"" + r.recipe.id + "\">" +
                    "<td>" + config.stalenessDotHtml(config.getStalenessInputs(r.recipe)) + r.recipe.name + procBtnHtml + "</td>" +
                    "<td>" + config.gold(displayCost) + "</td>" +
                    "<td>" + config.gold(displayRev) + "</td>" +
                    "<td class=\"" + cls + "\">" + (displayProfit >= 0 ? "+" : "") + config.gold(displayProfit) + "</td>" +
                    "<td class=\"" + cls + "\">" + pct + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "daily") + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(r.recipe.id, "avgPrice") + "</td>" +
                "</tr>";
            });
            var summaryBody = document.getElementById("alch-summary-body");
            if (summaryBody && !(summaryBody.contains(document.activeElement) && document.activeElement.classList.contains("tsm-input"))) summaryBody.innerHTML = tbody;
            config.saveToStorage();
        }

        return {
            setBatch: setBatch,
            getHiddenRecipes: getHiddenRecipes,
            setHiddenRecipes: setHiddenRecipes,
            applyHiddenRecipes: applyHiddenRecipes,
            toggleManageCat: toggleManageCat,
            calculate: calculate,
            selectRecipe: selectRecipe
        };
    }

    global.AppAlchemyLogic = { createAlchemyLogic: createAlchemyLogic };
})(window);
