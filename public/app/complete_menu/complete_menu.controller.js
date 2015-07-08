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
                    
                    $scope.food = res.map(function(el) {
                        switch (el.id) {
                            case 21:
                            case 22:
                            case 23:
                            case 24:
                            case 25:
                                break;
                            default:
                                return el;
                        }
                    });
                });
        };

        getFoodMenu();
    }

})();