(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('ordersController', ordersController);

    function ordersController($scope, $timeout, $http,
                              OrderService,
                              DateTimeService,
                              LocationService) {

        $scope.orderService = OrderService;

        // Location filter box
        $scope.defaultLocation = {school: 'any', pickupLocation: 'any'};
        LocationService
            .get()
            .then(function (res) {
                $scope.locations = res.data;
                $scope.selectedLocation = $scope.defaultLocation;
            });
        $scope.selectedLocation = undefined;
        $scope.updateCurrentOrderList = function (list) {
            if ($scope.selectedLocation == undefined ||
                $scope.selectedLocation == $scope.defaultLocation) {
                $scope.currentOrderList = list;
                return;
            }
            $scope.currentOrderList = list.filter(function (el) {
                var containsSchool = el.location.school.indexOf($scope.selectedLocation.school) > -1,
                    containsPickupLocation = el.location.pickupLocation.indexOf($scope.selectedLocation.pickupLocation) > -1;

                return containsSchool && containsPickupLocation;
            });
        };

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

        $scope.hasPaid = function (order) {
            $http.put('api/authenticate', {
                'authentication': {
                    id: order.id,
                    paid: order.paid ? 1 : 0,
                    verified: 1,
                    payment_type: order.payment_type,
                    phone: order.phone
                }
            });
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
                        $scope.originalOrderList = $scope.orderService.orderListTransformer(res);

                        $scope.updateCurrentOrderList($scope.originalOrderList);

                        return true;
                    });
            };

            me.initPoll = function () {
                $timeout(function () {
                    me.getOrders().success(function () {
                        toastr.info('Updated Order List');
                        me.initPoll();
                    });
                }, 15000);
            };

            me.getOrders();
            me.initPoll();

            $scope.$watch('selectedLocation', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if (newVal == $scope.defaultLocation || newVal == undefined) {
                        $scope.currentOrderList = $scope.originalOrderList;
                        return;
                    }

                    $scope.updateCurrentOrderList($scope.originalOrderList);
                }
            });
        };

        me.init();
    }


})();
