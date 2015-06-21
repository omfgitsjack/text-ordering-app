(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('ordersController', ordersController);

    function ordersController($scope, $timeout, OrderService, DateTimeService) {
        $scope.orderService = OrderService;
        var me = this;
        var now = DateTimeService.now();

        $scope.todayDay = DateTimeService.now().startOf('day');
        $scope.tomorrowDay = DateTimeService.now().add(1, 'days').startOf('day');

        // If it's today before 4pm, show yesterday's order.
        $scope.tomorrow = function () {
            $scope.currentDay = $scope.tomorrowDay;
        };

        $scope.today = function () {
            $scope.currentDay = $scope.todayDay;
        };

        me.init = function () {

            me.getOrders = function () {
                // If it's during delivery time, show the order to be delivered today.
                if (0 <= now.get('hour') && now.get('hour') < 16) {
                    $scope.today();
                } else {
                    // If it's after delivery time for today, show the order to be delivered tomorrow
                    $scope.tomorrow();
                }
                return OrderService.getCurrent()
                    .success(function (res) {
                        $scope.currentAggregateOrder = $scope.orderService.aggregateTransformer(res);
                        $scope.currentOrderList = $scope.orderService.orderListTransformer(res);
                        return true;
                    });
            };

            me.initPoll = function () {
                $timeout(function () {
                    me.getOrders().success(function() {
                        toastr.info('Updated Order List');
                        me.initPoll();
                    });
                }, 15000);
            };

            me.getOrders();
            me.initPoll();
        };

        me.init();
    }


})();