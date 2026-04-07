(function(global) {
    "use strict";

    function readJson(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) || fallback; }
        catch (e) { return fallback; }
    }

    function readNumber(key, fallback) {
        var v = localStorage.getItem(key);
        return v == null ? fallback : (parseFloat(v) || fallback);
    }

    function readInt(key, fallback) {
        var v = localStorage.getItem(key);
        return v == null ? fallback : (parseInt(v, 10) || fallback);
    }

    global.AppStorageRead = {
        readJson: readJson,
        readNumber: readNumber,
        readInt: readInt
    };
})(window);
