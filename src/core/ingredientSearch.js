(function(global) {
    "use strict";

    function createIngredientSearch(config) {
        var data = config.data;
        var getters = config.getters;
        var actions = config.actions;

        var index = null;

        function buildIndex() {
            var out = {};
            function add(itemName, entry) {
                var key = itemName.toLowerCase();
                if (!out[key]) out[key] = { displayName: itemName, recipes: [] };
                var dup = out[key].recipes.some(function(r) { return r.recipeId === entry.recipeId && r.tab === entry.tab; });
                if (!dup) out[key].recipes.push(entry);
            }

            data.alchemyRecipes().forEach(function(r) {
                r.ingredients.forEach(function(ing) {
                    add(ing.item, { recipeId: r.id, recipeName: r.name, tab: "alchemy", tabLabel: "Alchemy", qty: ing.qty });
                    if (ing.craftFrom && ing.craftFrom.item) add(ing.craftFrom.item, { recipeId: r.id, recipeName: r.name, tab: "alchemy", tabLabel: "Alchemy", qty: ing.craftFrom.qty * ing.qty, viaItem: ing.item });
                });
            });
            data.allGearRecipes().forEach(function(r) {
                r.ingredients.forEach(function(ing) {
                    if (ing.type === "bop") return;
                    add(ing.item, { recipeId: r.id, recipeName: r.name, tab: "gear", tabLabel: "Tailoring Gear", qty: ing.qty });
                    if (ing.craftFrom && ing.craftFrom.item) add(ing.craftFrom.item, { recipeId: r.id, recipeName: r.name, tab: "gear", tabLabel: "Tailoring Gear", qty: ing.craftFrom.qty * ing.qty, viaItem: ing.item });
                    if (ing.craftFrom && ing.craftFrom.mats) {
                        ing.craftFrom.mats.forEach(function(mat) {
                            if (mat.type === "vendor") return;
                            add(mat.item, { recipeId: r.id, recipeName: r.name, tab: "gear", tabLabel: "Tailoring Gear", qty: mat.qty * ing.qty, viaItem: ing.item });
                        });
                    }
                });
            });
            data.cookingRecipes().forEach(function(r) { r.ingredients.forEach(function(ing) { add(ing.item, { recipeId: r.id, recipeName: r.name, tab: "cooking", tabLabel: "Cooking", qty: ing.qty }); }); });
            data.transmuteRecipes().forEach(function(r) {
                r.ingredients.forEach(function(ing) {
                    if (ing.type === "primal") {
                        var p = data.txPrimals().find(function(x) { return x.id === ing.primalId; });
                        if (p) { add(p.primal, { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty }); add(p.mote, { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty * 10, viaItem: p.primal }); }
                    } else if (ing.type === "gem") add(ing.item, { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty });
                });
            });
            data.clothDailies().forEach(function(r) {
                r.ingredients.forEach(function(ing) {
                    if (ing.type === "imbued_bolt") {
                        add("Bolt of Imbued Netherweave", { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty });
                        add("Bolt of Netherweave", { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty * 3, viaItem: "Bolt of Imbued Netherweave" });
                        add("Netherweave Cloth", { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty * 18, viaItem: "Bolt of Imbued Netherweave" });
                        add("Arcane Dust", { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty * 2, viaItem: "Bolt of Imbued Netherweave" });
                    } else if (ing.type === "primal") {
                        var p = data.txPrimals().find(function(x) { return x.id === ing.primalId; });
                        if (p) { add(p.primal, { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty }); add(p.mote, { recipeId: r.id, recipeName: r.name, tab: "tx", tabLabel: "Transmutes / Dailies", qty: ing.qty * 10, viaItem: p.primal }); }
                    }
                });
            });
            data.enchantingRecipes().forEach(function(r) { r.ingredients.forEach(function(ing) { add(ing.item, { recipeId: r.id, recipeName: r.name, tab: "enchanting", tabLabel: "Enchanting", qty: ing.qty }); }); });
            data.lwRecipes().forEach(function(r) {
                r.ingredients.forEach(function(ing) {
                    if (ing.type === "bop") return;
                    add(ing.item, { recipeId: r.id, recipeName: r.name, tab: "leatherworking", tabLabel: "Leatherworking", qty: ing.qty });
                    if (ing.craftFrom && ing.craftFrom.item) add(ing.craftFrom.item, { recipeId: r.id, recipeName: r.name, tab: "leatherworking", tabLabel: "Leatherworking", qty: ing.craftFrom.qty * ing.qty, viaItem: ing.item });
                });
            });
            index = out;
            return out;
        }

        function getProfit(tab, recipeId) {
            return getters.getProfit(tab, recipeId);
        }

        function getIngredients(tab, recipeId) {
            return getters.getIngredients(tab, recipeId);
        }

        function gotoRecipe(tab, recipeId) {
            close();
            actions.gotoRecipe(tab, recipeId);
        }

        function open() {
            if (!index) buildIndex();
            var ov = document.getElementById("is-overlay");
            if (ov) ov.classList.add("open");
            var inp = document.getElementById("is-input");
            if (inp) { inp.value = ""; inp.focus(); }
            var resultsEl = document.getElementById("is-results");
            if (resultsEl) resultsEl.innerHTML = '<div class="is-empty">Type an ingredient name to find which recipes use it.</div>';
        }

        function close() {
            var ov = document.getElementById("is-overlay");
            if (ov) ov.classList.remove("open");
        }

        function run() {
            if (!index) buildIndex();
            var query = ((document.getElementById("is-input") || {}).value || "").trim().toLowerCase();
            var resultsEl = document.getElementById("is-results");
            if (!resultsEl) return;
            if (!query) { resultsEl.innerHTML = '<div class="is-empty">Type an ingredient name to find which recipes use it.</div>'; return; }
            var matches = [];
            for (var key in index) if (key.indexOf(query) !== -1) matches.push(index[key]);
            matches.sort(function(a, b) {
                var ai = a.displayName.toLowerCase().indexOf(query);
                var bi = b.displayName.toLowerCase().indexOf(query);
                if (ai !== bi) return ai - bi;
                return a.displayName.localeCompare(b.displayName);
            });
            if (!matches.length) { resultsEl.innerHTML = '<div class="is-empty">No ingredients found matching “' + query + '”.</div>'; return; }
            var html = "";
            matches.forEach(function(item) {
                html += '<div class="is-item-group"><div style="padding:6px 18px 3px;font-size:0.78em;color:#a78bfa;font-weight:bold;letter-spacing:0.3px;text-transform:uppercase;">' + item.displayName + "</div>";
                item.recipes.forEach(function(rec) {
                    var profit = getProfit(rec.tab, rec.recipeId);
                    var profitHtml = profit !== null ? '<span class="is-profit ' + getters.profitClass(profit) + '">' + (profit >= 0 ? "+" : "") + getters.gold(profit) + "</span>" : '<span class="is-profit" style="color:#555">—</span>';
                    var viaHtml = rec.viaItem ? ' <span style="color:#555;font-size:0.78em">via ' + rec.viaItem + "</span>" : "";
                    var ingListHtml = getIngredients(rec.tab, rec.recipeId).map(function(i) { return "<span>" + i + "</span>"; }).join(" &nbsp;·&nbsp; ");
                    var craftCostVal = getters.getCraftCost(rec.tab, rec.recipeId);
                    var statsHtml = craftCostVal !== null ? '<div class="is-detail-stats"><span>Cost: <b>' + getters.gold(craftCostVal) + "</b></span><span>Profit: <b>" + (profit !== null ? (profit >= 0 ? "+" : "") + getters.gold(profit) : "—") + "</b></span></div>" : "";
                    var gotoTab = rec.tab === "gear" ? "gear" : rec.tab;
                    var gotoBtnHtml = '<button class="is-goto-btn" onclick="ingGotoRecipe(\'' + gotoTab + "','" + rec.recipeId + '\');event.stopPropagation();">→ Go to recipe</button>';
                    html += '<div class="is-recipe-row" onclick="this.classList.toggle(\'open\')"><div class="is-recipe-hdr"><span class="is-recipe-name">' + rec.recipeName + viaHtml + '</span><span class="ev-tab-badge">' + rec.tabLabel + '</span><span class="is-qty">×' + rec.qty + "</span>" + profitHtml + '<span class="is-arrow">▶</span></div><div class="is-recipe-detail"><div class="is-detail-ings">' + ingListHtml + "</div>" + statsHtml + gotoBtnHtml + "</div></div>";
                });
                html += "</div>";
            });
            resultsEl.innerHTML = html;
        }

        return { buildIndex: buildIndex, open: open, close: close, run: run, gotoRecipe: gotoRecipe };
    }

    global.AppIngredientSearch = { createIngredientSearch: createIngredientSearch };
})(window);
