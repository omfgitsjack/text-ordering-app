(function () {
    "use strict";

    angular
        .module('app.admin', [])
        .controller('adminController', adminController);

    function adminController($scope, OrderService) {
        $scope.orderService = OrderService;

        OrderService.getToday()
            .success(function(res) {
                $scope.todayAggregateOrder = $scope.orderService.aggregateTransformer(res);
                $scope.todayOrderList = $scope.orderService.orderListTransformer(res);
                console.log($scope.todayAggregateOrder);
                console.log($scope.todayOrderList);
            });
    }

})();