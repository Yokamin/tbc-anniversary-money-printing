(function(global) {
    "use strict";

    function createEverythingLogic(config) {
        function getTsm(tsmTab, tsmId, field) {
            var tsm = config.getTsmMap(tsmTab);
            if (!tsm || !tsmId || !tsm[tsmId]) return null;
            return tsm[tsmId][field] != null ? tsm[tsmId][field] : null;
        }

        function rowHtml(row) {
            var cls = config.profitClass(row.profit);
            var pct = config.profitPctStr(row.profit, row.craftCost);
            var daily = getTsm(row.tsmTab, row.tsmId, "daily");
            var avg = getTsm(row.tsmTab, row.tsmId, "avgPrice");
            return "<tr>" +
                "<td>" + row.name + " <span class=\"ev-tab-badge\">" + row.tabLabel + "</span></td>" +
                "<td>" + config.gold(row.craftCost) + "</td>" +
                "<td>" + config.gold(row.revenue) + "</td>" +
                "<td class=\"" + cls + "\">" + (row.profit >= 0 ? "+" : "") + config.gold(row.profit) + "</td>" +
                "<td class=\"" + cls + "\">" + pct + "</td>" +
                "<td>" + (daily != null ? daily : "\u2014") + "</td>" +
                "<td>" + (avg != null ? config.gold(avg) : "\u2014") + "</td>" +
            "</tr>";
        }

        function calculate() {
            var body = document.getElementById("ev-body");
            if (!body) return;
            var rows = [];
            var hidden = config.getHiddenRecipes();

            config.pushRows(rows, config.getGearResults(), {
                categoryOrder: config.getGearCategoryOrder(),
                prefix: "gear_", idPrefix: "gear_", tab: "gear", tabLabel: "Tailoring Gear",
                ahCut: config.getVal("gear_ah_cut") / 100, tsmTab: "gear"
            });
            config.pushRows(rows, config.getAlchResults(), {
                categoryOrder: config.getAlchCategoryOrder(),
                prefix: "alch_", idPrefix: "alch_", tab: "alchemy", tabLabel: "Alchemy",
                ahCut: config.getVal("alch_ah_cut") / 100, tsmTab: "alch",
                skip: function(r) { return hidden[r.recipe.id]; }
            });

            config.getTxSummaryRows().forEach(function(row) {
                var catId, catLabel, itemId;
                if (row.primalId) { catId = "tx_mote_primal"; catLabel = "Mote \u2192 Primal"; itemId = "tx_primal_" + row.primalId; }
                else if (row.recipeId === "planar_essence") { catId = "tx_planar"; catLabel = "Planar Essence"; itemId = "tx_planar_essence"; }
                else if (config.isTransmuteRecipe(row.recipeId)) { catId = "tx_transmutes"; catLabel = "Transmutes"; itemId = "tx_" + row.recipeId; }
                else { catId = "tx_cloth"; catLabel = "Cloth Dailies"; itemId = "tx_" + row.recipeId; }
                rows.push({ id: itemId, name: row.label, tab: "tx", tabLabel: "Transmutes / Dailies", catId: catId, catLabel: catLabel, craftCost: row.cost, revenue: row.revenue, profit: row.profit, tsmTab: "tx", tsmId: row.recipeId });
            });

            var cookAhEl = document.getElementById("cook_ah_cut");
            config.pushRows(rows, config.getCookResults(), {
                categoryOrder: config.getCookCategoryOrder(),
                prefix: "cook_", idPrefix: "cook_", tab: "cooking", tabLabel: "Cooking",
                ahCut: cookAhEl ? parseFloat(cookAhEl.value) / 100 : 0.05, tsmTab: "cook"
            });
            var enchAhEl = document.getElementById("ench_ah_cut");
            config.pushRows(rows, config.getEnchResults(), {
                categoryOrder: config.getEnchCategoryOrder(),
                prefix: "ench_", idPrefix: "ench_", tab: "enchanting", tabLabel: "Enchanting",
                ahCut: enchAhEl ? parseFloat(enchAhEl.value) / 100 : 0.05, tsmTab: "ench"
            });
            var lwAhEl = document.getElementById("lw_ah_cut");
            config.pushRows(rows, config.getLwResults(), {
                categoryOrder: config.getLwCategoryOrder(),
                prefix: "lw_", idPrefix: "lw_", tab: "leatherworking", tabLabel: "Leatherworking",
                ahCut: lwAhEl ? parseFloat(lwAhEl.value) / 100 : 0.05, tsmTab: "lw"
            });

            var evHidden = config.getEvHidden();
            rows = rows.filter(function(row) {
                return !evHidden["tab_" + row.tab] && !evHidden["cat_" + row.catId] && !evHidden["item_" + row.id];
            });

            if (config.getEvView() === "sections") {
                var tabOrder = ["gear", "alchemy", "tx", "cooking", "enchanting", "leatherworking"];
                var html = "";
                tabOrder.forEach(function(tabId) {
                    var tabRows = rows.filter(function(r) { return r.tab === tabId; });
                    if (!tabRows.length) return;
                    config.sortResults(tabRows, config.getEvSortBy());
                    html += "<tr class=\"ev-section-hdr\"><td colspan=\"7\">" + tabRows[0].tabLabel + "</td></tr>";
                    tabRows.forEach(function(row) { html += rowHtml(row); });
                });
                body.innerHTML = html;
                return;
            }

            config.sortResults(rows, config.getEvSortBy());
            var html = "";
            rows.forEach(function(row) { html += rowHtml(row); });
            body.innerHTML = html;
        }

        return { getTsm: getTsm, rowHtml: rowHtml, calculate: calculate };
    }

    global.AppEverythingLogic = { createEverythingLogic: createEverythingLogic };
})(window);
