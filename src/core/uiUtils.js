(function(global) {
    "use strict";

    function getVal(id) {
        var el = document.getElementById(id);
        if (!el) return 0;
        var parsed = parseFloat(el.value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function toGSC(value) {
        var totalCopper = Math.round(Math.abs(value) * 10000);
        var g = Math.floor(totalCopper / 10000);
        var s = Math.floor((totalCopper % 10000) / 100);
        var c = totalCopper % 100;
        return { g: g, s: s, c: c, negative: value < 0 };
    }

    function goldGSC(amount) {
        var gsc = toGSC(amount);
        var parts = [];
        if (gsc.g > 0) parts.push(gsc.g + "g");
        if (gsc.s > 0 || gsc.g > 0) parts.push(gsc.s + "s");
        parts.push(gsc.c + "c");
        return (gsc.negative ? "-" : "") + parts.join(" ");
    }

    function gold(amount) {
        return goldGSC(amount);
    }

    function updateGSCDisplay(inputId) {
        var value = getVal(inputId);
        var gsc = toGSC(value);
        var group = document.querySelector('.gsc-group[data-input="' + inputId + '"]');
        if (!group) return;
        var vals = group.querySelectorAll(".gsc-val");
        vals[0].textContent = gsc.g + "g";
        vals[1].textContent = gsc.s + "s";
        vals[2].textContent = gsc.c + "c";
    }

    function updateAllGSCDisplays() {
        document.querySelectorAll(".gsc-group").forEach(function(group) {
            updateGSCDisplay(group.dataset.input);
        });
    }

    function autoSizeInput(input) {
        var length = input.value.length || 1;
        input.style.width = (length * 9 + 16) + "px";
    }

    function autoSizeAllInputs() {
        document.querySelectorAll(".price-control input").forEach(autoSizeInput);
    }

    function profitClass(amount) {
        if (amount > 0.001) return "profit";
        if (amount < -0.001) return "loss";
        return "neutral";
    }

    function sanitizeId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    }

    global.AppUiUtils = {
        getVal: getVal,
        toGSC: toGSC,
        goldGSC: goldGSC,
        gold: gold,
        updateGSCDisplay: updateGSCDisplay,
        updateAllGSCDisplays: updateAllGSCDisplays,
        autoSizeInput: autoSizeInput,
        autoSizeAllInputs: autoSizeAllInputs,
        profitClass: profitClass,
        sanitizeId: sanitizeId
    };
})(window);

