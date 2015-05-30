(function () {
    "use strict";

    var ns = 'app.main';

    angular
        .module(ns, [
            'ui.bootstrap',
            'ngMaterial',
            'app.models'
        ])
        .config(materialConfig)
        .controller('mainController', mainController)
        .controller('foodController', foodController);

    function materialConfig($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey', {
                'default': '900'
            })
            .accentPalette('grey', {
                'default': '800'
            })
            .warnPalette('deep-orange');
    }

    function mainController($scope, $http, FoodService)
    {
        $scope.order = [];
        $scope.auth = {
            id: -1,
            code: ''
        };

        // Init our $scope.food
        FoodService.get()
            .success(function(res) {
                $scope.food = res.map(function(el) {
                    el.order = {
                        quantity: 0,
                        cost: function() {
                            return this.quantity * el.price
                        }
                    };
                    return el;
                });
            });

        $scope.increment = function(item) { item.order.quantity++ };
        $scope.decrement = function(item) { item.order.quantity-- };

        // Watch food collection and update order.
        $scope.$watch('food', function(newVal, oldVal) {
            if (newVal != oldVal) {
                // Update Order
                $scope.order = $scope.food.filter(function(el) {
                    return el.order.quantity > 0;
                });
            }
        }, true);

        // Calculate total price of order
        $scope.orderTotal = function(order) {
            return order.reduce(function(prevVal, curVal) {
                return prevVal + (curVal.order.quantity * curVal.price);
            }, 0);
        };

        $scope.makeOrder = function() {
            $http
                .post('api/authenticate', {
                    phoneNumber: $scope.phoneNumber,
                    order: $scope.order
                })
                .success(function(res) {

                });
        };
    }

    function foodController($scope) {
        $scope.isCollapsed = true;
    }
})();
