(function(global) {
    "use strict";

    function findPrimalById(primals, id) {
        for (var i = 0; i < primals.length; i++) {
            if (primals[i].id === id) return primals[i];
        }
        return null;
    }

    function buildRecipeView(r, sanitizeId, primals) {
        var html = '<div id="tx-view-' + r.id + '" class="tx-view" style="display:none">';
        html += '<div class="card"><h3>' + r.name + '</h3><div class="craft-amount-row">' +
                '<label class="craft-amount-label" for="tx_qty_' + r.id + '">Crafting amount</label>' +
            '<div class="price-control"><input type="number" id="tx_qty_' + r.id + '" value="1" min="1" step="1"></div>' +
            '<button type="button" class="craft-amount-reset-btn" onclick="resetCraftQtyToOne(' + "'" + 'tx_qty_' + r.id + "'" + ',' + "'" + 'tx' + "'" + ')" title="Reset to 1">Reset</button></div>';
        html += '<div class="recipe">Transmute - ' + r.cooldown + ' cooldown</div>';
        html += '<div class="sourcing"><div class="sourcing-title">Ingredients</div>';
        r.ingredients.forEach(function(ing) {
            var baseId = "tx_" + r.id + "_ing_" + sanitizeId(ing.item);
            if (ing.type === "primal") {
                html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_buy_label"><span id="' + baseId + '_buy_qty">' + ing.qty + "x " + ing.item + '</span> (buy)</span><span class="opt" id="' + baseId + '_buy_price">-</span></div>';
                var p = findPrimalById(primals, ing.primalId);
                if (p) html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_craft_label"><span id="' + baseId + '_craft_qty">' + (ing.qty * 10) + "x " + p.mote + '</span></span><span class="opt" id="' + baseId + '_craft_price">-</span></div>';
            } else {
                html += '<div class="sourcing-row fixed"><span id="' + baseId + '_qty">' + ing.qty + "x " + ing.item + '</span><span class="cost" id="' + baseId + '">-</span></div>';
            }
        });
        html += "</div>";
        html += '<div class="card-row"><span class="label">Craft cost</span><span class="value" id="tx_' + r.id + '_craft_cost">-</span></div>';
        html += '<div class="card-row"><span class="label">Sale price (' + (r.product || r.name) + ')</span><span class="value" id="tx_' + r.id + '_sale_display">-</span></div>';
        html += '<div class="card-row"><span class="label">AH cut</span><span class="value" id="tx_' + r.id + '_ah_cut_display">-</span></div>';
        html += '<div class="card-row highlight"><span class="label">Net profit</span><span class="value" id="tx_' + r.id + '_profit">-</span></div>';
        html += '<div class="deposit-note" id="tx_' + r.id + '_deposit_note">-</div>';
        html += "</div></div>";
        return html;
    }

    function buildClothView(r, sanitizeId, primals) {
        var html = '<div id="tx-view-' + r.id + '" class="tx-view" style="display:none">';
        html += '<div class="card"><h3>' + r.name + (r.yieldQty > 1 ? ' <span style="color:#888;font-size:0.8em;">(yields ' + r.yieldQty + "x)</span>" : "") + '</h3><div class="craft-amount-row">' +
            '<label class="craft-amount-label" for="tx_qty_' + r.id + '">Crafting amount</label>' +
            '<div class="price-control"><input type="number" id="tx_qty_' + r.id + '" value="1" min="1" step="1"></div>' +
            '<button type="button" class="craft-amount-reset-btn" onclick="resetCraftQtyToOne(' + "'" + 'tx_qty_' + r.id + "'" + ',' + "'" + 'tx' + "'" + ')" title="Reset to 1">Reset</button></div>';
        html += '<div class="recipe">Tailoring cloth - ' + r.cooldown + " cooldown</div>";
        html += '<div class="sourcing"><div class="sourcing-title">Ingredients (per craft)</div>';
        r.ingredients.forEach(function(ing) {
            var baseId = "tx_" + r.id + "_ing_" + sanitizeId(ing.item);
            if (ing.type === "imbued_bolt") {
                html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_buy_label"><span id="' + baseId + '_buy_qty">1x Bolt of Imbued Netherweave</span> (buy)</span><span class="opt" id="' + baseId + '_buy_price">-</span></div>';
                html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_craft_label"><span id="' + baseId + '_craft_qty">1x Bolt of Imbued Netherweave</span> (craft)</span><span class="opt" id="' + baseId + '_craft_price">-</span></div>';
                html += '<div class="sourcing-row fixed" style="padding-left:14px"><span id="' + baseId + '_bolt_qty">-> 3x Bolt of Netherweave</span><span class="cost" id="' + baseId + '_bolt_cost">-</span></div>';
                html += '<div class="sourcing-row fixed" style="padding-left:14px"><span id="' + baseId + '_dust_qty">-> 2x Arcane Dust</span><span class="cost" id="' + baseId + '_dust_cost">-</span></div>';
            } else if (ing.type === "primal") {
                var p = findPrimalById(primals, ing.primalId);
                html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_buy_label"><span id="' + baseId + '_buy_qty">' + ing.qty + "x " + ing.item + '</span> (buy)</span><span class="opt" id="' + baseId + '_buy_price">-</span></div>';
                if (p) html += '<div class="sourcing-row"><span class="opt" id="' + baseId + '_craft_label"><span id="' + baseId + '_craft_qty">' + (ing.qty * 10) + "x " + p.mote + '</span></span><span class="opt" id="' + baseId + '_craft_price">-</span></div>';
            }
        });
        html += "</div>";
        html += '<div class="card-row"><span class="label">Craft cost (1 craft)</span><span class="value" id="tx_' + r.id + '_craft_cost">-</span></div>';
        if (r.yieldQty > 1) {
            html += '<div class="card-row"><span class="label">Revenue (' + r.yieldQty + 'x sold)</span><span class="value" id="tx_' + r.id + '_revenue">-</span></div>';
            html += '<div class="card-row"><span class="label">AH cut (' + r.yieldQty + 'x)</span><span class="value" id="tx_' + r.id + '_ah_cut_display">-</span></div>';
            html += '<div class="card-row highlight"><span class="label">Total profit (all ' + r.yieldQty + ')</span><span class="value" id="tx_' + r.id + '_profit">-</span></div>';
            html += '<div class="card-row"><span class="label">Profit per item</span><span class="value" id="tx_' + r.id + '_profit_per">-</span></div>';
        } else {
            html += '<div class="card-row"><span class="label">Sale price</span><span class="value" id="tx_' + r.id + '_sale_display">-</span></div>';
            html += '<div class="card-row"><span class="label">AH cut</span><span class="value" id="tx_' + r.id + '_ah_cut_display">-</span></div>';
            html += '<div class="card-row highlight"><span class="label">Net profit</span><span class="value" id="tx_' + r.id + '_profit">-</span></div>';
        }
        html += '<div class="deposit-note" id="tx_' + r.id + '_deposit_note">-</div>';
        html += "</div></div>";
        return html;
    }

    function buildView(config) {
        var txPrimals = config.txPrimals;
        var transmuteRecipes = config.transmuteRecipes;
        var clothDailies = config.clothDailies;
        var txNameToInput = config.txNameToInput;
        var sanitizeId = config.sanitizeId;
        var depositDefaults = config.depositDefaults;
        var txLocksKey = config.txLocksKey;

        var itemToRecipes = {};
        function txTag(item, recipeId) {
            if (!itemToRecipes[item]) itemToRecipes[item] = [];
            if (itemToRecipes[item].indexOf(recipeId) === -1) itemToRecipes[item].push(recipeId);
        }

        txPrimals.forEach(function(p) {
            txTag(p.mote, "mote_primals");
            txTag(p.primal, "mote_primals");
        });
        txTag("Lesser Planar Essence", "planar_essence");
        txTag("Greater Planar Essence", "planar_essence");

        transmuteRecipes.forEach(function(r) {
            r.ingredients.forEach(function(ing) {
                txTag(ing.item, r.id);
                if (ing.type === "primal") {
                    var p = findPrimalById(txPrimals, ing.primalId);
                    if (p) { txTag(p.mote, r.id); txTag(p.primal, r.id); }
                }
            });
            txTag(r.product || r.name, r.id);
        });

        clothDailies.forEach(function(r) {
            r.ingredients.forEach(function(ing) {
                txTag(ing.item, r.id);
                if (ing.type === "primal") {
                    var p = findPrimalById(txPrimals, ing.primalId);
                    if (p) { txTag(p.mote, r.id); txTag(p.primal, r.id); }
                }
                if (ing.type === "imbued_bolt") {
                    txTag("Bolt of Netherweave", r.id);
                    txTag("Netherweave Cloth", r.id);
                    txTag("Arcane Dust", r.id);
                }
            });
            txTag(r.name, r.id);
        });

        var gems = {};
        transmuteRecipes.forEach(function(r) {
            r.ingredients.forEach(function(ing) {
                if (ing.type === "gem") gems[ing.item] = true;
            });
        });

        function txTableRow(label, inputId, defVal, hasLock, recipeIds) {
            var attr = recipeIds ? ' data-recipes="' + recipeIds.join(",") + '"' : "";
            var lockHTML = hasLock ? '<button class="lock-btn" data-input="' + inputId + '" data-locks-key="' + txLocksKey + '">&#x1f513;</button>' : "";
            return '<div class="price-table-row"' + attr + ">" +
                '<span class="pt-name">' + label + "</span>" + lockHTML +
                '<div class="price-control"><input type="number" id="' + inputId + '" value="' + (defVal || 0) + '" step="0.0001"></div>' +
                '<div class="gsc-group" data-input="' + inputId + '"><span class="gsc-val gold">0g</span><span class="gsc-val silver">0s</span><span class="gsc-val copper">0c</span></div>' +
            "</div>";
        }
        function txMoteRow(label, inputId, recipeIds) {
            var attr = recipeIds ? ' data-recipes="' + recipeIds.join(",") + '"' : "";
            return '<div class="price-table-row"' + attr + ">" +
                '<span class="pt-name">' + label + "</span>" +
                '<button class="gsc-btn" data-input="' + inputId + '" data-delta="-0.01" title="-1s" style="font-size:0.75em;padding:1px 5px;border-radius:3px;border:1px solid #555;background:#333;color:#ccc;cursor:pointer;">-1s</button>' +
                '<div class="price-control"><input type="number" id="' + inputId + '" value="0" step="0.0001"></div>' +
                '<button class="gsc-btn" data-input="' + inputId + '" data-delta="0.01" title="+1s" style="font-size:0.75em;padding:1px 5px;border-radius:3px;border:1px solid #555;background:#333;color:#ccc;cursor:pointer;">+1s</button>' +
                '<div class="gsc-group" data-input="' + inputId + '"><span class="gsc-val gold">0g</span><span class="gsc-val silver">0s</span><span class="gsc-val copper">0c</span></div>' +
            "</div>";
        }
        function txCollH2(label, panelId) {
            return '<h2 class="collapsible" data-panel="tx-' + panelId + '">' + label + '<span class="collapse-arrow">&#9660;</span></h2>';
        }

        function buildTxDropdownHTML() {
            var html = '<div class="recipe-dropdown-wrapper">' +
                '<button class="recipe-back-btn" id="tx-recipe-back" style="display:none;" title="Back to all recipes">&#8592; All</button>' +
                '<div class="recipe-dropdown" id="tx-recipe-dropdown">' +
                '<button class="recipe-dropdown-trigger" id="tx-recipe-dropdown-trigger">' +
                    '<span id="tx-recipe-dropdown-label">All (Profit Overview)</span>' +
                    '<span class="dd-arrow">&#9660;</span>' +
                "</button>" +
                '<div class="recipe-dropdown-menu">';
            html += '<div class="recipe-item active" data-recipe="all">All (Profit Overview)</div>';
            html += '<div class="recipe-category">Mote Conversions</div>';
            html += '<div class="recipe-item" data-recipe="mote_primals">Mote → Primals</div>';
            html += '<div class="recipe-item" data-recipe="planar_essence">Planar Essence</div>';
            html += '<div class="recipe-category">Transmutes (1-day CD)</div>';
            transmuteRecipes.forEach(function(r) { html += '<div class="recipe-item" data-recipe="' + r.id + '">' + r.name + "</div>"; });
            html += '<div class="recipe-category">Cloth Dailies (3d 20h CD)</div>';
            clothDailies.forEach(function(r) { html += '<div class="recipe-item" data-recipe="' + r.id + '">' + r.name + (r.yieldQty > 1 ? " ×" + r.yieldQty : "") + "</div>"; });
            html += '</div></div></div>';
            return html;
        }

        var controls = buildTxDropdownHTML();
        var colLeft = "";
        colLeft += '<div class="panel"><h2>Cooldown Tracker</h2><div class="cd-tracker-label">Cloth Dailies (3d 20h)</div><div class="cd-tracker-row"><div class="cd-tracker-field"><input type="number" id="cd_cloth_days" value="0" min="0" max="4"><span>d</span></div><div class="cd-tracker-field"><input type="number" id="cd_cloth_hours" value="0" min="0" max="23"><span>h</span></div><div class="cd-tracker-field"><input type="number" id="cd_cloth_mins" value="0" min="0" max="59"><span>m</span></div><button class="cd-set-btn" onclick="cdUpdate(\'cloth\')">Set</button><button class="cd-craft-btn" onclick="cdJustCrafted(\'cloth\')">Just Crafted!</button></div><div class="cd-tracker-label" style="border-top:1px solid #2a2a44;padding-top:8px;margin-top:4px">Transmute (1d)</div><div class="cd-tracker-row"><div class="cd-tracker-field"><input type="number" id="cd_transmute_hours" value="0" min="0" max="23"><span>h</span></div><div class="cd-tracker-field"><input type="number" id="cd_transmute_mins" value="0" min="0" max="59"><span>m</span></div><button class="cd-set-btn" onclick="cdUpdate(\'transmute\')">Set</button><button class="cd-craft-btn" onclick="cdJustCrafted(\'transmute\')">Just Crafted!</button></div></div>';

        colLeft += '<div class="panel tx-filterable">' + txCollH2("Mote Prices", "motes") + '<div class="panel-body" data-panel-body="tx-motes"><div class="price-table">';
        txPrimals.forEach(function(p) {
            var inputId = "tx_mote_" + p.id;
            txNameToInput[p.mote] = inputId;
            var recipes = (itemToRecipes[p.mote] || []).concat(["mote_primals"]).filter(function(v, i, a) { return a.indexOf(v) === i; });
            colLeft += txMoteRow(p.mote, inputId, recipes);
        });
        colLeft += "</div></div></div>";

        var gemItems = Object.keys(gems).sort();
        if (gemItems.length > 0) {
            colLeft += '<div class="panel tx-filterable">' + txCollH2("Gem Prices", "gems") + '<div class="panel-body" data-panel-body="tx-gems"><div class="price-table">';
            gemItems.forEach(function(gem) {
                var inputId = "tx_gem_" + sanitizeId(gem);
                txNameToInput[gem] = inputId;
                colLeft += txTableRow(gem, inputId, 0, true, itemToRecipes[gem]);
            });
            colLeft += "</div></div></div>";
        }

        colLeft += '<div class="panel tx-filterable">' + txCollH2("Cloth & Planar Essence", "cloth") + '<div class="panel-body" data-panel-body="tx-cloth"><div class="price-table">';
        var clothMats = [
            { name: "Bolt of Imbued Netherweave", id: "tx_imbued_bolt" },
            { name: "Bolt of Netherweave", id: "tx_bolt_nw" },
            { name: "Netherweave Cloth", id: "tx_cloth" },
            { name: "Arcane Dust", id: "tx_dust" },
            { name: "Lesser Planar Essence", id: "tx_lesser_planar" },
            { name: "Greater Planar Essence", id: "tx_greater_planar" }
        ];
        clothMats.forEach(function(m) {
            txNameToInput[m.name] = m.id;
            colLeft += txTableRow(m.name, m.id, 0, true, itemToRecipes[m.name]);
        });
        colLeft += "</div></div></div>";

        var colRight = '<div class="panel tx-filterable">' + txCollH2("Primal Market Prices", "primals") + '<div class="panel-body" data-panel-body="tx-primals"><div class="price-table">';
        txPrimals.forEach(function(p) {
            var inputId = "tx_primal_" + p.id;
            txNameToInput[p.primal] = inputId;
            var recipes = (itemToRecipes[p.primal] || []).concat(["mote_primals"]).filter(function(v, i, a) { return a.indexOf(v) === i; });
            colRight += txTableRow(p.primal, inputId, 0, true, recipes);
        });
        colRight += "</div></div></div>";

        colRight += '<div class="panel tx-filterable">' + txCollH2("Product Sale Prices", "sales") + '<div class="panel-body" data-panel-body="tx-sales"><div class="price-table">';
        transmuteRecipes.forEach(function(r) {
            var inputId = "tx_sale_" + r.id;
            txNameToInput[r.product || r.name] = inputId;
            colRight += txTableRow(r.product || r.name, inputId, 0, true, [r.id]);
        });
        clothDailies.forEach(function(r) {
            var inputId = "tx_sale_" + r.id;
            txNameToInput[r.name] = inputId;
            var label = r.yieldQty > 1 ? r.name + " (×" + r.yieldQty + ")" : r.name;
            colRight += txTableRow(label, inputId, 0, true, [r.id]);
        });
        colRight += "</div></div></div>";

        colRight += '<div class="panel tx-filterable">' + txCollH2("Deposits & Settings", "deposits") + '<div class="panel-body" data-panel-body="tx-deposits"><div class="price-table">';
        colRight += txTableRow("All Motes (deposit)", "tx_deposit_mote", depositDefaults.tx_deposit_mote || 0, false, ["mote_primals", "planar_essence"]);
        colRight += txTableRow("All Primals (deposit)", "tx_deposit_primal", depositDefaults.tx_deposit_primal || 0, false, ["mote_primals"]);
        transmuteRecipes.forEach(function(r) { colRight += txTableRow((r.product || r.name) + " (deposit)", "tx_deposit_" + r.id, depositDefaults["tx_deposit_" + r.id] || 0, false, [r.id]); });
        clothDailies.forEach(function(r) { colRight += txTableRow(r.name + " (deposit)", "tx_deposit_" + r.id, depositDefaults["tx_deposit_" + r.id] || 0, false, [r.id]); });
        colRight += '<div class="price-table-row"><span class="pt-name">AH Cut</span><div class="price-control"><input type="number" id="tx_ah_cut" value="5" step="0.1"><span style="color:#888;font-size:0.82em;margin-left:2px;">%</span></div></div>';
        colRight += "</div></div></div>";

        var main = controls + '<div id="tx-view-all"><div class="tier-label">Profit Overview <span class="sort-toggle"><button id="tx-sort-profit" class="sort-btn active" onclick="setSortBy(\'tx\',\'profit\')">Gold</button><button id="tx-sort-pct" class="sort-btn" onclick="setSortBy(\'tx\',\'pct\')">% Margin</button></span></div><table class="alch-summary"><thead><tr><th>Item / Recipe</th><th>Cost</th><th>Revenue</th><th>Profit</th><th>Margin</th><th style="color:#a78bfa">Daily Sold</th><th style="color:#a78bfa">Avg Price</th></tr></thead><tbody id="tx-summary-body"></tbody></table></div>';
        main += '<div id="tx-view-mote_primals" class="tx-view" style="display:none"><div class="tier-label">Mote → Primal Conversions</div><table class="alch-summary"><thead><tr><th>Primal</th><th>10× Mote Cost</th><th>Primal Price</th><th>Revenue (−AH%)</th><th>Deposit</th><th>Profit</th></tr></thead><tbody id="tx-mote-table-body"></tbody></table><div class="tier-label" style="margin-top:16px">Planar Essence Conversion</div><table class="alch-summary"><thead><tr><th>Conversion</th><th>Cost (3× Lesser)</th><th>Greater Price</th><th>Revenue</th><th>Profit</th></tr></thead><tbody id="tx-planar-inline-body"></tbody></table></div>';
        main += '<div id="tx-view-planar_essence" class="tx-view" style="display:none"><div class="card"><h3>Planar Essence Conversion</h3><div class="sourcing"><div class="sourcing-title">Ingredients</div><div class="sourcing-row fixed"><span>3x Lesser Planar Essence</span><span class="cost" id="tx_planar_lesser_cost">-</span></div></div><div class="card-row"><span class="label">Craft cost (3× Lesser)</span><span class="value" id="tx_planar_craft_cost">-</span></div><div class="card-row"><span class="label">Greater Planar Essence price</span><span class="value" id="tx_planar_sale">-</span></div><div class="card-row"><span class="label">AH cut</span><span class="value" id="tx_planar_ah_cut">-</span></div><div class="card-row highlight"><span class="label">Profit</span><span class="value" id="tx_planar_profit">-</span></div></div></div>';
        transmuteRecipes.forEach(function(r) { main += buildRecipeView(r, sanitizeId, txPrimals); });
        clothDailies.forEach(function(r) { main += buildClothView(r, sanitizeId, txPrimals); });

        return {
            colLeft: colLeft,
            colRight: colRight,
            main: main
        };
    }

    global.AppTransmutesView = {
        buildView: buildView
    };
})(window);
