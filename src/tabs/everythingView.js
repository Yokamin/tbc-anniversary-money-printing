(function(global) {
    "use strict";

    function buildSections(data) {
        return [
            {
                tabId: "gear",
                tabLabel: "Tailoring Gear",
                cats: [{
                    catId: "gear_bags",
                    catLabel: "Tailoring Bags",
                    items: [
                        { id: "bags_nw_bag", name: "Netherweave Bag" },
                        { id: "bags_imbued_bag", name: "Imbued Netherweave Bag" }
                    ]
                }].concat(data.gearCategoryOrder.map(function(cat) {
                    return {
                        catId: "gear_" + cat.includes[0],
                        catLabel: cat.label,
                        items: data.gearRecipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; })
                            .map(function(r) { return { id: "gear_" + r.id, name: r.name }; })
                    };
                }).filter(function(cat) { return cat.items.length > 0; }))
            },
            {
                tabId: "alchemy",
                tabLabel: "Alchemy",
                cats: data.alchemyCategoryOrder.map(function(cat) {
                    return {
                        catId: "alch_" + cat.includes[0],
                        catLabel: cat.label,
                        items: data.alchemyRecipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; })
                            .map(function(r) { return { id: "alch_" + r.id, name: r.name }; })
                    };
                }).filter(function(cat) { return cat.items.length > 0; })
            },
            {
                tabId: "tx",
                tabLabel: "Transmutes / Dailies",
                cats: [
                    { catId: "tx_mote_primal", catLabel: "Mote -> Primal", items: data.txPrimals.map(function(p) { return { id: "tx_primal_" + p.id, name: p.primal }; }) },
                    { catId: "tx_planar", catLabel: "Planar Essence", items: [{ id: "tx_planar_essence", name: "3x Lesser -> Greater Planar" }] },
                    { catId: "tx_transmutes", catLabel: "Transmutes", items: data.transmuteRecipes.map(function(r) { return { id: "tx_" + r.id, name: r.name }; }) },
                    { catId: "tx_cloth", catLabel: "Cloth Dailies", items: data.clothDailies.map(function(r) { return { id: "tx_" + r.id, name: r.name }; }) }
                ]
            },
            {
                tabId: "cooking",
                tabLabel: "Cooking",
                cats: data.cookingCategoryOrder.map(function(cat) {
                    return {
                        catId: "cook_" + cat.includes[0],
                        catLabel: cat.label,
                        items: data.cookingRecipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; })
                            .map(function(r) { return { id: "cook_" + r.id, name: r.name }; })
                    };
                }).filter(function(cat) { return cat.items.length > 0; })
            },
            {
                tabId: "enchanting",
                tabLabel: "Enchanting",
                cats: data.enchantingCategoryOrder.map(function(cat) {
                    return {
                        catId: "ench_" + cat.includes[0],
                        catLabel: cat.label,
                        items: data.enchantingRecipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; })
                            .map(function(r) { return { id: "ench_" + r.id, name: r.name }; })
                    };
                }).filter(function(cat) { return cat.items.length > 0; })
            },
            {
                tabId: "leatherworking",
                tabLabel: "Leatherworking",
                cats: data.lwCategoryOrder.map(function(cat) {
                    return {
                        catId: "lw_" + cat.includes[0],
                        catLabel: cat.label,
                        items: data.lwRecipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; })
                            .map(function(r) { return { id: "lw_" + r.id, name: r.name }; })
                    };
                }).filter(function(cat) { return cat.items.length > 0; })
            }
        ];
    }

    function buildFilterHTML(sections, hidden) {
        var html = "";
        sections.forEach(function(section) {
            var tabHid = !!hidden["tab_" + section.tabId];
            html += '<div class="ev-ftree-tab">';
            html += '<label><input type="checkbox"' + (!tabHid ? " checked" : "") + ' onchange="evToggleTab(\'' + section.tabId + '\')"> ' + section.tabLabel + '</label>';
            html += '<div class="ev-ftree-cats">';
            section.cats.forEach(function(cat) {
                var catHid = !!hidden["cat_" + cat.catId];
                var catChecked = !tabHid && !catHid;
                html += '<div class="ev-ftree-cat">';
                html += '<label><input type="checkbox"' + (catChecked ? " checked" : "") + (tabHid ? " disabled" : "") + ' onchange="evToggleCat(\'' + cat.catId + '\')"> ' + cat.catLabel + '</label>';
                html += '<div class="ev-ftree-items">';
                cat.items.forEach(function(item) {
                    var itemHid = !!hidden["item_" + item.id];
                    var itemChecked = !tabHid && !catHid && !itemHid;
                    html += '<div class="ev-ftree-item"><label><input type="checkbox"' + (itemChecked ? " checked" : "") + ((tabHid || catHid) ? " disabled" : "") + ' onchange="evToggleItem(\'' + item.id + '\')"> ' + item.name + '</label></div>';
                });
                html += "</div></div>";
            });
            html += "</div></div>";
        });
        return html;
    }

    function getFilterOverlayHtml() {
        return '<div class="ev-filter-overlay" id="ev-filter-overlay"><div class="ev-filter-modal"><div class="ev-filter-hdr"><span class="ev-filter-title">Filter Recipes</span><button class="ev-filter-close-btn" onclick="closeEvFilter()">\u00d7</button></div><div class="ev-filter-body" id="ev-filter-body"></div><div class="ev-filter-footer"><button class="ev-filter-reset-btn" onclick="evResetFilter()">Show All</button></div></div></div>';
    }

    function categoryInfo(order, prefix, category) {
        var catInfo = order.find(function(c) { return c.includes.indexOf(category) !== -1; });
        return {
            catId: prefix + (catInfo ? catInfo.includes[0] : category),
            catLabel: catInfo ? catInfo.label : category
        };
    }

    function pushRecipeRows(rows, results, cfg) {
        results.forEach(function(r) {
            if (cfg.skip && cfg.skip(r)) return;
            var cat = categoryInfo(cfg.categoryOrder, cfg.prefix, r.recipe.category);
            rows.push({
                id: cfg.idPrefix + r.recipe.id,
                name: r.recipe.name,
                tab: cfg.tab,
                tabLabel: cfg.tabLabel,
                catId: cat.catId,
                catLabel: cat.catLabel,
                craftCost: r.craftCost,
                revenue: r.salePrice * (1 - cfg.ahCut),
                profit: r.profit,
                tsmTab: cfg.tsmTab,
                tsmId: r.recipe.id
            });
        });
    }

    global.AppEverythingView = {
        buildSections: buildSections,
        buildFilterHTML: buildFilterHTML,
        getFilterOverlayHtml: getFilterOverlayHtml,
        categoryInfo: categoryInfo,
        pushRecipeRows: pushRecipeRows
    };
})(window);
