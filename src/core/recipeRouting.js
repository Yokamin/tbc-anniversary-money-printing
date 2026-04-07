(function(global) {
    "use strict";

    function createRecipeRouter(options) {
        var routes = options.routes || [];
        var defaultSelect = options.defaultSelect || function() {};

        function selectByElement(el, recipeId) {
            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                if (el.closest(route.selector)) {
                    route.select(recipeId);
                    return;
                }
            }
            defaultSelect(recipeId);
        }

        return {
            selectByElement: selectByElement
        };
    }

    global.AppRecipeRouting = {
        createRecipeRouter: createRecipeRouter
    };
})(window);
