(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('foodController', foodController);

    function foodController($scope, FoodService) {

        var getFoodMenu = function() {
            FoodService.getAll()
                .success(function (res) {
                    $scope.food = res;

                    $scope.$watch('food', function(newVal, oldVal) {
                        if (newVal !== oldVal) {
                            FoodService
                                .update(newVal);
                            toastr.success('You have updated the menu!', 1000);
                        }
                    }, true);
                });
        };

        getFoodMenu();
    }

})();