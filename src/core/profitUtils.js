(function(global) {
    "use strict";

    function profitPctStr(profit, craftCost) {
        if (!craftCost || craftCost <= 0) return "—";
        return (profit / craftCost * 100).toFixed(1) + "%";
    }

    function sortResults(arr, sortBy, profitKey, costKey) {
        profitKey = profitKey || "profit";
        costKey = costKey || "craftCost";
        arr.sort(function(a, b) {
            if (sortBy === "pct") {
                var ca = a[costKey], cb = b[costKey];
                if (ca <= 0 && cb <= 0) return b[profitKey] - a[profitKey];
                if (ca <= 0) return 1;
                if (cb <= 0) return -1;
                return (b[profitKey] / cb) - (a[profitKey] / ca);
            }
            return b[profitKey] - a[profitKey];
        });
    }

    global.AppProfitUtils = {
        profitPctStr: profitPctStr,
        sortResults: sortResults
    };
})(window);
