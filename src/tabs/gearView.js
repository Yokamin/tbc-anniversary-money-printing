(function(global) {
    "use strict";

    function buildTabColumnsAndMain(config) {
        var bagRecipes = config.bagRecipes;
        var gearRecipes = config.gearRecipes;
        var categoryOrder = config.categoryOrder;
        var getAllGearRecipes = config.getAllGearRecipes;
        var sanitizeId = config.sanitizeId;
        var gearNameToInput = config.gearNameToInput;
        var locksKey = config.locksKey;
        var depositDefaults = config.depositDefaults;
        var vendorDefaults = config.vendorDefaults;

        function buildRecipeDropdownHTML() {
            var html = '<div class="recipe-dropdown-wrapper">' +
                '<button class="recipe-back-btn" id="gear-recipe-back" style="display:none;" title="Back to all recipes">&#8592; All</button>' +
                '<div class="recipe-dropdown" id="gear-recipe-dropdown"><button class="recipe-dropdown-trigger" id="gear-recipe-dropdown-trigger"><span id="gear-recipe-dropdown-label">All (Profit Overview)</span><span class="dd-arrow">&#9660;</span></button><div class="recipe-dropdown-menu">';
            html += '<div class="recipe-item active" data-recipe="all">All (Profit Overview)</div>';
            html += '<div class="recipe-category">Bags</div>';
            bagRecipes.forEach(function(r) { html += '<div class="recipe-item" data-recipe="' + r.id + '">' + r.name + "</div>"; });
            categoryOrder.forEach(function(cat) {
                var recipes = gearRecipes.filter(function(r) { return cat.includes.indexOf(r.category) !== -1; });
                if (recipes.length === 0) return;
                html += '<div class="recipe-category">' + cat.label + "</div>";
                recipes.forEach(function(r) { html += '<div class="recipe-item" data-recipe="' + r.id + '">' + r.name + "</div>"; });
            });
            html += '</div></div></div>';
            return html;
        }

        function buildAllViewHTML() {
            return '<div id="gear-view-all"><div class="tier-label">Profit Overview <span class="sort-toggle"><button id="gear-sort-profit" class="sort-btn active" onclick="setSortBy(\'gear\',\'profit\')">Gold</button><button id="gear-sort-pct" class="sort-btn" onclick="setSortBy(\'gear\',\'pct\')">% Margin</button></span></div><table class="gear-summary"><thead><tr><th>Recipe</th><th>Craft Cost</th><th>Sale Price</th><th>Profit</th><th>Margin</th><th style="color:#a78bfa">Daily Sold</th><th style="color:#a78bfa">Avg Price</th></tr></thead><tbody id="gear-summary-body"></tbody></table></div>';
        }

        function buildIngHTML(ing, recipeId, totalQty, depth) {
            depth = depth || 0;
            var indent = depth > 0 ? ' style="padding-left:' + (depth * 14) + 'px"' : "";
            var baseId = "gear_" + recipeId + "_ing_" + sanitizeId(ing.item);
            var html = "";
            if (ing.type === "bop") {
                html += '<div class="sourcing-row fixed"' + indent + '><span id="' + baseId + '_qty">' + totalQty + "x " + ing.item + '</span><span class="cost" style="color:#f59e0b">BOP</span></div>';
            } else if (ing.craftFrom && ing.craftFrom.item) {
                html += '<div class="sourcing-row"' + indent + '><span class="opt" id="' + baseId + '_buy_label"><span id="' + baseId + '_buy_qty">' + totalQty + "x " + ing.item + '</span> (buy)</span><span class="opt" id="' + baseId + '_buy_price">-</span></div>';
                html += '<div class="sourcing-row"' + indent + '><span class="opt" id="' + baseId + '_craft_label"><span id="' + baseId + '_craft_qty">' + (totalQty * ing.craftFrom.qty) + "x " + ing.craftFrom.item + '</span></span><span class="opt" id="' + baseId + '_craft_price">-</span></div>';
            } else if (ing.craftFrom && ing.craftFrom.mats) {
                html += '<div class="sourcing-row"' + indent + '><span class="opt" id="' + baseId + '_buy_label"><span id="' + baseId + '_buy_qty">' + totalQty + "x " + ing.item + '</span> (buy)</span><span class="opt" id="' + baseId + '_buy_price">-</span></div>';
                html += '<div class="sourcing-row"' + indent + '><span class="opt" id="' + baseId + '_craft_label"><span id="' + baseId + '_craft_qty">' + totalQty + "x " + ing.item + '</span> (craft)</span><span class="opt" id="' + baseId + '_craft_price">-</span></div>';
                ing.craftFrom.mats.forEach(function(mat) { html += buildIngHTML(mat, recipeId, totalQty * mat.qty, depth + 1); });
            } else {
                html += '<div class="sourcing-row fixed"' + indent + '><span id="' + baseId + '_qty">' + totalQty + "x " + ing.item + '</span><span class="cost" id="' + baseId + '">-</span></div>';
            }
            return html;
        }

        function buildRecipeDetailHTML(recipe) {
            var html = '<div id="gear-view-' + recipe.id + '" class="gear-view" style="display:none"><div class="card"><h3>' + recipe.name + '</h3><div class="craft-amount-row">' +
                '<label class="craft-amount-label" for="gear_qty_' + recipe.id + '">Crafting amount</label>' +
                '<div class="price-control"><input type="number" id="gear_qty_' + recipe.id + '" value="1" min="1" step="1"></div>' +
                '<button type="button" class="craft-amount-reset-btn" onclick="resetCraftQtyToOne(' + "'" + 'gear_qty_' + recipe.id + "'" + ',' + "'" + 'gear' + "'" + ')" title="Reset to 1">Reset</button></div><div class="sourcing"><div class="sourcing-title">Ingredients</div>';
            recipe.ingredients.forEach(function(ing) { html += buildIngHTML(ing, recipe.id, ing.qty, 0); });
            html += '</div><div class="card-row"><span class="label">Craft cost</span><span class="value" id="gear_' + recipe.id + '_craft_cost">-</span></div><div class="card-row"><span class="label">Sale price</span><span class="value" id="gear_' + recipe.id + '_sale_display">-</span></div><div class="card-row"><span class="label">AH cut</span><span class="value" id="gear_' + recipe.id + '_ah_cut_display">-</span></div><div class="card-row highlight"><span class="label">Net profit</span><span class="value" id="gear_' + recipe.id + '_profit">-</span></div><div class="deposit-note" id="gear_' + recipe.id + '_deposit_note">-</div></div></div>';
            return html;
        }

        var ahItemsSet = {};
        var vendorItemsSet = {};
        var itemToRecipes = {};
        function collectGearItems(ing, recipeId) {
            if (ing.type === "ah") {
                ahItemsSet[ing.item] = true;
                if (!itemToRecipes[ing.item]) itemToRecipes[ing.item] = [];
                if (itemToRecipes[ing.item].indexOf(recipeId) === -1) itemToRecipes[ing.item].push(recipeId);
            } else if (ing.type === "vendor") {
                vendorItemsSet[ing.item] = true;
                if (!itemToRecipes[ing.item]) itemToRecipes[ing.item] = [];
                if (itemToRecipes[ing.item].indexOf(recipeId) === -1) itemToRecipes[ing.item].push(recipeId);
            }
            if (ing.craftFrom) {
                if (ing.craftFrom.item) {
                    ahItemsSet[ing.craftFrom.item] = true;
                    if (!itemToRecipes[ing.craftFrom.item]) itemToRecipes[ing.craftFrom.item] = [];
                    if (itemToRecipes[ing.craftFrom.item].indexOf(recipeId) === -1) itemToRecipes[ing.craftFrom.item].push(recipeId);
                } else if (ing.craftFrom.mats) {
                    ing.craftFrom.mats.forEach(function(mat) { collectGearItems(mat, recipeId); });
                }
            }
        }
        getAllGearRecipes().forEach(function(r) { r.ingredients.forEach(function(ing) { collectGearItems(ing, r.id); }); });
        var allAhItems = Object.keys(ahItemsSet).sort();
        var vendorItems = Object.keys(vendorItemsSet).sort();

        function gearTableRow(label, inputId, defaultValue, hasLock, recipeIds) {
            var recipesAttr = recipeIds ? ' data-recipes="' + recipeIds.join(",") + '"' : "";
            var lockHTML = hasLock ? '<button class="lock-btn" data-input="' + inputId + '" data-locks-key="' + locksKey + '">&#x1f513;</button>' : "";
            return '<div class="price-table-row"' + recipesAttr + "><span class=\"pt-name\">" + label + "</span>" + lockHTML + '<div class="price-control"><input type="number" id="' + inputId + '" value="' + defaultValue + '" step="0.0001"></div><div class="gsc-group" data-input="' + inputId + '"><span class="gsc-val gold">0g</span><span class="gsc-val silver">0s</span><span class="gsc-val copper">0c</span></div></div>';
        }
        function gearH2(label, panelId) {
            return '<h2 class="collapsible" data-panel="gear-' + panelId + '">' + label + '<span class="collapse-arrow">&#9660;</span></h2>';
        }

        var controls = buildRecipeDropdownHTML();
        var colLeft = "";
        if (allAhItems.length > 0) {
            colLeft += '<div class="panel gear-filterable">' + gearH2("AH Materials", "ah-mats") + '<div class="panel-body" data-panel-body="gear-ah-mats"><div class="price-table">';
            allAhItems.forEach(function(item) {
                var inputId = "gear_mat_" + sanitizeId(item);
                gearNameToInput[item] = inputId;
                colLeft += gearTableRow(item, inputId, 0, true, itemToRecipes[item]);
            });
            colLeft += "</div></div></div>";
        }

        var colRight = '<div class="panel gear-filterable">' + gearH2("Product Sale Prices", "sale-prices") + '<div class="panel-body" data-panel-body="gear-sale-prices"><div class="price-table">';
        getAllGearRecipes().forEach(function(r) {
            var inputId = "gear_sale_" + r.id;
            var productName = r.product || r.name;
            gearNameToInput[productName] = inputId;
            colRight += gearTableRow(productName, inputId, 0, true, [r.id]);
        });
        colRight += "</div></div></div>";

        colRight += '<div class="panel gear-filterable">' + gearH2("Deposits & Settings", "deposits") + '<div class="panel-body" data-panel-body="gear-deposits"><div class="price-table">';
        getAllGearRecipes().forEach(function(r) {
            var inputId = "gear_deposit_" + r.id;
            var productName = r.product || r.name;
            colRight += gearTableRow(productName + " (deposit)", inputId, depositDefaults[inputId] || 0, false, [r.id]);
        });
        vendorItems.forEach(function(item) {
            var inputId = "gear_vendor_" + sanitizeId(item);
            colRight += gearTableRow(item + " (vendor)", inputId, vendorDefaults[item] || 0, false, itemToRecipes[item]);
        });
        colRight += '<div class="price-table-row"><span class="pt-name">AH Cut</span><div class="price-control"><input type="number" id="gear_ah_cut" value="5" step="0.1"><span style="color: #888; font-size: 0.82em; margin-left: 2px;">%</span></div></div>';
        colRight += "</div></div></div>";

        var main = controls + buildAllViewHTML();
        getAllGearRecipes().forEach(function(r) { main += buildRecipeDetailHTML(r); });

        return {
            colLeft: colLeft,
            colRight: colRight,
            main: main
        };
    }

    global.AppGearView = {
        buildTabColumnsAndMain: buildTabColumnsAndMain
    };
})(window);
