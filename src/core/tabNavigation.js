(function(global) {
    "use strict";

    function createTabNavigation(options) {
        var storageKey = options.storageKey;
        var onResetTabToMainView = options.onResetTabToMainView || function() {};

        function switchTab(tabName) {
            document.querySelectorAll(".tab-btn").forEach(function(btn) {
                btn.classList.toggle("active", btn.dataset.tab === tabName);
            });
            document.querySelectorAll(".tab-content").forEach(function(el) {
                el.style.display = "none";
            });
            var target = document.getElementById("tab-" + tabName);
            if (target) target.style.display = "";
            localStorage.setItem(storageKey, tabName);
        }

        function handleTabButtonClick(tabBtn) {
            if (!tabBtn) return;
            if (tabBtn.classList.contains("active")) {
                onResetTabToMainView(tabBtn.dataset.tab);
            }
            switchTab(tabBtn.dataset.tab);
        }

        return {
            switchTab: switchTab,
            handleTabButtonClick: handleTabButtonClick
        };
    }

    global.AppTabNavigation = {
        createTabNavigation: createTabNavigation
    };
})(window);
