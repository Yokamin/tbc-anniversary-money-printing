(function(global) {
    "use strict";

    function createProcControls(config) {
        var currentRecipeId = null;

        function renderResultsHtml(crafts, procRate, craftCost, revenuePerUnit) {
            var totalCost = craftCost * crafts;
            var extraYield = crafts * (procRate / 100);
            var yieldWithProc = crafts + extraYield;
            var profitNoProc = (crafts * revenuePerUnit) - totalCost;
            var profitWithProc = (yieldWithProc * revenuePerUnit) - totalCost;
            var procBonus = profitWithProc - profitNoProc;
            var marginNoProc = totalCost > 0 ? (profitNoProc / totalCost * 100).toFixed(1) + "%" : "—";
            var marginWithProc = totalCost > 0 ? (profitWithProc / totalCost * 100).toFixed(1) + "%" : "—";
            function pRow(lbl, val, hl) {
                return '<div class="proc-row' + (hl ? " hl" : "") + '"><span class="proc-row-lbl">' + lbl + '</span><span class="proc-row-val">' + val + "</span></div>";
            }
            function pgold(v) { return '<span class="' + config.profitClass(v) + '">' + (v >= 0 ? "+" : "") + config.gold(v) + "</span>"; }
            return pRow("Input cost", config.gold(totalCost)) +
                '<hr class="proc-divider">' +
                '<div style="font-size:0.75em;color:#5a5a8c;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">Without procs</div>' +
                pRow("Yield", crafts + " items") +
                pRow("Profit", pgold(profitNoProc) + ' <span style="color:#555">(' + marginNoProc + ")</span>", true) +
                '<hr class="proc-divider">' +
                '<div style="font-size:0.75em;color:#5a3a8c;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">With procs on rate</div>' +
                pRow('Expected yield', yieldWithProc.toFixed(1) + ' items <span style="color:#a78bfa">(' + "+" + extraYield.toFixed(1) + ")</span>") +
                pRow("Profit from bonus yield", pgold(procBonus)) +
                '<hr class="proc-divider">' +
                pRow("Profit", pgold(profitWithProc) + ' <span style="color:#555">(' + marginWithProc + ")</span>", true);
        }

        function modalUpdate() {
            var overlay = document.getElementById("proc-overlay");
            if (!overlay || !overlay.classList.contains("open")) return;
            var resultsEl = document.getElementById("proc-results");
            if (!resultsEl) return;
            var crafts = parseInt((document.getElementById("proc-crafts") || {}).value, 10) || 100;
            var r = config.findResultByRecipeId(currentRecipeId);
            if (!r) {
                resultsEl.innerHTML = '<div style="color:#888;font-size:0.85em;padding:8px 0">Import prices first to see calculations.</div>';
                return;
            }
            var ahCutPct = config.getVal("alch_ah_cut") / 100;
            var revenuePerUnit = r.salePrice * (1 - ahCutPct);
            resultsEl.innerHTML = renderResultsHtml(crafts, config.getProcRate(), r.craftCost, revenuePerUnit);
        }

        function openModal(recipeId) {
            currentRecipeId = recipeId;
            var recipe = config.findRecipe(recipeId);
            var titleEl = document.getElementById("proc-modal-title");
            if (titleEl && recipe) titleEl.textContent = recipe.name;
            var rateInput = document.getElementById("proc-rate-input");
            if (rateInput) rateInput.value = config.getProcRate();
            var overlay = document.getElementById("proc-overlay");
            if (overlay) overlay.classList.add("open");
            modalUpdate();
        }

        function closeModal() {
            var overlay = document.getElementById("proc-overlay");
            if (overlay) overlay.classList.remove("open");
            currentRecipeId = null;
        }

        function saveRate() {
            var inp = document.getElementById("proc-rate-input");
            var rate = parseFloat((inp || {}).value) || 20;
            config.setProcRate(rate);
            localStorage.setItem(config.procKey, rate);
            modalUpdate();
            config.forEachNonTransmuteRecipe(function(recipeId) {
                inlineUpdate(recipeId);
            });
        }

        function step(delta) {
            var inp = document.getElementById("proc-crafts");
            if (!inp) return;
            inp.value = Math.max(1, (parseInt(inp.value, 10) || 100) + delta);
            modalUpdate();
        }

        function resetCrafts() {
            var inp = document.getElementById("proc-crafts");
            if (inp) inp.value = 100;
            modalUpdate();
        }

        function inlineUpdate(recipeId) {
            var resultsEl = document.getElementById("proc-il-results-" + recipeId);
            if (!resultsEl) return;
            var rateLabel = document.getElementById("proc-il-rate-label-" + recipeId);
            if (rateLabel) rateLabel.textContent = "at " + config.getProcRate() + "% proc rate";
            var craftsInp = document.getElementById("proc-il-crafts-" + recipeId);
            var crafts = parseInt((craftsInp || {}).value, 10) || 100;
            var r = config.findResultByRecipeId(recipeId);
            if (!r) {
                resultsEl.innerHTML = '<div style="color:#888;font-size:0.85em;padding:8px 0">Import prices first to see calculations.</div>';
                return;
            }
            var ahCutPct = config.getVal("alch_ah_cut") / 100;
            var revenuePerUnit = r.salePrice * (1 - ahCutPct);
            resultsEl.innerHTML = renderResultsHtml(crafts, config.getProcRate(), r.craftCost, revenuePerUnit);
        }

        function inlineStep(recipeId, delta) {
            var inp = document.getElementById("proc-il-crafts-" + recipeId);
            if (!inp) return;
            inp.value = Math.max(1, (parseInt(inp.value, 10) || 100) + delta);
            inlineUpdate(recipeId);
        }

        function inlineReset(recipeId) {
            var inp = document.getElementById("proc-il-crafts-" + recipeId);
            if (inp) inp.value = 100;
            inlineUpdate(recipeId);
        }

        return {
            step: step,
            resetCrafts: resetCrafts,
            openModal: openModal,
            closeModal: closeModal,
            saveRate: saveRate,
            modalUpdate: modalUpdate,
            inlineStep: inlineStep,
            inlineReset: inlineReset,
            inlineUpdate: inlineUpdate
        };
    }

    global.AppProcControls = { createProcControls: createProcControls };
})(window);
