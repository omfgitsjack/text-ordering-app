(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('foodController', foodController);

    function foodController($scope, FoodService) {

        var updateFoodMenu = function() {
            FoodService.get()
                .success(function (res) {
                    $scope.food = res;
                });
        };

        updateFoodMenu();
    }

})();