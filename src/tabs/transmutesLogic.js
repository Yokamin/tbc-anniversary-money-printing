(function(global) {
    "use strict";

    function createTransmutesLogic(config) {
        function getVal(id) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : 0; }
        function setHtml(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }
        function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }

        function calculate() {
            var ahCutEl = document.getElementById("tx_ah_cut");
            if (!ahCutEl) return;
            var ahCutPct = parseFloat(ahCutEl.value) / 100 || 0.05;

            var imbuedBoltAH = getVal("tx_imbued_bolt");
            var boltNwAH = getVal("tx_bolt_nw");
            var clothPrice = getVal("tx_cloth");
            var dustPrice = getVal("tx_dust");
            var boltNwCraft = clothPrice * 6;
            var boltNwBest = Math.min(boltNwAH, boltNwCraft);
            var imbuedCraft = boltNwBest * 3 + dustPrice * 2;
            var imbuedBest = Math.min(imbuedBoltAH, imbuedCraft);
            var useImbuedCraft = imbuedCraft < imbuedBoltAH;

            var summaryRows = [];
            config.setSummaryRows(summaryRows);

            var primalDeposit = getVal("tx_deposit_primal");
            var moteTableBody = "";
            config.txPrimals.forEach(function(p) {
                var moteCost = getVal("tx_mote_" + p.id) * 10;
                var primalPrice = getVal("tx_primal_" + p.id);
                var revenue = primalPrice * (1 - ahCutPct);
                var profit = revenue - moteCost;
                var cls = config.profitClass(profit);
                moteTableBody += "<tr class=\"tx-summary-row\" data-recipe=\"mote_primals\">" +
                    "<td>" + config.stalenessDotHtml(config.getStalenessInputs("mote_primals", p.id)) + p.primal + "</td>" +
                    "<td>" + config.gold(moteCost) + "</td>" +
                    "<td>" + config.gold(primalPrice) + "</td>" +
                    "<td>" + config.gold(revenue) + "</td>" +
                    "<td style=\"color:#888\">" + config.gold(primalDeposit) + "</td>" +
                    "<td class=\"" + cls + "\">" + (profit >= 0 ? "+" : "") + config.gold(profit) + "</td>" +
                "</tr>";
                if (moteCost > 0 || primalPrice > 0) summaryRows.push({ label: p.primal, cost: moteCost, revenue: revenue, profit: profit, recipeId: "mote_primals", primalId: p.id });
            });
            var moteEl = document.getElementById("tx-mote-table-body");
            if (moteEl) moteEl.innerHTML = moteTableBody;

            var lesserCost = getVal("tx_lesser_planar") * 3;
            var greaterSell = getVal("tx_greater_planar");
            var planarRev = greaterSell * (1 - ahCutPct);
            var planarProf = planarRev - lesserCost;
            setText("tx_planar_lesser_cost", config.gold(lesserCost));
            setText("tx_planar_craft_cost", config.gold(lesserCost));
            setText("tx_planar_sale", config.gold(greaterSell));
            setText("tx_planar_ah_cut", config.gold(greaterSell * ahCutPct));
            setHtml("tx_planar_profit", "<span class=\"" + config.profitClass(planarProf) + "\">" + (planarProf >= 0 ? "+" : "") + config.gold(planarProf) + "</span>");
            var planarBody = "<tr class=\"tx-summary-row\" data-recipe=\"planar_essence\">" +
                "<td>" + config.stalenessDotHtml(config.getStalenessInputs("planar_essence")) + "3\u00d7 Lesser \u2192 Greater Planar</td>" +
                "<td>" + config.gold(lesserCost) + "</td>" +
                "<td>" + config.gold(greaterSell) + "</td>" +
                "<td>" + config.gold(planarRev) + "</td>" +
                "<td class=\"" + config.profitClass(planarProf) + "\">" + (planarProf >= 0 ? "+" : "") + config.gold(planarProf) + "</td>" +
            "</tr>";
            var planarInlineEl = document.getElementById("tx-planar-inline-body");
            if (planarInlineEl) planarInlineEl.innerHTML = planarBody;
            summaryRows.push({ label: "Planar Essence", cost: lesserCost, revenue: planarRev, profit: planarProf, recipeId: "planar_essence" });

            config.transmuteRecipes.forEach(function(r) {
                var craftCost = 0;
                r.ingredients.forEach(function(ing) {
                    var baseId = "tx_" + r.id + "_ing_" + config.sanitizeId(ing.item);
                    if (ing.type === "primal") {
                        var buyPrice = getVal("tx_primal_" + ing.primalId) * ing.qty;
                        var p = config.txPrimals.find(function(pr) { return pr.id === ing.primalId; });
                        var motePrice = p ? getVal("tx_mote_" + ing.primalId) * 10 * ing.qty : buyPrice;
                        var useMotes = motePrice < buyPrice;
                        craftCost += useMotes ? motePrice : buyPrice;
                        var buyLbl = document.getElementById(baseId + "_buy_label");
                        if (buyLbl) {
                            var buyPEl = document.getElementById(baseId + "_buy_price");
                            var craftLbl = document.getElementById(baseId + "_craft_label");
                            var craftPEl = document.getElementById(baseId + "_craft_price");
                            buyLbl.className = "opt" + (!useMotes ? " active" : "");
                            buyPEl.className = "opt" + (!useMotes ? " active" : "");
                            buyPEl.innerHTML = config.gold(buyPrice) + (!useMotes ? "<span class=\"using\">USING</span>" : "");
                            craftLbl.className = "opt" + (useMotes ? " active" : "");
                            craftPEl.className = "opt" + (useMotes ? " active" : "");
                            craftPEl.innerHTML = config.gold(motePrice) + (useMotes ? "<span class=\"using\">USING</span>" : "");
                        }
                    } else {
                        var gemCost = getVal("tx_gem_" + config.sanitizeId(ing.item)) * ing.qty;
                        craftCost += gemCost;
                        setText(baseId, config.gold(gemCost));
                    }
                });
                var salePrice = getVal("tx_sale_" + r.id);
                var ahCut = salePrice * ahCutPct;
                var deposit = getVal("tx_deposit_" + r.id);
                var profit = salePrice - ahCut - craftCost;
                setText("tx_" + r.id + "_craft_cost", config.gold(craftCost));
                setText("tx_" + r.id + "_sale_display", config.gold(salePrice));
                setText("tx_" + r.id + "_ah_cut_display", config.gold(ahCut));
                setHtml("tx_" + r.id + "_profit", "<span class=\"" + config.profitClass(profit) + "\">" + (profit >= 0 ? "+" : "") + config.gold(profit) + "</span>");
                setText("tx_" + r.id + "_deposit_note", "Deposit: " + config.gold(deposit) + " (lost if unsold)");
                summaryRows.push({ label: r.name + " (transmute)", cost: craftCost, revenue: salePrice - ahCut, profit: profit, recipeId: r.id });
            });

            config.clothDailies.forEach(function(r) {
                var craftCost = 0;
                r.ingredients.forEach(function(ing) {
                    var baseId = "tx_" + r.id + "_ing_" + config.sanitizeId(ing.item);
                    if (ing.type === "imbued_bolt") {
                        craftCost += imbuedBest;
                        var buyLbl = document.getElementById(baseId + "_buy_label");
                        if (buyLbl) {
                            var buyPEl = document.getElementById(baseId + "_buy_price");
                            var craftLbl = document.getElementById(baseId + "_craft_label");
                            var craftPEl = document.getElementById(baseId + "_craft_price");
                            buyLbl.className = "opt" + (!useImbuedCraft ? " active" : "");
                            buyPEl.className = "opt" + (!useImbuedCraft ? " active" : "");
                            buyPEl.innerHTML = config.gold(imbuedBoltAH) + (!useImbuedCraft ? "<span class=\"using\">USING</span>" : "");
                            craftLbl.className = "opt" + (useImbuedCraft ? " active" : "");
                            craftPEl.className = "opt" + (useImbuedCraft ? " active" : "");
                            craftPEl.innerHTML = config.gold(imbuedCraft) + (useImbuedCraft ? "<span class=\"using\">USING</span>" : "");
                            setText(baseId + "_bolt_cost", config.gold(boltNwBest * 3));
                            setText(baseId + "_dust_cost", config.gold(dustPrice * 2));
                        }
                    } else if (ing.type === "primal") {
                        var buyPrice2 = getVal("tx_primal_" + ing.primalId) * ing.qty;
                        var p2 = config.txPrimals.find(function(pr) { return pr.id === ing.primalId; });
                        var motePrice2 = p2 ? getVal("tx_mote_" + ing.primalId) * 10 * ing.qty : buyPrice2;
                        var useMotes2 = motePrice2 < buyPrice2;
                        craftCost += useMotes2 ? motePrice2 : buyPrice2;
                        var buyLbl2 = document.getElementById(baseId + "_buy_label");
                        if (buyLbl2) {
                            var buyPEl2 = document.getElementById(baseId + "_buy_price");
                            var craftLbl2 = document.getElementById(baseId + "_craft_label");
                            var craftPEl2 = document.getElementById(baseId + "_craft_price");
                            buyLbl2.className = "opt" + (!useMotes2 ? " active" : "");
                            buyPEl2.className = "opt" + (!useMotes2 ? " active" : "");
                            buyPEl2.innerHTML = config.gold(buyPrice2) + (!useMotes2 ? "<span class=\"using\">USING</span>" : "");
                            craftLbl2.className = "opt" + (useMotes2 ? " active" : "");
                            craftPEl2.className = "opt" + (useMotes2 ? " active" : "");
                            craftPEl2.innerHTML = config.gold(motePrice2) + (useMotes2 ? "<span class=\"using\">USING</span>" : "");
                        }
                    }
                });
                var salePerUnit = getVal("tx_sale_" + r.id);
                var totalRevenue = salePerUnit * r.yieldQty * (1 - ahCutPct);
                var totalAhCut = salePerUnit * r.yieldQty * ahCutPct;
                var deposit2 = getVal("tx_deposit_" + r.id);
                var totalProfit = totalRevenue - craftCost;
                var profitPer = totalProfit / r.yieldQty;
                setText("tx_" + r.id + "_craft_cost", config.gold(craftCost));
                setText("tx_" + r.id + "_ah_cut_display", config.gold(totalAhCut));
                setHtml("tx_" + r.id + "_profit", "<span class=\"" + config.profitClass(totalProfit) + "\">" + (totalProfit >= 0 ? "+" : "") + config.gold(totalProfit) + "</span>");
                setText("tx_" + r.id + "_deposit_note", "Deposit: " + config.gold(deposit2) + " (lost if unsold)");
                if (r.yieldQty > 1) {
                    setText("tx_" + r.id + "_revenue", config.gold(totalRevenue));
                    setHtml("tx_" + r.id + "_profit_per", "<span class=\"" + config.profitClass(profitPer) + "\">" + (profitPer >= 0 ? "+" : "") + config.gold(profitPer) + "</span>");
                } else setText("tx_" + r.id + "_sale_display", config.gold(salePerUnit));
                var summaryLabel = r.name + (r.yieldQty > 1 ? " (\u00d7" + r.yieldQty + ")" : "");
                summaryRows.push({ label: summaryLabel, cost: craftCost, revenue: totalRevenue, profit: totalProfit, recipeId: r.id });
            });

            config.sortResults(summaryRows, config.getSortBy(), "profit", "cost");
            var tbody = "";
            summaryRows.forEach(function(row) {
                var cls2 = config.profitClass(row.profit);
                var pct2 = config.profitPctStr(row.profit, row.cost);
                tbody += "<tr class=\"tx-summary-row\" data-recipe=\"" + row.recipeId + "\">" +
                    "<td>" + config.stalenessDotHtml(config.getStalenessInputs(row.recipeId, row.primalId)) + row.label + "</td>" +
                    "<td>" + config.gold(row.cost) + "</td>" +
                    "<td>" + config.gold(row.revenue) + "</td>" +
                    "<td class=\"" + cls2 + "\">" + (row.profit >= 0 ? "+" : "") + config.gold(row.profit) + "</td>" +
                    "<td class=\"" + cls2 + "\">" + pct2 + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(row.recipeId, "daily") + "</td>" +
                    "<td onclick=\"event.stopPropagation()\">" + config.tsmInputHtml(row.recipeId, "avgPrice") + "</td>" +
                "</tr>";
            });
            var summaryBody = document.getElementById("tx-summary-body");
            if (summaryBody && !(summaryBody.contains(document.activeElement) && document.activeElement.classList.contains("tsm-input"))) summaryBody.innerHTML = tbody;
            config.saveToStorage();
            config.evCalculate();
        }

        function selectRecipe(recipeId) {
            var dropdown = document.getElementById("tx-recipe-dropdown");
            config.syncDropdown("#tx-recipe-dropdown", "tx-recipe-dropdown-label", recipeId);
            if (dropdown) dropdown.classList.remove("open");
            var backBtn = document.getElementById("tx-recipe-back");
            if (backBtn) backBtn.style.display = recipeId === "all" ? "none" : "";
            var allView = document.getElementById("tx-view-all");
            if (allView) allView.style.display = recipeId === "all" ? "" : "none";
            document.querySelectorAll(".tx-view").forEach(function(v) { v.style.display = v.id === "tx-view-" + recipeId ? "" : "none"; });
            var txTab = document.getElementById("tab-transmutes");
            txTab.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) {
                if (recipeId === "all") { row.style.display = "flex"; return; }
                row.style.display = row.dataset.recipes.split(",").indexOf(recipeId) !== -1 ? "flex" : "none";
            });
            txTab.querySelectorAll(".tx-filterable").forEach(function(panel) {
                var anyVisible = false;
                panel.querySelectorAll(".price-table-row[data-recipes]").forEach(function(row) { if (row.style.display !== "none") anyVisible = true; });
                panel.style.display = anyVisible ? "" : "none";
            });
            localStorage.setItem(config.recipeStorageKey, recipeId);
        }

        function generateExport() {
            function formatList(name, arr) {
                var seen = {}, unique = [];
                arr.forEach(function(item) { var k = item.toLowerCase(); if (!seen[k]) { seen[k] = true; unique.push(item); } });
                if (unique.length === 0) return null;
                return name + "^" + unique.map(function(i) { return "\"" + i + "\""; }).join("^");
            }
            function gearIngItems(ing) {
                if (ing.type === "bop" || ing.type === "vendor") return [];
                var items = [ing.item];
                if (ing.craftFrom) {
                    if (ing.craftFrom.item) items.push(ing.craftFrom.item);
                    else if (ing.craftFrom.mats) ing.craftFrom.mats.forEach(function(mat) { gearIngItems(mat).forEach(function(i) { items.push(i); }); });
                }
                return items;
            }
            function alchName(recipe) {
                var name = recipe.product || recipe.name;
                if (recipe.category === "elixir") return name.startsWith("Elixir ") ? name : "Elixir - " + name;
                if (recipe.category === "potion") return "Potion - " + name;
                if (recipe.category === "flask") return name.startsWith("Flask ") ? name : "Flask - " + name;
                if (recipe.category === "misc") return name;
                return name;
            }

            var lines = [];
            lines.push(formatList("1.0 ALL BAGS", config.bagsExportItems));
            var tailAll = [], bopAll = [];
            config.gearRecipes.forEach(function(r) {
                var items = [r.product || r.name];
                r.ingredients.forEach(function(ing) { gearIngItems(ing).forEach(function(i) { items.push(i); }); });
                items.forEach(function(i) { tailAll.push(i); });
                if (r.ingredients.some(function(i) { return i.type === "bop"; })) items.forEach(function(i) { bopAll.push(i); });
                lines.push(formatList("2.1 " + (r.product || r.name), items));
            });
            if (bopAll.length > 0) lines.push(formatList("2.1 ALL PRIMAL NETHER", bopAll));
            lines.push(formatList("2.0 ALL TAILORING", tailAll));
            var alchAll = [];
            ["elixir", "potion", "flask", "misc"].forEach(function(cat, idx) {
                var sub = ["3.1", "3.2", "3.3", "3.4"][idx];
                var allLbl = ["ALL ELIXIRS", "ALL POTIONS", "ALL FLASKS", "ALL MISC"][idx];
                var catItems = [];
                config.alchemyRecipes.filter(function(r) { return r.category === cat; }).forEach(function(r) {
                    var items = [r.product || r.name];
                    r.ingredients.forEach(function(ing) {
                        if (ing.type === "vendor" || ing.type === "bop") return;
                        items.push(ing.item);
                        if (ing.craftFrom && ing.craftFrom.item) items.push(ing.craftFrom.item);
                    });
                    items.forEach(function(i) { catItems.push(i); alchAll.push(i); });
                    lines.push(formatList(sub + " " + alchName(r), items));
                });
                lines.push(formatList(sub + " " + allLbl, catItems));
            });
            lines.push(formatList("3.0 ALL ALCHEMY", alchAll));
            var txAll = [];
            var moteItems = [];
            config.txPrimals.forEach(function(p) { moteItems.push(p.mote); moteItems.push(p.primal); });
            moteItems.push("Lesser Planar Essence"); moteItems.push("Greater Planar Essence");
            moteItems.forEach(function(i) { txAll.push(i); });
            lines.push(formatList("4.1 ALL MOTE TO PRIMALS", moteItems));
            var transmAll = [];
            config.transmuteRecipes.forEach(function(r) {
                var items = [r.product || r.name];
                r.ingredients.forEach(function(ing) {
                    items.push(ing.item);
                    if (ing.type === "primal") {
                        var p = config.txPrimals.find(function(pr) { return pr.id === ing.primalId; });
                        if (p) items.push(p.mote);
                    }
                });
                items.forEach(function(i) { transmAll.push(i); txAll.push(i); });
                lines.push(formatList("4.2 Transmute - " + (r.product || r.name), items));
            });
            lines.push(formatList("4.2 ALL TRANSMUTES", transmAll));
            var clothAll = [];
            config.clothDailies.forEach(function(r) {
                var items = [r.name];
                r.ingredients.forEach(function(ing) {
                    items.push(ing.item);
                    if (ing.type === "primal") {
                        var p = config.txPrimals.find(function(pr) { return pr.id === ing.primalId; });
                        if (p) items.push(p.mote);
                    }
                    if (ing.type === "imbued_bolt") { items.push("Bolt of Netherweave"); items.push("Netherweave Cloth"); items.push("Arcane Dust"); }
                });
                items.forEach(function(i) { clothAll.push(i); txAll.push(i); });
                lines.push(formatList("4.3 Cloth - " + r.name, items));
            });
            lines.push(formatList("4.3 ALL CLOTH DAILIES", clothAll));
            lines.push(formatList("4.0 ALL TRANSMUTES/DAILIES", txAll));

            var cookAll = [];
            config.cookingRecipes.forEach(function(r) {
                var items = [r.name];
                r.ingredients.forEach(function(ing) { if (ing.type !== "vendor") items.push(ing.item); });
                items.forEach(function(i) { cookAll.push(i); });
                lines.push(formatList("5.1 " + r.name, items));
            });
            lines.push(formatList("5.0 ALL COOKING", cookAll));

            var enchAll = [];
            config.enchantingCategoryOrder.forEach(function(cat, idx) {
                var sub = ["6.1", "6.2"][idx];
                var allLbl = ["ALL SHARDS", "ALL OILS"][idx];
                var catItems = [];
                config.enchantingRecipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; }).forEach(function(r) {
                    var items = [r.name];
                    r.ingredients.forEach(function(ing) { if (ing.type !== "vendor") items.push(ing.item); });
                    items.forEach(function(i) { catItems.push(i); enchAll.push(i); });
                    lines.push(formatList(sub + " " + r.name, items));
                });
                if (catItems.length > 0) lines.push(formatList(sub + " " + allLbl, catItems));
            });
            lines.push(formatList("6.0 ALL ENCHANTING", enchAll));

            var lwAll = [];
            config.lwRecipes.forEach(function(r) {
                var items = [r.name];
                r.ingredients.forEach(function(ing) {
                    if (ing.type === "vendor" || ing.type === "bop") return;
                    items.push(ing.item);
                    if (ing.craftFrom && ing.craftFrom.item) items.push(ing.craftFrom.item);
                });
                items.forEach(function(i) { lwAll.push(i); });
                lines.push(formatList("7.1 " + r.name, items));
            });
            lines.push(formatList("7.0 ALL LEATHERWORKING", lwAll));

            var everythingItems = [];
            config.bagsExportItems.forEach(function(i) { everythingItems.push(i); });
            tailAll.forEach(function(i) { everythingItems.push(i); });
            alchAll.forEach(function(i) { everythingItems.push(i); });
            txAll.forEach(function(i) { everythingItems.push(i); });
            cookAll.forEach(function(i) { everythingItems.push(i); });
            enchAll.forEach(function(i) { everythingItems.push(i); });
            lwAll.forEach(function(i) { everythingItems.push(i); });
            lines.unshift(formatList("0.0 EVERYTHING", everythingItems));

            var output = lines.filter(function(l) { return l; }).join("\n");
            var textarea = document.getElementById("global_export_output");
            if (textarea) textarea.value = output;
        }

        return { calculate: calculate, selectRecipe: selectRecipe, generateExport: generateExport };
    }

    global.AppTransmutesLogic = { createTransmutesLogic: createTransmutesLogic };
})(window);
