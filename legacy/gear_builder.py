import re

with open("main.html", "r") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "// ===== ALCHEMY: UI GENERATION =====" in line:
        start_idx = i
    if "// ===== TAB SWITCHING ====" in line:
        end_idx = i
        break

alch_code_lines = lines[start_idx:end_idx]
alch_code = "".join(alch_code_lines)

# Create gear code by replacing keywords carefully
gear_code = alch_code
gear_code = gear_code.replace("// ===== ALCHEMY:", "// ===== GEAR:")
gear_code = gear_code.replace("ALCHEMY_RECIPES", "GEAR_RECIPES")
gear_code = gear_code.replace("ALCH_LOCKS_KEY", "GEAR_LOCKS_KEY")
gear_code = gear_code.replace("ALCH_STORAGE_KEY", "GEAR_STORAGE_KEY")
gear_code = gear_code.replace("ALCH_HIDDEN_KEY", "GEAR_HIDDEN_KEY")
gear_code = gear_code.replace("ALCH_RECIPE_KEY", "GEAR_RECIPE_KEY")
gear_code = gear_code.replace("ALCH_COLLAPSED_KEY", "GEAR_COLLAPSED_KEY")
gear_code = gear_code.replace("alchNameToInput", "gearNameToInput")

# Rename functions
gear_code = gear_code.replace("function alchInit", "function gearInit")
gear_code = gear_code.replace("function alchImportPrices", "function gearImportPrices")
gear_code = gear_code.replace("function alchSaveToStorage", "function gearSaveToStorage")
gear_code = gear_code.replace("function alchLoadFromStorage", "function gearLoadFromStorage")
gear_code = gear_code.replace("function alchCalculate", "function gearCalculate")
gear_code = gear_code.replace("function alchSelectRecipe", "function gearSelectRecipe")

gear_code = gear_code.replace("alchInit()", "gearInit()")
gear_code = gear_code.replace("alchImportPrices()", "gearImportPrices()")
gear_code = gear_code.replace("alchSaveToStorage()", "gearSaveToStorage()")
gear_code = gear_code.replace("alchLoadFromStorage()", "gearLoadFromStorage()")
gear_code = gear_code.replace("alchCalculate()", "gearCalculate()")
gear_code = gear_code.replace("alchSelectRecipe(", "gearSelectRecipe(")

# Replace function internals
gear_code = gear_code.replace("getHiddenRecipes()", "getGearHiddenRecipes()")
gear_code = gear_code.replace("setHiddenRecipes(", "setGearHiddenRecipes(")
gear_code = gear_code.replace("applyHiddenRecipes()", "applyGearHiddenRecipes()")
gear_code = gear_code.replace("function getHiddenRecipes", "function getGearHiddenRecipes")
gear_code = gear_code.replace("function setHiddenRecipes", "function setGearHiddenRecipes")
gear_code = gear_code.replace("function applyHiddenRecipes", "function applyGearHiddenRecipes")

gear_code = gear_code.replace("buildManageRecipesHTML", "buildGearManageRecipesHTML")
gear_code = gear_code.replace("buildRecipeDropdownHTML", "buildGearRecipeDropdownHTML")
gear_code = gear_code.replace("buildAllViewHTML", "buildGearAllViewHTML")
gear_code = gear_code.replace("buildRecipeDetailHTML", "buildGearRecipeDetailHTML")

gear_code = gear_code.replace("alchTableRow", "gearTableRow")

gear_code = gear_code.replace("CATEGORY_ORDER", "GEAR_CATEGORY_ORDER")

# DOM IDs and classes
gear_code = gear_code.replace("'alch-view-all'", "'gear-view-all'")
gear_code = gear_code.replace("'alch-view-'", "'gear-view-'")
gear_code = gear_code.replace("alch-view", "gear-view")

gear_code = gear_code.replace("'alch-col-left'", "'gear-col-left'")
gear_code = gear_code.replace("'alch-col-right'", "'gear-col-right'")
gear_code = gear_code.replace("'alch-main'", "'gear-main'")

gear_code = gear_code.replace("'alch_ah_import'", "'gear_ah_import'")
gear_code = gear_code.replace("'alch_import_status'", "'gear_import_status'")

gear_code = gear_code.replace("'alch_mat_'", "'gear_mat_'")
gear_code = gear_code.replace("'alch_sale_'", "'gear_sale_'")
gear_code = gear_code.replace("'alch_deposit_'", "'gear_deposit_'")
gear_code = gear_code.replace("'alch_vendor_'", "'gear_vendor_'")
gear_code = gear_code.replace("'alch_ah_cut'", "'gear_ah_cut'")

gear_code = gear_code.replace("'alch_'", "'gear_'")

gear_code = gear_code.replace("alch-filterable", "gear-filterable")
gear_code = gear_code.replace("alch-summary", "gear-summary")

gear_code = gear_code.replace("'tab-alchemy'", "'tab-gear'")

gear_code = gear_code.replace("recipe-manage", "gear-recipe-manage")
gear_code = gear_code.replace("recipe-dropdown", "gear-recipe-dropdown")
gear_code = gear_code.replace("recipe-category", "gear-recipe-category")
gear_code = gear_code.replace("recipe-item", "gear-recipe-item")
gear_code = gear_code.replace("recipe-hidden", "gear-recipe-hidden")

# Modifications for bop items
# In buildGearRecipeDetailHTML:
bop_html_logic = """
                } else if (ing.type === 'bop') {
                    html += '<div class="sourcing-row fixed">' +
                        '<span>' + ing.qty + 'x ' + ing.item + '</span>' +
                        '<span class="cost" style="color:#f59e0b">BOP</span>' +
                    '</div>';
"""
gear_code = gear_code.replace("} else {\n                    html += '<div class=\"sourcing-row fixed\">'", bop_html_logic + "} else {\n                    html += '<div class=\"sourcing-row fixed\">'")

# Add bop profit calculation to gearCalculate
calc_bop_logic = """
                        if (ing.type === 'ah') {
                            price = getVal('gear_mat_' + sanitizeId(ing.item));
                        } else if (ing.type === 'vendor') {
                            price = getVal('gear_vendor_' + sanitizeId(ing.item));
                        } else if (ing.type === 'bop') {
                            price = 0; // BOP items don't have a direct gold cost in this calculator
                        }
"""
gear_code = re.sub(r"if \(ing\.type === 'ah'\) \{[^{}]*\} else if \(ing\.type === 'vendor'\) \{[^{}]*\}", calc_bop_logic.strip(), gear_code)


profit_ui_logic = """
                var bopItem = r.ingredients.find(i => i.type === 'bop');
                if (bopItem) {
                    var profitPerBop = profit / bopItem.qty;
                    html_bop_profit = '<div class="card-row highlight" style="margin-top: 4px; padding-top: 4px; border-top: none;">' +
                        '<span class="label">Profit per ' + bopItem.item + '</span>' +
                        '<span class="value"><span class="' + profitClass(profitPerBop) + '">' + (profitPerBop >= 0 ? '+' : '') + gold(profitPerBop) + '</span></span>' +
                    '</div>';
                    if (el('gear_' + r.id + '_deposit_note')) {
                        el('gear_' + r.id + '_deposit_note').insertAdjacentHTML('beforebegin', html_bop_profit);
                    }
                }
"""

gear_code = gear_code.replace("var depositEl = el('gear_' + r.id + '_deposit_note');", "var depositEl = el('gear_' + r.id + '_deposit_note');\n" + profit_ui_logic)

lines.insert(end_idx, gear_code + "\n")

# Inject gear Init handlers at the bottom
init_idx = -1
for i, line in enumerate(lines):
    if "alchInit();" in line:
        init_idx = i
    if "alchLoadFromStorage();" in line:
        load_idx = i
    if "alchCalculate();" in line:
        calc_idx = i

lines.insert(init_idx + 1, "        gearInit();\n")
# find new indices because we inserted
for i, line in enumerate(lines):
    if "alchLoadFromStorage();" in line:
        load_idx = i
        break
lines.insert(load_idx + 1, "        gearLoadFromStorage();\n")

for i, line in enumerate(lines):
    if "alchCalculate();" in line:
        calc_idx = i
        break
lines.insert(calc_idx + 1, "        gearCalculate();\n")

# Event listeners
for i, line in enumerate(lines):
    if "document.getElementById('tab-alchemy').addEventListener" in line:
        listen_idx = i
        break

listen_code = """
            document.getElementById('tab-gear').addEventListener(eventType, function(e) {
                if (e.target.tagName === 'INPUT' && e.target.id) {
                    updateGSCDisplay(e.target.id);
                    autoSizeInput(e.target);
                    gearCalculate();
                }
            });
"""
lines.insert(listen_idx + 1, listen_code)

for i, line in enumerate(lines):
    if "var manageBtn = e.target.closest('#recipe-manage-btn');" in line:
        manage_idx = i
        break

manage_code = """
            var manageBtnGear = e.target.closest('#gear-recipe-manage-btn');
            if (manageBtnGear) {
                var overlay = document.getElementById('gear-recipe-manage-overlay');
                if (overlay) overlay.remove();
                document.getElementById('tab-gear').insertAdjacentHTML('beforeend', buildGearManageRecipesHTML());
                document.getElementById('gear-recipe-manage-overlay').classList.add('open');
                return;
            }
"""
lines.insert(manage_idx, manage_code)

# Add remaining event delegators that need doubling up (close manage, dropdown, summary row)
with open("main.html", "w") as f:
    f.writelines(lines)
