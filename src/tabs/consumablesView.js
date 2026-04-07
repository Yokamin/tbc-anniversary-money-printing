(function(global) {
    "use strict";

    function renderHtml(consumableData) {
        var catClass = {
            Battle: "cons-cat-battle",
            Guardian: "cons-cat-guardian",
            Flask: "cons-cat-flask",
            Food: "cons-cat-food",
            Potion: "cons-cat-potion",
            Oil: "cons-cat-oil"
        };

        function buildCard(cls) {
            var html = '<div class="cons-class-card">';
            html += '<div class="cons-class-header" style="color:' + cls.color + '">' + cls.cls + '<span class="cons-arrow">&#9660;</span></div>';
            cls.specs.forEach(function(spec) {
                html += '<div class="cons-spec-section">';
                html += '<div class="cons-spec-name">' + spec.spec + "</div>";
                html += '<table class="cons-table">';
                spec.items.forEach(function(item) {
                    var rowCls = item.alt ? ' class="cons-alt-row"' : "";
                    var badge = catClass[item.cat] || "cons-cat-oil";
                    var titleAt = item.note ? ' title="' + item.note.replace(/"/g, "&quot;") + '"' : "";
                    html += "<tr" + rowCls + ">";
                    html += '<td class="cons-cat-col"><span class="cons-cat-badge ' + badge + '">' + item.cat + "</span></td>";
                    html += "<td" + titleAt + '><span class="cons-item-name">' + item.name + "</span>";
                    if (item.alt) html += '<span class="cons-alt-badge">ALT</span>';
                    if (item.note) html += ' <span class="cons-note">' + item.note + "</span>";
                    html += "</td></tr>";
                });
                html += "</table></div>";
            });
            html += "</div>";
            return html;
        }

        var colOrder = [
            ["Mage", "Warlock", "Hunter", "Rogue", "Priest"],
            ["Shaman", "Paladin"],
            ["Warrior", "Druid"]
        ];
        var dataByClass = {};
        consumableData.forEach(function(cls) { dataByClass[cls.cls] = cls; });
        var cols = colOrder.map(function(names) {
            return names.map(function(n) { return dataByClass[n]; }).filter(Boolean);
        });

        var html = '<div class="cons-columns">';
        cols.forEach(function(col) {
            html += '<div class="cons-column">';
            col.forEach(function(cls) { html += buildCard(cls); });
            html += "</div>";
        });
        html += "</div>";
        return html;
    }

    global.AppConsumablesView = {
        renderHtml: renderHtml
    };
})(window);
