(function(global) {
    "use strict";

    function renderManageRecipesModal(recipes, categoryOrder, hidden) {
        var html = '<div class="recipe-manage-overlay" id="recipe-manage-overlay"><div class="recipe-manage-modal"><div class="recipe-manage-hdr"><h2>Manage Recipes</h2><button class="recipe-manage-close" id="recipe-manage-close">×</button></div><div class="recipe-manage-hint">Uncheck recipes you haven\'t unlocked yet.</div><div class="recipe-manage-scroll">';
        categoryOrder.forEach(function(cat) {
            var catRecipes = recipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; });
            if (catRecipes.length === 0) return;
            var incStr = cat.includes.join(",");
            html += '<div class="recipe-manage-cat-row"><span class="recipe-manage-cat">' + cat.label + '</span><span class="recipe-manage-cat-btns"><button class="recipe-manage-cat-btn" onclick="toggleManageCat(\'' + incStr + '\', false)">All</button><button class="recipe-manage-cat-btn" onclick="toggleManageCat(\'' + incStr + '\', true)">None</button></span></div>';
            catRecipes.forEach(function(r) {
                var checked = !hidden[r.id] ? " checked" : "";
                html += '<label class="recipe-manage-item"><input type="checkbox" data-recipe-manage="' + r.id + '"' + checked + ">" + r.name + "</label>";
            });
        });
        html += "</div></div></div>";
        return html;
    }

    function build(config) {
        var recipes = config.recipes;
        var categoryOrder = config.categoryOrder;
        var vendorDefaults = config.vendorDefaults;
        var nameToInput = config.nameToInput;
        var sanitizeId = config.sanitizeId;
        var locksKey = config.locksKey;
        var procRate = config.procRate;
        var hidden = config.hidden || {};

        var ahItemsSet = {};
        var vendorItemsSet = {};
        var itemToRecipes = {};
        recipes.forEach(function(r) {
            r.ingredients.forEach(function(ing) {
                if (ing.type === "ah") ahItemsSet[ing.item] = true;
                else if (ing.type === "vendor") vendorItemsSet[ing.item] = true;
                if (!itemToRecipes[ing.item]) itemToRecipes[ing.item] = [];
                itemToRecipes[ing.item].push(r.id);
                if (ing.craftFrom) {
                    ahItemsSet[ing.craftFrom.item] = true;
                    if (!itemToRecipes[ing.craftFrom.item]) itemToRecipes[ing.craftFrom.item] = [];
                    itemToRecipes[ing.craftFrom.item].push(r.id);
                }
            });
        });

        var transmuteItemsSet = {};
        recipes.forEach(function(r) {
            r.ingredients.forEach(function(ing) {
                if (ing.craftFrom) {
                    transmuteItemsSet[ing.item] = true;
                    transmuteItemsSet[ing.craftFrom.item] = true;
                }
            });
        });

        var allAhItems = Object.keys(ahItemsSet).sort();
        var regularAhItems = allAhItems.filter(function(i) { return !transmuteItemsSet[i]; });
        var transmuteAhItems = allAhItems.filter(function(i) { return transmuteItemsSet[i]; });
        var vendorItems = Object.keys(vendorItemsSet).sort();

        function alchTableRow(label, inputId, defaultValue, hasLock, recipeIds) {
            var recipesAttr = recipeIds ? ' data-recipes="' + recipeIds.join(",") + '"' : "";
            var lockHTML = hasLock ? '<button class="lock-btn" data-input="' + inputId + '" data-locks-key="' + locksKey + '">&#x1f513;</button>' : "";
            return '<div class="price-table-row"' + recipesAttr + ">" +
                '<span class="pt-name">' + label + "</span>" + lockHTML +
                '<div class="price-control"><input type="number" id="' + inputId + '" value="' + defaultValue + '" step="0.0001"></div>' +
                '<div class="gsc-group" data-input="' + inputId + '"><span class="gsc-val gold">0g</span><span class="gsc-val silver">0s</span><span class="gsc-val copper">0c</span></div>' +
            "</div>";
        }

        function collapsibleH2(label, panelId) {
            return '<h2 class="collapsible" data-panel="' + panelId + '">' + label + '<span class="collapse-arrow">&#9660;</span></h2>';
        }

        function buildRecipeDropdownHTML() {
            var html = '<div class="recipe-dropdown-wrapper">' +
                '<button class="recipe-back-btn" id="alch-recipe-back" style="display:none;" title="Back to all recipes">&#8592; All</button>' +
                '<div class="recipe-dropdown" id="recipe-dropdown">' +
                '<button class="recipe-dropdown-trigger" id="recipe-dropdown-trigger">' +
                    '<span id="recipe-dropdown-label">All (Profit Overview)</span>' +
                    '<span class="dd-arrow">&#9660;</span>' +
                "</button>" +
                '<div class="recipe-dropdown-menu">';
            html += '<div class="recipe-item active" data-recipe="all">All (Profit Overview)</div>';
            categoryOrder.forEach(function(cat) {
                var catRecipes = recipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; });
                if (catRecipes.length === 0) return;
                html += '<div class="recipe-category">' + cat.label + "</div>";
                catRecipes.forEach(function(r) {
                    html += '<div class="recipe-item" data-recipe="' + r.id + '">' + r.name + "</div>";
                });
            });
            html += '</div></div>' +
                '<button class="recipe-manage-btn" id="recipe-manage-btn" title="Manage unlocked recipes">&#9881;</button>' +
                "</div>";
            return html;
        }

        function buildAllViewHTML() {
            return '<div id="alch-view-all"><div class="tier-label">Profit Overview ' +
                '<span class="sort-toggle"><button id="alch-sort-profit" class="sort-btn active" onclick="setSortBy(\'alch\',\'profit\')">Gold</button><button id="alch-sort-pct" class="sort-btn" onclick="setSortBy(\'alch\',\'pct\')">% Margin</button></span>' +
                '<span class="sort-toggle" style="margin-left:12px"><span style="font-size:0.72em;color:#888;margin-right:5px">Batch</span><button class="sort-btn alch-batch-btn active" data-batch="1" onclick="setAlchBatch(1)">×1</button><button class="sort-btn alch-batch-btn" data-batch="100" onclick="setAlchBatch(100)">×100</button><button class="sort-btn alch-batch-btn" data-batch="1000" onclick="setAlchBatch(1000)">×1000</button></span>' +
                '<span id="alch-batch-note" style="font-size:0.72em;color:#a78bfa;margin-left:8px"></span></div>' +
                '<table class="alch-summary"><thead><tr><th>Recipe</th><th id="alch-hdr-cost">Craft Cost</th><th id="alch-hdr-revenue">Sale Price</th><th>Profit</th><th>Margin</th><th style="color:#a78bfa">Daily Sold</th><th style="color:#a78bfa">Avg Price</th></tr></thead><tbody id="alch-summary-body"></tbody></table></div>';
        }

        function buildRecipeDetailHTML(recipe) {
            var html = '<div id="alch-view-' + recipe.id + '" class="alch-view" style="display:none"><div class="card"><h3>' + recipe.name + '</h3><div class="craft-amount-row">' +
                '<label class="craft-amount-label" for="alch_qty_' + recipe.id + '">Crafting amount</label>' +
                '<div class="price-control"><input type="number" id="alch_qty_' + recipe.id + '" value="1" min="1" step="1"></div>' +
                '<button type="button" class="craft-amount-reset-btn" onclick="resetCraftQtyToOne(' + "'" + 'alch_qty_' + recipe.id + "'" + ',' + "'" + 'alch' + "'" + ')" title="Reset to 1">Reset</button></div>';
            if (recipe.category === "transmute") html += '<div class="recipe">Transmute - daily cooldown</div>';
            html += '<div class="sourcing"><div class="sourcing-title">Ingredients</div>';
            recipe.ingredients.forEach(function(ing) {
                var baseId = "alch_" + recipe.id + "_ing_" + sanitizeId(ing.item);
                if (ing.craftFrom) {
                    html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_buy_label"><span id="' + baseId + '_buy_qty">' + ing.qty + "x " + ing.item + '</span> (buy)</span><span class="opt" id="' + baseId + '_buy_price">-</span></div>';
                    html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_craft_label"><span id="' + baseId + '_craft_qty">' + (ing.qty * ing.craftFrom.qty) + "x " + ing.craftFrom.item + '</span></span><span class="opt" id="' + baseId + '_craft_price">-</span></div>';
                } else {
                    html += '<div class="sourcing-row fixed"><span id="' + baseId + '_qty">' + ing.qty + "x " + ing.item + '</span><span class="cost" id="' + baseId + '">-</span></div>';
                }
            });
            html += '</div><div class="card-row"><span class="label">Craft cost</span><span class="value" id="alch_' + recipe.id + '_craft_cost">-</span></div><div class="card-row"><span class="label">Sale price</span><span class="value" id="alch_' + recipe.id + '_sale_display">-</span></div><div class="card-row"><span class="label">AH cut</span><span class="value" id="alch_' + recipe.id + '_ah_cut_display">-</span></div><div class="card-row highlight"><span class="label">Net profit</span><span class="value" id="alch_' + recipe.id + '_profit">-</span></div><div class="deposit-note" id="alch_' + recipe.id + '_deposit_note">-</div></div>';
            if (recipe.category !== "transmute") {
                html += '<div class="card"><h3>Proc Calculator <span class="proc-il-rate-label" id="proc-il-rate-label-' + recipe.id + '">at ' + procRate + '% proc rate</span></h3><div class="proc-input-row"><label>Crafts</label><div class="proc-stepper-wrap"><button class="proc-step-btn" onclick="procIlStep(\'' + recipe.id + '\',-100)">−100</button><button class="proc-step-btn" onclick="procIlStep(\'' + recipe.id + '\',-10)">−10</button><button class="proc-step-btn" onclick="procIlStep(\'' + recipe.id + '\',-1)">−1</button><input type="number" id="proc-il-crafts-' + recipe.id + '" value="100" min="1" step="1" oninput="procIlUpdate(\'' + recipe.id + '\')"><button class="proc-step-btn" onclick="procIlStep(\'' + recipe.id + '\',1)">+1</button><button class="proc-step-btn" onclick="procIlStep(\'' + recipe.id + '\',10)">+10</button><button class="proc-step-btn" onclick="procIlStep(\'' + recipe.id + '\',100)">+100</button><button class="proc-step-btn proc-reset-btn" onclick="procIlReset(\'' + recipe.id + '\')">Reset</button></div></div><div id="proc-il-results-' + recipe.id + '"></div></div>';
            }
            html += "</div>";
            return html;
        }

        var controls = buildRecipeDropdownHTML();
        var colLeft = "";
        colLeft += '<div class="panel alch-filterable">' + collapsibleH2("AH Materials", "ah-mats") + '<div class="panel-body" data-panel-body="ah-mats"><div class="price-table">';
        regularAhItems.forEach(function(item) {
            var inputId = "alch_mat_" + sanitizeId(item);
            nameToInput[item] = inputId;
            colLeft += alchTableRow(item, inputId, 0, true, itemToRecipes[item]);
        });
        colLeft += "</div></div></div>";
        if (transmuteAhItems.length > 0) {
            colLeft += '<div class="panel alch-filterable">' + collapsibleH2("Transmute Materials", "transmute-mats") + '<div class="panel-body" data-panel-body="transmute-mats"><div class="price-table">';
            transmuteAhItems.forEach(function(item) {
                var inputId = "alch_mat_" + sanitizeId(item);
                nameToInput[item] = inputId;
                colLeft += alchTableRow(item, inputId, 0, true, itemToRecipes[item]);
            });
            colLeft += "</div></div></div>";
        }

        var colRight = '<div class="panel alch-filterable">' + collapsibleH2("Product Sale Prices", "sale-prices") + '<div class="panel-body" data-panel-body="sale-prices"><div class="price-table">';
        recipes.forEach(function(r) {
            var inputId = "alch_sale_" + r.id;
            var productName = r.product || r.name;
            nameToInput[productName] = inputId;
            colRight += alchTableRow(productName, inputId, 0, true, [r.id]);
        });
        colRight += "</div></div></div>";
        colRight += '<div class="panel alch-filterable">' + collapsibleH2("Deposits, Vendor & Settings", "deposits") + '<div class="panel-body" data-panel-body="deposits"><div class="price-table">';
        recipes.forEach(function(r) {
            var inputId = "alch_deposit_" + r.id;
            var productName = r.product || r.name;
            colRight += alchTableRow(productName + " (deposit)", inputId, 0, false, [r.id]);
        });
        vendorItems.forEach(function(item) {
            var inputId = "alch_vendor_" + sanitizeId(item);
            colRight += alchTableRow(item + " (vendor)", inputId, vendorDefaults[item] || 0, false, itemToRecipes[item]);
        });
        colRight += '<div class="price-table-row"><span class="pt-name">AH Cut</span><div class="price-control"><input type="number" id="alch_ah_cut" value="5" step="0.1"><span style="color: #888; font-size: 0.82em; margin-left: 2px;">%</span></div></div>';
        colRight += "</div></div></div>";

        var main = controls + buildAllViewHTML();
        recipes.forEach(function(r) { main += buildRecipeDetailHTML(r); });

        var procModalHtml =
            '<div class="proc-overlay" id="proc-overlay">' +
            '<div class="proc-modal"><div class="proc-modal-hdr"><span class="proc-modal-title" id="proc-modal-title">Proc Calculator</span><button class="proc-modal-close-btn" id="proc-modal-close-btn">×</button></div>' +
            '<div class="proc-modal-body"><div class="proc-input-row"><label>Crafts</label><div class="proc-stepper-wrap"><button class="proc-step-btn" onclick="procStep(-100)">−100</button><button class="proc-step-btn" onclick="procStep(-10)">−10</button><button class="proc-step-btn" onclick="procStep(-1)">−1</button><input type="number" id="proc-crafts" value="100" min="1" step="1" oninput="procModalUpdate()"><button class="proc-step-btn" onclick="procStep(1)">+1</button><button class="proc-step-btn" onclick="procStep(10)">+10</button><button class="proc-step-btn" onclick="procStep(100)">+100</button><button class="proc-step-btn proc-reset-btn" onclick="procResetCrafts()">Reset</button></div></div>' +
            '<div class="proc-input-row"><label>Proc Rate</label><input type="number" id="proc-rate-input" value="20" min="0" max="200" step="1" oninput="saveProcRate()"><span style="color:#666;font-size:0.8em">% extra yield</span></div>' +
            '<div id="proc-results"></div></div></div></div>';

        return {
            colLeft: colLeft,
            colRight: colRight,
            main: main,
            manageHtml: renderManageRecipesModal(recipes, categoryOrder, hidden),
            procModalHtml: procModalHtml
        };
    }

    function buildManageRecipesModal(config) {
        var recipes = config.recipes;
        var categoryOrder = config.categoryOrder;
        var hidden = config.hidden || {};
        return renderManageRecipesModal(recipes, categoryOrder, hidden);
    }

    global.AppAlchemyView = {
        build: build,
        buildManageRecipesModal: buildManageRecipesModal
    };
})(window);
