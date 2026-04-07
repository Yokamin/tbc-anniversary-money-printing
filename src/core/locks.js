(function(global) {
    "use strict";

    function createLockManager(config) {
        var defaultLocksKey = config.defaultLocksKey;

        function getLocks(key) {
            try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
        }

        function saveLocks(locks, key) {
            localStorage.setItem(key, JSON.stringify(locks));
        }

        function updateLockDisplay(inputId) {
            var btn = document.querySelector('.lock-btn[data-input="' + inputId + '"]');
            if (!btn) return;
            var locksKey = btn.dataset.locksKey || defaultLocksKey;
            var locks = getLocks(locksKey);
            var locked = !!locks[inputId];
            btn.classList.toggle("locked", locked);
            btn.innerHTML = locked ? "&#x1f512;" : "&#x1f513;";
            btn.title = locked ? "Price locked (click to unlock)" : "Click to lock price from import";
        }

        function updateAllLockDisplays() {
            document.querySelectorAll(".lock-btn").forEach(function(btn) {
                updateLockDisplay(btn.dataset.input);
            });
        }

        function toggleLock(inputId) {
            var btn = document.querySelector('.lock-btn[data-input="' + inputId + '"]');
            if (!btn) return;
            var locksKey = btn.dataset.locksKey || defaultLocksKey;
            var locks = getLocks(locksKey);
            locks[inputId] = !locks[inputId];
            saveLocks(locks, locksKey);
            updateLockDisplay(inputId);
        }

        return {
            getLocks: getLocks,
            saveLocks: saveLocks,
            updateLockDisplay: updateLockDisplay,
            updateAllLockDisplays: updateAllLockDisplays,
            toggleLock: toggleLock
        };
    }

    global.AppLocks = { createLockManager: createLockManager };
})(window);
