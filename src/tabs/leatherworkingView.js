(function(global) {
    "use strict";

    function buildRecipeDropdownHTML(recipes, categoryOrder) {
        var html = '<div class="recipe-dropdown-wrapper">' +
            '<div class="recipe-dropdown" id="lw-recipe-dropdown">' +
            '<button class="recipe-dropdown-trigger" id="lw-recipe-dropdown-trigger">' +
                '<span id="lw-recipe-dropdown-label">All (Profit Overview)</span>' +
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
            '<button class="recipe-back-btn" id="lw-recipe-back" style="display:none;" title="Back to all recipes">&#8592; All</button>' +
            "</div>";
        return html;
    }

    function buildAllViewHTML() {
        return '<div id="lw-view-all">' +
            '<div class="tier-label">Profit Overview <span class="sort-toggle">' +
                '<button id="lw-sort-profit" class="sort-btn active" onclick="setSortBy(\'lw\',\'profit\')">Gold</button>' +
                '<button id="lw-sort-pct" class="sort-btn" onclick="setSortBy(\'lw\',\'pct\')">% Margin</button>' +
            "</span></div>" +
            '<table class="gear-summary">' +
                '<thead><tr><th>Recipe</th><th>Craft Cost</th><th>Sale Price</th><th>Profit</th><th>Margin</th><th style="color:#a78bfa">Daily Sold</th><th style="color:#a78bfa">Avg Price</th></tr></thead>' +
                '<tbody id="lw-summary-body"></tbody>' +
            "</table>" +
        "</div>";
    }

    function buildIngHTML(ing, recipeId, totalQty, depth, sanitizeId) {
        depth = depth || 0;
        var indent = depth > 0 ? ' style="padding-left:' + (depth * 14) + 'px"' : "";
        var baseId = "lw_" + recipeId + "_ing_" + sanitizeId(ing.item);
        var html = "";

        if (ing.craftFrom && ing.craftFrom.item) {
            html += '<div class="sourcing-row"' + indent + '><span class="opt" id="' + baseId + '_buy_label">' + totalQty + "x " + ing.item + ' (buy)</span><span class="opt" id="' + baseId + '_buy_price">-</span></div>';
            html += '<div class="sourcing-row"' + indent + '><span class="opt" id="' + baseId + '_craft_label">' + (totalQty * ing.craftFrom.qty) + "x " + ing.craftFrom.item + '</span><span class="opt" id="' + baseId + '_craft_price">-</span></div>';
        } else {
            var suffix = ing.type === "vendor" ? " (vendor)" : "";
            html += '<div class="sourcing-row fixed"' + indent + "><span>" + totalQty + "x " + ing.item + suffix + '</span><span class="cost" id="' + baseId + '">-</span></div>';
        }
        return html;
    }

    function buildRecipeDetailHTML(recipe, sanitizeId) {
        var html = '<div id="lw-view-' + recipe.id + '" class="lw-view" style="display:none">';
        html += '<div class="card"><h3>' + recipe.name + "</h3>";
        html += '<div class="sourcing"><div class="sourcing-title">Ingredients</div>';
        recipe.ingredients.forEach(function(ing) {
            html += buildIngHTML(ing, recipe.id, ing.qty, 0, sanitizeId);
        });
        html += "</div>";
        html += '<div class="card-row"><span class="label">Craft cost</span><span class="value" id="lw_' + recipe.id + '_craft_cost">-</span></div>';
        html += '<div class="card-row"><span class="label">Sale price</span><span class="value" id="lw_' + recipe.id + '_sale_display">-</span></div>';
        html += '<div class="card-row"><span class="label">AH cut</span><span class="value" id="lw_' + recipe.id + '_ah_cut_display">-</span></div>';
        html += '<div class="card-row highlight"><span class="label">Net profit</span><span class="value" id="lw_' + recipe.id + '_profit">-</span></div>';
        html += '<div class="deposit-note" id="lw_' + recipe.id + '_deposit_note">-</div>';
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

        function collectItems(ing, recipeId) {
            if (ing.type === "ah") {
                ahItemsSet[ing.item] = true;
                if (!itemToRecipes[ing.item]) itemToRecipes[ing.item] = [];
                if (itemToRecipes[ing.item].indexOf(recipeId) === -1) itemToRecipes[ing.item].push(recipeId);
            } else if (ing.type === "vendor") {
                vendorItemsSet[ing.item] = true;
                if (!itemToRecipes[ing.item]) itemToRecipes[ing.item] = [];
                if (itemToRecipes[ing.item].indexOf(recipeId) === -1) itemToRecipes[ing.item].push(recipeId);
            }
            if (ing.craftFrom && ing.craftFrom.item) {
                ahItemsSet[ing.craftFrom.item] = true;
                if (!itemToRecipes[ing.craftFrom.item]) itemToRecipes[ing.craftFrom.item] = [];
                if (itemToRecipes[ing.craftFrom.item].indexOf(recipeId) === -1) itemToRecipes[ing.craftFrom.item].push(recipeId);
            }
        }

        recipes.forEach(function(r) { r.ingredients.forEach(function(ing) { collectItems(ing, r.id); }); });
        var allAhItems = Object.keys(ahItemsSet).sort();
        var vendorItems = Object.keys(vendorItemsSet).sort();

        function lwTableRow(label, inputId, defaultValue, hasLock, locksKey, recipeIds) {
            var recipesAttr = recipeIds ? ' data-recipes="' + recipeIds.join(",") + '"' : "";
            var lockHTML = hasLock ? '<button class="lock-btn" data-input="' + inputId + '" data-locks-key="' + locksKey + '">&#x1f513;</button>' : "";
            return '<div class="price-table-row"' + recipesAttr + ">" +
                '<span class="pt-name">' + label + "</span>" + lockHTML +
                '<div class="price-control"><input type="number" id="' + inputId + '" value="' + defaultValue + '" step="0.0001"></div>' +
                '<div class="gsc-group" data-input="' + inputId + '"><span class="gsc-val gold">0g</span><span class="gsc-val silver">0s</span><span class="gsc-val copper">0c</span></div>' +
            "</div>";
        }

        function lwH2(label, panelId) {
            return '<h2 class="collapsible" data-panel="lw-' + panelId + '">' + label + '<span class="collapse-arrow">&#9660;</span></h2>';
        }

        var colLeft = buildRecipeDropdownHTML(recipes, categoryOrder);
        if (allAhItems.length > 0) {
            colLeft += '<div class="panel lw-filterable">' + lwH2("AH Materials", "ah-mats") + '<div class="panel-body" data-panel-body="lw-ah-mats"><div class="price-table">';
            allAhItems.forEach(function(item) {
                var inputId = "lw_mat_" + sanitizeId(item);
                nameToInput[item] = inputId;
                colLeft += lwTableRow(item, inputId, 0, true, config.locksKey, itemToRecipes[item]);
            });
            colLeft += "</div></div></div>";
        }

        var colRight = '<div class="panel lw-filterable">' + lwH2("Product Sale Prices", "sale-prices") + '<div class="panel-body" data-panel-body="lw-sale-prices"><div class="price-table">';
        recipes.forEach(function(r) {
            var inputId = "lw_sale_" + r.id;
            nameToInput[r.name] = inputId;
            colRight += lwTableRow(r.name, inputId, 0, true, config.locksKey, [r.id]);
        });
        colRight += "</div></div></div>";

        colRight += '<div class="panel lw-filterable">' + lwH2("Deposits & Settings", "deposits") + '<div class="panel-body" data-panel-body="lw-deposits"><div class="price-table">';
        recipes.forEach(function(r) {
            colRight += lwTableRow(r.name + " (deposit)", "lw_deposit_" + r.id, 0, false, null, [r.id]);
        });
        vendorItems.forEach(function(item) {
            var inputId = "lw_vendor_" + sanitizeId(item);
            colRight += lwTableRow(item + " (vendor)", inputId, vendorDefaults[item] || 0, false, null, itemToRecipes[item]);
        });
        colRight += '<div class="price-table-row"><span class="pt-name">AH Cut</span><div class="price-control"><input type="number" id="lw_ah_cut" value="5" step="0.1"><span style="color: #888; font-size: 0.82em; margin-left: 2px;">%</span></div></div>';
        colRight += "</div></div></div>";

        var main = buildAllViewHTML();
        recipes.forEach(function(r) {
            main += buildRecipeDetailHTML(r, sanitizeId);
        });

        return { colLeft: colLeft, colRight: colRight, main: main };
    }

    global.AppLeatherworkingView = {
        buildTabColumnsAndMain: buildTabColumnsAndMain
    };
})(window);
