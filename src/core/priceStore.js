(function(global) {
    "use strict";

    function createPriceStore() {
        var groupsByName = {};
        var itemByInputId = {};

        function build(allMaps, excludePattern) {
            groupsByName = {};
            itemByInputId = {};
            allMaps.forEach(function(map) {
                for (var name in map) {
                    var id = map[name];
                    if (!id || (excludePattern && excludePattern.test(id))) continue;
                    if (!groupsByName[name]) groupsByName[name] = [];
                    if (groupsByName[name].indexOf(id) === -1) groupsByName[name].push(id);
                    itemByInputId[id] = name;
                }
            });
        }

        function getGroups() {
            return groupsByName;
        }

        function getItemName(inputId) {
            return itemByInputId[inputId];
        }

        function syncChanged(changedId, getInputById, onSyncedInput) {
            var source = getInputById(changedId);
            if (!source) return;
            var value = source.value;
            var itemName = itemByInputId[changedId];
            if (!itemName) return;
            var group = groupsByName[itemName] || [];
            group.forEach(function(id) {
                if (id === changedId) return;
                var sibling = getInputById(id);
                if (sibling && sibling.value !== value) {
                    sibling.value = value;
                    if (onSyncedInput) onSyncedInput(id, sibling);
                }
            });
        }

        function syncAll(getInputById, pickSource, onSyncedInput) {
            for (var name in groupsByName) {
                var group = groupsByName[name];
                if (group.length < 2) continue;
                var source = pickSource(group, getInputById);
                if (!source) continue;
                group.forEach(function(id) {
                    if (id === source.id) return;
                    var el = getInputById(id);
                    if (el && el.value !== source.value) {
                        el.value = source.value;
                        if (onSyncedInput) onSyncedInput(id, el);
                    }
                });
            }
        }

        return {
            build: build,
            getGroups: getGroups,
            getItemName: getItemName,
            syncChanged: syncChanged,
            syncAll: syncAll
        };
    }

    global.AppPriceStore = {
        create: createPriceStore
    };
})(window);

