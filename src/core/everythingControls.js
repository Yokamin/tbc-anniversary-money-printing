(function(global) {
    "use strict";

    function createEverythingControls(config) {
        function saveHidden() {
            localStorage.setItem(config.hiddenKey, JSON.stringify(config.getHidden()));
        }

        function refreshFilter() {
            var body = document.getElementById("ev-filter-body");
            if (body) body.innerHTML = config.buildFilterHTML(config.getSections(), config.getHidden());
        }

        function toggleTab(tabId) {
            var hidden = config.getHidden();
            hidden["tab_" + tabId] = !hidden["tab_" + tabId];
            saveHidden();
            refreshFilter();
            config.calculate();
        }

        function toggleCat(catId) {
            var hidden = config.getHidden();
            hidden["cat_" + catId] = !hidden["cat_" + catId];
            saveHidden();
            refreshFilter();
            config.calculate();
        }

        function toggleItem(itemId) {
            var hidden = config.getHidden();
            hidden["item_" + itemId] = !hidden["item_" + itemId];
            saveHidden();
            refreshFilter();
            config.calculate();
        }

        function openFilter() {
            refreshFilter();
            var ov = document.getElementById("ev-filter-overlay");
            if (ov) ov.classList.add("open");
        }

        function closeFilter() {
            var ov = document.getElementById("ev-filter-overlay");
            if (ov) ov.classList.remove("open");
        }

        function resetFilter() {
            config.setHidden({});
            saveHidden();
            refreshFilter();
            config.calculate();
        }

        function setSort(by) {
            config.setSort(by);
            localStorage.setItem(config.sortKey, by);
            document.querySelectorAll(".ev-sort-btn").forEach(function(b) { b.classList.toggle("active", b.dataset.sort === by); });
            config.calculate();
        }

        function setView(view) {
            config.setView(view);
            localStorage.setItem(config.viewKey, view);
            document.querySelectorAll(".ev-view-btn").forEach(function(b) { b.classList.toggle("active", b.dataset.view === view); });
            config.calculate();
        }

        return {
            toggleTab: toggleTab,
            toggleCat: toggleCat,
            toggleItem: toggleItem,
            openFilter: openFilter,
            closeFilter: closeFilter,
            resetFilter: resetFilter,
            setSort: setSort,
            setView: setView,
            refreshFilter: refreshFilter
        };
    }

    global.AppEverythingControls = { createEverythingControls: createEverythingControls };
})(window);
