(function () {
    "use strict";

    angular
        .module('app.completeMenu')
        .controller('completeMenuController', completeMenuController);

    function completeMenuController($scope, FoodService) {

        var getFoodMenu = function() {
            FoodService.getAll()
                .success(function (res) {
                    // Filter out the drinks
                    
                    $scope.food = res.filter(function(el) {
                        return  !(el.id === 21 || 
                                el.id === 22 || 
                                el.id === 23 || 
                                el.id === 24 || 
                                el.id === 25); 
                    });
                });
        };

        getFoodMenu();
    }

})();