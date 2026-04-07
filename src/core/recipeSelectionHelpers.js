(function(global) {
    "use strict";

    function createRecipeSelectionHelpers(config) {
        function syncDropdown(dropdownSelector, labelId, recipeId) {
            var label = document.getElementById(labelId);
            document.querySelectorAll(dropdownSelector + " .recipe-item").forEach(function(el) {
                var isActive = el.dataset.recipe === recipeId;
                el.classList.toggle("active", isActive);
                if (isActive && label) label.textContent = el.textContent;
            });
        }

        function resetTabToMainView(tabName) {
            if (tabName === "alchemy") config.alchSelectRecipe("all");
            else if (tabName === "gear") config.gearSelectRecipe("all");
            else if (tabName === "transmutes") config.txSelectRecipe("all");
            else if (tabName === "cooking") config.cookSelectRecipe("all");
            else if (tabName === "enchanting") config.enchSelectRecipe("all");
            else if (tabName === "leatherworking") config.lwSelectRecipe("all");
        }

        return { syncDropdown: syncDropdown, resetTabToMainView: resetTabToMainView };
    }

    global.AppRecipeSelectionHelpers = { createRecipeSelectionHelpers: createRecipeSelectionHelpers };
})(window);
