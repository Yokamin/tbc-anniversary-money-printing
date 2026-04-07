(function(global) {
    "use strict";

    var STORAGE_KEYS = {
        ALCH_STORAGE_KEY: "tbc_alchemy_calculator",
        ALCH_LOCKS_KEY: "tbc_alchemy_locks",
        TAB_STORAGE_KEY: "tbc_calculator_tab",
        ALCH_RECIPE_KEY: "tbc_alchemy_selected_recipe",
        ALCH_HIDDEN_KEY: "tbc_alchemy_hidden_recipes",
        ALCH_COLLAPSED_KEY: "tbc_alchemy_collapsed_panels",
        ENCH_STORAGE_KEY: "tbc_enchanting_calculator",
        ENCH_LOCKS_KEY: "tbc_enchanting_locks",
        ENCH_RECIPE_KEY: "tbc_enchanting_selected_recipe",
        LW_STORAGE_KEY: "tbc_lw_calculator",
        LW_LOCKS_KEY: "tbc_lw_locks",
        LW_RECIPE_KEY: "tbc_lw_selected_recipe",
        ALCH_TSM_KEY: "tbc_alch_tsm",
        GEAR_TSM_KEY: "tbc_gear_tsm",
        TX_TSM_KEY: "tbc_tx_tsm",
        COOK_TSM_KEY: "tbc_cook_tsm",
        ENCH_TSM_KEY: "tbc_ench_tsm",
        LW_TSM_KEY: "tbc_lw_tsm",
        ALCH_PROC_KEY: "tbc_alch_proc_rate",
        ALCH_BATCH_KEY: "tbc_alch_batch",
        EV_SORT_KEY: "tbc_ev_sort",
        EV_VIEW_KEY: "tbc_ev_view",
        EV_HIDDEN_KEY: "tbc_ev_hidden"
    };

    global.AppConstants = {
        STORAGE_KEYS: STORAGE_KEYS
    };
})(window);
