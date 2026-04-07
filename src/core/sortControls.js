(function(global) {
    "use strict";

    function createSortControls(config) {
        function updateSortToggle(tab) {
            var sortBy = config.getSortBy(tab);
            ["profit", "pct"].forEach(function(by) {
                var btn = document.getElementById(tab + "-sort-" + by);
                if (btn) btn.classList.toggle("active", sortBy === by);
            });
        }

        function setSortBy(tab, by) {
            config.setSortBy(tab, by);
            config.calculateTab(tab);
            updateSortToggle(tab);
        }

        return {
            setSortBy: setSortBy,
            updateSortToggle: updateSortToggle
        };
    }

    global.AppSortControls = { createSortControls: createSortControls };
})(window);
