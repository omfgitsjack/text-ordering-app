(function () {
    "use strict";

    angular
        .module('app.admin', [])
        .controller('adminController', adminController);

    function adminController($scope, $timeout, OrderService, DateTimeService) {
        $scope.orderService = OrderService;
        var me = this;
        var now = DateTimeService.now();

        $scope.yesterdayDay = DateTimeService.now().subtract(1, 'days').startOf('day');
        $scope.todayDay = DateTimeService.now().startOf('day');

        // If it's today before 4pm, show yesterday's order.
        $scope.yesterday = function() {
            $scope.currentDay = $scope.yesterdayDay;
            $scope.currentAggregateOrder = $scope.yesterdayAggregateOrder;
            $scope.currentOrderLIst = $scope.yesterdayOrderList;
        };

        $scope.today = function() {
            $scope.currentDay = $scope.todayDay;
            $scope.currentAggregateOrder = $scope.todayAggregateOrder;
            $scope.currentOrderLIst = $scope.todayOrderList;
        };

        me.init = function() {

            me.pollOrders = function() {
                OrderService.getToday()
                    .success(function(res) {
                        $scope.todayAggregateOrder = $scope.orderService.aggregateTransformer(res);
                        $scope.todayOrderList = $scope.orderService.orderListTransformer(res);
                    });

                OrderService.getYesterday()
                    .success(function(res) {
                        $scope.yesterdayAggregateOrder = $scope.orderService.aggregateTransformer(res);
                        $scope.yesterdayOrderList = $scope.orderService.orderListTransformer(res);
                    });
            };

            me.pollOrders();

            $timeout(function() {
                me.pollOrders();
            }, 5000);

            if (0 <= now.get('hour') && now.get('hour') < 16 && now.get('date') === $scope.todayDay.get('date')) {
                $scope.yesterday();
            } else {
                $scope.today();
            }
        };

        me.init();
    }

})();