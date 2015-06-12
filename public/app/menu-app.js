(function () {
    "use strict";

    var ns = 'app.menu';

    angular
        .module(ns, [
            'app.models'
        ])
        .controller('menuController', menuController)
        .controller('foodController', foodController);

    function menuController($scope, $http, $timeout, FoodService) {
        $scope.order = [];
        $scope.auth = {
            id: -1,
            code: ''
        };

        // Init our $scope.food
        FoodService.get()
            .success(function (res) {
                $scope.food = res.map(function (el) {
                    el.order = {
                        quantity: 0,
                        cost: function () {
                            return this.quantity * el.taxedprice
                        }
                    };
                    return el;
                });
            });

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



        $scope.disableOrderBtn = false;
        $scope.makeOrder = function () {
            $http
                .post('api/authenticate', {
                    phoneNumber: $scope.phoneNumber,
                    order: $scope.order
                })
                .success(function (res) {
                    toastr.success('谢谢您的订单已收到, 请查看您手机');
                    $scope.disableOrderBtn = true;
                    $timeout(function () {
                        $scope.disableOrderBtn = false;
                    }, 60000);
                });
        };
    }

    function foodController($scope) {
        $scope.isCollapsed = true;
    }

})();
