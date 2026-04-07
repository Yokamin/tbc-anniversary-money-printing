(function(global) {
    "use strict";

    function buildRecipeDropdownHTML(recipes, categoryOrder) {
        var ddHtml = '<div class="recipe-dropdown-wrapper">' +
            '<div class="recipe-dropdown" id="cook-recipe-dropdown">' +
            '<button class="recipe-dropdown-trigger" id="cook-recipe-dropdown-trigger">' +
                '<span id="cook-recipe-dropdown-label">All (Profit Overview)</span>' +
                '<span class="dd-arrow">&#9660;</span>' +
            '</button>' +
            '<div class="recipe-dropdown-menu">';
        ddHtml += '<div class="recipe-item active" data-recipe="all">All (Profit Overview)</div>';
        categoryOrder.forEach(function(cat) {
            var catRecipes = recipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; });
            if (catRecipes.length === 0) return;
            ddHtml += '<div class="recipe-category">' + cat.label + '</div>';
            catRecipes.forEach(function(r) {
                ddHtml += '<div class="recipe-item" data-recipe="' + r.id + '">' + r.name + "</div>";
            });
        });
        ddHtml += '</div></div>' +
            '<button class="recipe-back-btn" id="cook-recipe-back" style="display:none;" title="Back to all recipes">&#8592; All</button>' +
            "</div>";
        return ddHtml;
    }

    function buildTabColumnsAndMain(config) {
        var recipes = config.recipes;
        var categoryOrder = config.categoryOrder;
        var sanitizeId = config.sanitizeId;
        var nameToInput = config.nameToInput;
        var vendorDefaults = config.vendorDefaults;
        var locksKey = config.locksKey;

        var ahItemsSet = {};
        var vendorItemsSet = {};
        var itemToRecipes = {};

        recipes.forEach(function(r) {
            r.ingredients.forEach(function(ing) {
                if (ing.type === "ah") ahItemsSet[ing.item] = true;
                else if (ing.type === "vendor") vendorItemsSet[ing.item] = true;
                if (!itemToRecipes[ing.item]) itemToRecipes[ing.item] = [];
                itemToRecipes[ing.item].push(r.id);
            });
        });

        var allAhItems = Object.keys(ahItemsSet).sort();
        var vendorItems = Object.keys(vendorItemsSet).sort();

        function cookTableRow(label, inputId, defVal, hasLock, recipeIds) {
            var attr = recipeIds ? ' data-recipes="' + recipeIds.join(",") + '"' : "";
            var lockHTML = hasLock ? '<button class="lock-btn" data-input="' + inputId + '" data-locks-key="' + locksKey + '">&#x1f513;</button>' : "";
            return '<div class="price-table-row"' + attr + ">" +
                '<span class="pt-name">' + label + "</span>" + lockHTML +
                '<div class="price-control"><input type="number" id="' + inputId + '" value="' + (defVal || 0) + '" step="0.0001"></div>' +
                '<div class="gsc-group" data-input="' + inputId + '"><span class="gsc-val gold">0g</span><span class="gsc-val silver">0s</span><span class="gsc-val copper">0c</span></div>' +
            "</div>";
        }

        function cookCollH2(label, panelId) {
            return '<h2 class="collapsible" data-panel="cook-' + panelId + '">' + label + '<span class="collapse-arrow">&#9660;</span></h2>';
        }

        var colLeft = buildRecipeDropdownHTML(recipes, categoryOrder);
        colLeft += '<div class="panel cook-filterable">' + cookCollH2("AH Ingredients", "ah-mats") + '<div class="panel-body" data-panel-body="cook-ah-mats"><div class="price-table">';
        allAhItems.forEach(function(item) {
            var inputId = "cook_mat_" + sanitizeId(item);
            nameToInput[item] = inputId;
            colLeft += cookTableRow(item, inputId, 0, true, itemToRecipes[item]);
        });
        colLeft += "</div></div></div>";

        colLeft += '<div class="panel cook-filterable">' + cookCollH2("Vendor Items", "vendor-mats") + '<div class="panel-body" data-panel-body="cook-vendor-mats"><div class="price-table">';
        vendorItems.forEach(function(item) {
            var inputId = "cook_vendor_" + sanitizeId(item);
            var defVal = vendorDefaults[item] || 0;
            nameToInput[item] = inputId;
            colLeft += cookTableRow(item + " (vendor)", inputId, defVal, false, itemToRecipes[item]);
        });
        colLeft += "</div></div></div>";

        var colRight = "";
        colRight += '<div class="panel cook-filterable">' + cookCollH2("Product Sale Prices", "sale-prices") + '<div class="panel-body" data-panel-body="cook-sale-prices"><div class="price-table">';
        recipes.forEach(function(r) {
            var inputId = "cook_sale_" + r.id;
            nameToInput[r.name] = inputId;
            colRight += cookTableRow(r.name, inputId, 0, true, [r.id]);
        });
        colRight += "</div></div></div>";

        colRight += '<div class="panel cook-filterable">' + cookCollH2("Deposits & Settings", "deposits") + '<div class="panel-body" data-panel-body="cook-deposits"><div class="price-table">';
        recipes.forEach(function(r) {
            colRight += cookTableRow(r.name + " (deposit)", "cook_deposit_" + r.id, 0, false, [r.id]);
        });
        colRight += '<div class="price-table-row"><span class="pt-name">AH Cut</span>' +
            '<div class="price-control"><input type="number" id="cook_ah_cut" value="5" step="0.1">' +
            '<span style="color:#888;font-size:0.82em;margin-left:2px;">%</span></div></div>';
        colRight += "</div></div></div>";

        var main = '<div id="cook-view-all">' +
            '<div class="tier-label">Profit Overview <span class="sort-toggle">' +
                '<button id="cook-sort-profit" class="sort-btn active" onclick="setSortBy(\'cook\',\'profit\')">Gold</button>' +
                '<button id="cook-sort-pct" class="sort-btn" onclick="setSortBy(\'cook\',\'pct\')">% Margin</button>' +
            "</span></div>" +
            '<table class="alch-summary">' +
                '<thead><tr><th>Recipe</th><th>Craft Cost</th><th>Sale Price</th><th>Profit</th><th>Margin</th><th style="color:#a78bfa">Daily Sold</th><th style="color:#a78bfa">Avg Price</th></tr></thead>' +
                '<tbody id="cook-summary-body"></tbody>' +
            "</table>" +
        "</div>";

        recipes.forEach(function(r) {
            main += '<div id="cook-view-' + r.id + '" class="cook-view" style="display:none">';
            main += '<div class="card"><h3>' + r.name + "</h3>";
            main += '<div class="sourcing"><div class="sourcing-title">Ingredients</div>';
            r.ingredients.forEach(function(ing) {
                var baseId = "cook_" + r.id + "_ing_" + sanitizeId(ing.item);
                var cls = ing.type === "vendor" ? ' style="color:#aaa"' : "";
                main += '<div class="sourcing-row fixed"><span>' + ing.qty + "x " + ing.item + (ing.type === "vendor" ? ' <span style="color:#888;font-size:0.8em">(vendor)</span>' : "") + '</span><span class="cost" id="' + baseId + '"' + cls + '>-</span></div>';
            });
            main += "</div>";
            main += '<div class="card-row"><span class="label">Craft cost</span><span class="value" id="cook_' + r.id + '_craft_cost">-</span></div>';
            main += '<div class="card-row"><span class="label">Sale price</span><span class="value" id="cook_' + r.id + '_sale_display">-</span></div>';
            main += '<div class="card-row"><span class="label">AH cut</span><span class="value" id="cook_' + r.id + '_ah_cut_display">-</span></div>';
            main += '<div class="card-row highlight"><span class="label">Net profit</span><span class="value" id="cook_' + r.id + '_profit">-</span></div>';
            main += '<div class="deposit-note" id="cook_' + r.id + '_deposit_note">-</div>';
            main += "</div></div>";
        });

        return { colLeft: colLeft, colRight: colRight, main: main };
    }

    global.AppCookingView = {
        buildTabColumnsAndMain: buildTabColumnsAndMain
    };
})(window);
