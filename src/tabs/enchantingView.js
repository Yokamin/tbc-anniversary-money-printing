(function(global) {
    "use strict";

    function buildRecipeDropdownHTML(recipes, categoryOrder) {
        var html = '<div class="recipe-dropdown-wrapper">' +
            '<div class="recipe-dropdown" id="ench-recipe-dropdown">' +
            '<button class="recipe-dropdown-trigger" id="ench-recipe-dropdown-trigger">' +
                '<span id="ench-recipe-dropdown-label">All (Profit Overview)</span>' +
                '<span class="dd-arrow">&#9660;</span>' +
            '</button>' +
            '<div class="recipe-dropdown-menu">';
        html += '<div class="recipe-item active" data-recipe="all">All (Profit Overview)</div>';
        categoryOrder.forEach(function(cat) {
            var catRecipes = recipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; });
            if (catRecipes.length === 0) return;
            html += '<div class="recipe-category">' + cat.label + '</div>';
            catRecipes.forEach(function(r) {
                html += '<div class="recipe-item" data-recipe="' + r.id + '">' + r.name + "</div>";
            });
        });
        html += '</div></div>' +
            '<button class="recipe-back-btn" id="ench-recipe-back" style="display:none;" title="Back to all recipes">&#8592; All</button>' +
            "</div>";
        return html;
    }

    function buildAllViewHTML() {
        return '<div id="ench-view-all">' +
            '<div class="tier-label">Profit Overview <span class="sort-toggle">' +
                '<button id="ench-sort-profit" class="sort-btn active" onclick="setSortBy(\'ench\',\'profit\')">Gold</button>' +
                '<button id="ench-sort-pct" class="sort-btn" onclick="setSortBy(\'ench\',\'pct\')">% Margin</button>' +
            "</span></div>" +
            '<table class="gear-summary">' +
                '<thead><tr><th>Recipe</th><th>Craft Cost</th><th>Sale Price</th><th>Profit</th><th>Margin</th><th style="color:#a78bfa">Daily Sold</th><th style="color:#a78bfa">Avg Price</th></tr></thead>' +
                '<tbody id="ench-summary-body"></tbody>' +
            "</table>" +
        "</div>";
    }

    function buildRecipeDetailHTML(recipe, sanitizeId) {
        var html = '<div id="ench-view-' + recipe.id + '" class="ench-view" style="display:none">';
        html += '<div class="card"><h3>' + recipe.name + "</h3>";
        html += '<div class="sourcing"><div class="sourcing-title">Ingredients</div>';
        recipe.ingredients.forEach(function(ing) {
            var baseId = "ench_" + recipe.id + "_ing_" + sanitizeId(ing.item);
            if (ing.type === "vendor") {
                html += '<div class="sourcing-row fixed"><span>' + ing.qty + "x " + ing.item + ' (vendor)</span><span class="cost" id="' + baseId + '">-</span></div>';
            } else {
                html += '<div class="sourcing-row fixed"><span>' + ing.qty + "x " + ing.item + '</span><span class="cost" id="' + baseId + '">-</span></div>';
            }
        });
        html += "</div>";
        html += '<div class="card-row"><span class="label">Craft cost</span><span class="value" id="ench_' + recipe.id + '_craft_cost">-</span></div>';
        html += '<div class="card-row"><span class="label">Sale price</span><span class="value" id="ench_' + recipe.id + '_sale_display">-</span></div>';
        html += '<div class="card-row"><span class="label">AH cut</span><span class="value" id="ench_' + recipe.id + '_ah_cut_display">-</span></div>';
        html += '<div class="card-row highlight"><span class="label">Net profit</span><span class="value" id="ench_' + recipe.id + '_profit">-</span></div>';
        html += '<div class="deposit-note" id="ench_' + recipe.id + '_deposit_note">-</div>';
        html += "</div></div>";
        return html;
    }

    function buildTabColumnsAndMain(config) {
        var recipes = config.recipes;
        var categoryOrder = config.categoryOrder;
        var sanitizeId = config.sanitizeId;
        var vendorDefaults = config.vendorDefaults;
        var nameToInput = config.nameToInput;

        var ahItemsSet = {};
        var vendorItemsSet = {};
        var itemToRecipes = {};
        recipes.forEach(function(r) {
            r.ingredients.forEach(function(ing) {
                if (ing.type === "ah") {
                    ahItemsSet[ing.item] = true;
                } else if (ing.type === "vendor") {
                    vendorItemsSet[ing.item] = true;
                }
                if (!itemToRecipes[ing.item]) itemToRecipes[ing.item] = [];
                if (itemToRecipes[ing.item].indexOf(r.id) === -1) itemToRecipes[ing.item].push(r.id);
            });
        });

        var allAhItems = Object.keys(ahItemsSet).sort();
        var vendorItems = Object.keys(vendorItemsSet).sort();

        function enchTableRow(label, inputId, defaultValue, hasLock, locksKey, recipeIds) {
            var recipesAttr = recipeIds ? ' data-recipes="' + recipeIds.join(",") + '"' : "";
            var lockHTML = hasLock ? '<button class="lock-btn" data-input="' + inputId + '" data-locks-key="' + locksKey + '">&#x1f513;</button>' : "";
            return '<div class="price-table-row"' + recipesAttr + ">" +
                '<span class="pt-name">' + label + "</span>" + lockHTML +
                '<div class="price-control"><input type="number" id="' + inputId + '" value="' + defaultValue + '" step="0.0001"></div>' +
                '<div class="gsc-group" data-input="' + inputId + '"><span class="gsc-val gold">0g</span><span class="gsc-val silver">0s</span><span class="gsc-val copper">0c</span></div>' +
            "</div>";
        }

        function enchH2(label, panelId) {
            return '<h2 class="collapsible" data-panel="ench-' + panelId + '">' + label + '<span class="collapse-arrow">&#9660;</span></h2>';
        }

        var colLeft = buildRecipeDropdownHTML(recipes, categoryOrder);
        if (allAhItems.length > 0) {
            colLeft += '<div class="panel ench-filterable">' + enchH2("AH Materials", "ah-mats") + '<div class="panel-body" data-panel-body="ench-ah-mats"><div class="price-table">';
            allAhItems.forEach(function(item) {
                var inputId = "ench_mat_" + sanitizeId(item);
                nameToInput[item] = inputId;
                colLeft += enchTableRow(item, inputId, 0, true, config.locksKey, itemToRecipes[item]);
            });
            colLeft += "</div></div></div>";
        }

        var colRight = '<div class="panel ench-filterable">' + enchH2("Product Sale Prices", "sale-prices") + '<div class="panel-body" data-panel-body="ench-sale-prices"><div class="price-table">';
        recipes.forEach(function(r) {
            var inputId = "ench_sale_" + r.id;
            nameToInput[r.name] = inputId;
            colRight += enchTableRow(r.name, inputId, 0, true, config.locksKey, [r.id]);
        });
        colRight += "</div></div></div>";

        colRight += '<div class="panel ench-filterable">' + enchH2("Deposits & Settings", "deposits") + '<div class="panel-body" data-panel-body="ench-deposits"><div class="price-table">';
        recipes.forEach(function(r) {
            colRight += enchTableRow(r.name + " (deposit)", "ench_deposit_" + r.id, 0, false, null, [r.id]);
        });
        vendorItems.forEach(function(item) {
            var inputId = "ench_vendor_" + sanitizeId(item);
            colRight += enchTableRow(item + " (vendor)", inputId, vendorDefaults[item] || 0, false, null, itemToRecipes[item]);
        });
        colRight += '<div class="price-table-row"><span class="pt-name">AH Cut</span><div class="price-control"><input type="number" id="ench_ah_cut" value="5" step="0.1"><span style="color: #888; font-size: 0.82em; margin-left: 2px;">%</span></div></div>';
        colRight += "</div></div></div>";

        var main = buildAllViewHTML();
        recipes.forEach(function(r) {
            main += buildRecipeDetailHTML(r, sanitizeId);
        });

        return {
            colLeft: colLeft,
            colRight: colRight,
            main: main
        };
    }

    global.AppEnchantingView = {
        buildTabColumnsAndMain: buildTabColumnsAndMain
    };
})(window);
