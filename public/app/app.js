(function () {
    "use strict";

    var ns = 'app.main';
    var food = [
        {
            name: "Apple",
            price: 1.2,
            selected: false
        },
        {
            name: "Banana",
            price: 3.2,
            selected: false
        },
        {
            name: "Tofu",
            price: 4.5,
            selected: false
        },
        {
            name: "Cake",
            price: 5,
            selected: false
        }
    ];

    angular
        .module(ns, [])
        .controller('mainController', mainController);

    function mainController($scope, $http)
    {
        $scope.food = food; // replace later
        $scope.order = [];
        $scope.auth = {
		id: -1,
		code: ''
	};

        // Watch food collection and update order.
        $scope.$watch('food', function(newVal, oldVal) {
            if (newVal != oldVal) {
                // Update Order
                $scope.order = $scope.food.filter(function(el) {
                   return el.selected;
                });
            }
        }, true);

        // Calculate total price of order
        $scope.orderTotal = function(order) {
            return order.reduce(function(prevVal, curVal) {
                return prevVal + curVal.price;
            }, 0);
        };

        $scope.makeOrder = function() {
            $http
                .post('api/authenticate', {
                    phoneNumber: $scope.phoneNumber
                })
                .success(function(res) {
                    $scope.auth.id = res.id;
                });
        };

        $scope.checkSMSCode = function(authObj) {
	        authObj.order = $scope.order;
            $http
                .post('api/authenticate/check', authObj)
                .success(function(res) {
                    console.log(res);
                });
        }

    }

})();
