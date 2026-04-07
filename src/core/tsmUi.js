(function(global) {
    "use strict";

    function createTsmUi(config) {
        var toGSC = config.toGSC;

        function age(ts) {
            if (!ts) return "";
            var diff = Date.now() - ts;
            if (diff < 60000) return "just now";
            if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
            if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
            if (diff < 604800000) return Math.floor(diff / 86400000) + "d ago";
            return Math.floor(diff / 604800000) + "w ago";
        }

        function gscHtml(val) {
            var gsc = toGSC(val);
            var h = "";
            if (gsc.g > 0) h += '<span style="color:#ffd700">' + gsc.g + "g</span> ";
            if (gsc.s > 0 || gsc.g > 0) h += '<span style="color:#c0c0c0">' + gsc.s + "s</span> ";
            h += '<span style="color:#cd7f32">' + gsc.c + "c</span>";
            return h;
        }

        function inputHtml(tsmObj, recipeId, field, tsmTab) {
            var data = tsmObj[recipeId] || {};
            var val = (data[field] || "").replace(/"/g, "&quot;");
            var ts = data[field + "Ts"] || 0;
            var ageHtml = '<span class="tsm-age" data-ts="' + ts + '">' + (ts ? age(ts) : "") + "</span>";
            var attrs = ' data-tsm-tab="' + tsmTab + '" data-tsm-recipe="' + recipeId + '" data-tsm-field="' + field + '" tabindex="-1"';
            if (field === "daily") {
                return '<div class="tsm-wrap"><input type="number" class="tsm-input tsm-daily" min="0" max="9999" step="1" value="' + val + '" placeholder="—"' + attrs + ">" + ageHtml + "</div>";
            }
            var numVal = parseFloat(data[field] || "0") || 0;
            var preview = '<span class="tsm-gsc-preview">' + (numVal > 0 ? gscHtml(numVal) : "") + "</span>";
            return '<div class="tsm-wrap"><input type="number" class="tsm-input tsm-price" min="0" step="0.0001" value="' + val + '" placeholder="—"' + attrs + ">" + preview + ageHtml + "</div>";
        }

        function saveField(tsmObj, storageKey, recipeId, field, value) {
            if (!tsmObj[recipeId]) tsmObj[recipeId] = {};
            tsmObj[recipeId][field] = value;
            tsmObj[recipeId][field + "Ts"] = Date.now();
            try { localStorage.setItem(storageKey, JSON.stringify(tsmObj)); } catch (e) {}
        }

        return { age: age, gscHtml: gscHtml, inputHtml: inputHtml, saveField: saveField };
    }

    global.AppTsmUi = { createTsmUi: createTsmUi };
})(window);
