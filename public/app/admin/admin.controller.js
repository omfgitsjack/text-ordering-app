(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('adminController', adminController);

    function adminController($scope, $timeout, $mdSidenav, $mdUtil, $log, $state) {

        $scope.toggleLeft = buildToggler('left');

        function buildToggler(navID) {
            var debounceFn =  $mdUtil.debounce(function(){
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            },300);
            return debounceFn;
        }

        $scope.leftClose = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };

        $scope.goToOrders = function() {
            $state.go('admin.orders');
        };

        $scope.goToFood = function() {
            $state.go('admin.food');
        }
    }

})();