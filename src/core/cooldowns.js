(function(global) {
    "use strict";

    function createCooldowns(config) {
        var storageKey = config.storageKey;
        var durations = config.durations;

        function load() {
            try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch (e) { return {}; }
        }

        function save(data) {
            localStorage.setItem(storageKey, JSON.stringify(data));
        }

        function update(type) {
            var days = parseInt((document.getElementById("cd_" + type + "_days") || { value: 0 }).value, 10) || 0;
            var hours = parseInt((document.getElementById("cd_" + type + "_hours") || { value: 0 }).value, 10) || 0;
            var mins = parseInt((document.getElementById("cd_" + type + "_mins") || { value: 0 }).value, 10) || 0;
            var ms = ((days * 24 + hours) * 60 + mins) * 60 * 1000;
            var data = load();
            data[type + "Expiry"] = Date.now() + ms;
            delete data[type + "Dismissed"];
            save(data);
            refresh();
        }

        function justCrafted(type) {
            var data = load();
            data[type + "Expiry"] = Date.now() + durations[type];
            delete data[type + "Dismissed"];
            save(data);
            refresh();
        }

        function refresh() {
            var data = load();
            var now = Date.now();
            var readyNames = [];
            ["cloth", "transmute"].forEach(function(type) {
                var expiry = data[type + "Expiry"];
                var el = document.getElementById("cd-" + type + "-time");
                if (!el) return;
                if (!expiry) { el.textContent = "--"; el.className = "cd-time"; return; }
                var remaining = expiry - now;
                if (remaining <= 0) {
                    el.textContent = "Ready!";
                    el.className = "cd-time cd-ready";
                    if (data[type + "Dismissed"] !== expiry) readyNames.push(type);
                } else {
                    var d = Math.floor(remaining / 86400000);
                    var h = Math.floor((remaining % 86400000) / 3600000);
                    var m = Math.floor((remaining % 3600000) / 60000);
                    var s = Math.floor((remaining % 60000) / 1000);
                    el.textContent = (d > 0 ? d + "d " : "") + h + "h " + m + "m " + s + "s";
                    el.className = "cd-time";
                }
            });
            if (readyNames.length > 0) {
                var overlay = document.getElementById("cd-popup-overlay");
                if (overlay && !overlay.classList.contains("cd-open")) {
                    var clothEl = document.getElementById("cd-cloth-time");
                    var txEl = document.getElementById("cd-transmute-time");
                    var msg = document.getElementById("cd-popup-msg");
                    if (msg) {
                        msg.innerHTML =
                            '<div style="font-size:1.3em;color:#4ade80;margin-bottom:12px">&#9711; Cooldown Ready!</div>' +
                            "<div>Cloth Dailies: <strong>" + (clothEl ? clothEl.textContent : "--") + "</strong></div>" +
                            "<div>Transmute: <strong>" + (txEl ? txEl.textContent : "--") + "</strong></div>";
                    }
                    overlay.classList.add("cd-open");
                }
            }
        }

        function dismissPopup() {
            var data = load();
            var now = Date.now();
            ["cloth", "transmute"].forEach(function(type) {
                if (data[type + "Expiry"] && data[type + "Expiry"] <= now) {
                    data[type + "Dismissed"] = data[type + "Expiry"];
                }
            });
            save(data);
            var overlay = document.getElementById("cd-popup-overlay");
            if (overlay) overlay.classList.remove("cd-open");
        }

        function init() {
            refresh();
            setInterval(refresh, 1000);
        }

        return { load: load, save: save, update: update, justCrafted: justCrafted, refresh: refresh, dismissPopup: dismissPopup, init: init };
    }

    global.AppCooldowns = { createCooldowns: createCooldowns };
})(window);
