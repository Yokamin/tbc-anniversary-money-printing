(function(global) {
    "use strict";

    function createRecipeNavigationClicks(config) {
        var recipeRouter = config.recipeRouter;
        var tabNav = config.tabNav;

        function handle(target) {
            var backBtn = target.closest(".recipe-back-btn");
            if (backBtn) {
                recipeRouter.selectByElement(backBtn, "all");
                return true;
            }

            var ddTrigger = target.closest(".recipe-dropdown-trigger");
            if (ddTrigger) {
                var dd = ddTrigger.closest(".recipe-dropdown");
                if (dd) dd.classList.toggle("open");
                return true;
            }

            var recipeItem = target.closest(".recipe-item");
            if (recipeItem) {
                recipeRouter.selectByElement(recipeItem, recipeItem.dataset.recipe);
                return true;
            }

            [
                "recipe-dropdown",
                "gear-recipe-dropdown",
                "tx-recipe-dropdown",
                "cook-recipe-dropdown",
                "ench-recipe-dropdown",
                "lw-recipe-dropdown"
            ].forEach(function(id) {
                var dd = document.getElementById(id);
                if (dd && !dd.contains(target)) dd.classList.remove("open");
            });

            var summaryRow = target.closest(".alch-summary-row, .gear-summary-row, .tx-summary-row, .cook-summary-row, .ench-summary-row, .lw-summary-row");
            if (summaryRow) {
                recipeRouter.selectByElement(summaryRow, summaryRow.dataset.recipe);
                return true;
            }

            var tabBtn = target.closest(".tab-btn");
            if (tabBtn) {
                tabNav.handleTabButtonClick(tabBtn);
                return true;
            }

            return false;
        }

        return { handle: handle };
    }

    global.AppRecipeNavigationClicks = { createRecipeNavigationClicks: createRecipeNavigationClicks };
})(window);
