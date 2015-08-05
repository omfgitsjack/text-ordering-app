(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('adminController', adminController);

    function adminController($scope, $timeout, $mdSidenav, $mdUtil, $log, $state, ShopService) {

        $scope.toggleLeft = buildToggler('left');

        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 300);
            return debounceFn;
        }

        $scope.leftClose = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };

        $scope.goToOrders = function () {
            $state.go('admin.orders');
        };

        $scope.goToFoodMenu = function () {
            $state.go('admin.food');
        };

        $scope.goToDrinkMenu = function () {
            $state.go('admin.drinks');
        };

        $scope.changeStoreStatus = function () {
            // Dont do anything.
        };

        // Initialize ShopService
        ShopService
            .get()
            .success(function (item) {
                $scope.shop = {
                    is_open: item['is_open']
                };

                $scope.$watch('shop', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        ShopService
                            .update(newVal)
                            .success(function (res) {
                                toastr.success("You updated your shop's status");
                            });
                    }
                }, true)
            });
    }

})();
