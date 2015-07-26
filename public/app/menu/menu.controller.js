(function () {
    "use strict";

    // CONSTANTS
    var ORDER_TIMEOUT = 60 * 5;

    var ns = 'app.menu';

    angular
        .module(ns)
        .controller('menuController', menuController);

    function menuController($scope, $http, $timeout, $filter, DateTimeService, shopStatusResolve, foodResolve) {
        $scope.order = [];

        var now = DateTimeService.now();
        var deadline = DateTimeService.now()
            .startOf('day')
            .add(10, 'hours')
            .add(30, 'minutes');

        $scope.tomorrowDay = DateTimeService.now().add(1, 'days').startOf('day').format('dddd, MMMM Do');

        if (now.isBefore(deadline, 'minute')) {

        } else {
            toastr.warning('All orders made from this point on will be for ' + $scope.tomorrowDay);
        }

        $scope.shopStatus = shopStatusResolve.data;
        $scope.food = foodResolve.data;

        $scope.increment = function (item) {
            item.order.quantity++
        };
        $scope.decrement = function (item) {
            item.order.quantity--
        };

        // Watch food collection and update order.
        $scope.$watch('food', function (newVal, oldVal) {
            if (newVal != oldVal) {
                // Update Order
                $scope.order = $scope.food.filter(function (el) {
                    return el.order.quantity > 0;
                });
            }
        }, true);

        // Calculate total price of order
        $scope.orderTotal = function (order) {
            return order.reduce(function (prevVal, curVal) {
                return prevVal + (curVal.order.quantity * curVal.taxedprice);
            }, 0);
        };

        $scope.isCountingDown = function() {
            return $scope.countDownVal > 0;
        }

        $scope.countDownVal = 0;
        $scope.disableOrderBtn = false;

        $scope.inputPlaceHolder = function() {
            if ($scope.isCountingDown()) {
                return "请等" + $scope.countDownVal + "秒"
            } else {
                return "下单"
            }
        }

        $scope.makeOrder = function () {
            $http
                .post('api/authenticate', {
                    phoneNumber: $scope.phoneNumber,
                    order: $scope.order
                })
                .success(function (res) {
                    toastr.success('谢谢！你的订单已经收到。请查看短信完成订单');
                    var countDown = function(val) {
                        $scope.countDownVal = val;
                        $timeout(function() {
                            if (val > 0) {
                                countDown(--val);
                            }
                        }, 1000);
                    }
                    countDown(ORDER_TIMEOUT);
                });
        };
    }

})();
