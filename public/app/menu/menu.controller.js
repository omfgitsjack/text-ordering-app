(function () {
    "use strict";

    // CONSTANTS
    var ORDER_TIMEOUT = 60 * 5;

    var ns = 'app.menu';

    angular
        .module(ns)
        .controller('menuController', menuController);

    function menuController($scope, $timeout, DateTimeService, OrderService,
                            shopStatusResolve, foodResolve, locationResolve, $mdDialog) {

        // Set Shop Status & food items for sale
        $scope.shopStatus = shopStatusResolve.data;
        $scope.food = foodResolve.data;
        $scope.locations = locationResolve.data;

        // Location prompter
        $scope.promptLocation = promptLocation;

        // Configuration for food items
        $scope.increment = increment;
        $scope.decrement = decrement;

        // Configuration for List of Schools
        $scope.defaultPickupTime = "12:45-13:15";
        $scope.selectedLocation = undefined;
        $scope.selectLocation = selectLocation;
        $scope.resetSelectedLocation = resetSelectedLocation;

        // Configuration for List of items being ordered
        $scope.order = [];
        $scope.$watch('food', currentFoodOrderWatcher, true);
        $scope.orderTotal = calculateOrderTotal;

        // Configuration for Order Button View & logic
        $scope.isCountingDown = isCountingDown;
        $scope.countDownVal = 0;
        $scope.disableOrderBtn = false;
        $scope.inputPlaceHolder = orderBtnPlaceHolder;
        $scope.makeOrder = makeOrder;

        displayDeliveryTimeWarningToast();

        // Display a warning if people order after deadline.
        function displayDeliveryTimeWarningToast() {
            var now = DateTimeService.now();
            var deadline = DateTimeService.now()
                .startOf('day')
                .add(10, 'hours')
                .add(30, 'minutes');

            $scope.tomorrowDay = DateTimeService.now().add(1, 'days').startOf('day').format('dddd, MMMM Do');

            if (now.isAfter(deadline, 'minute')) {
                toastr.warning('All orders made from this point on will be for ' + $scope.tomorrowDay);
            }
        }

        function promptLocation() {
            $mdDialog.show({
                controller: 'locationLoginController',
                templateUrl: 'app/location-login/location-login.tmpl.html',
                parent: angular.element(document.body)
            }).then(function(res) {
                if (res.success) {
                    $scope.selectedLocation = res.location;
                }
            });
        }

        // Increment items being ordered by 1.
        function increment(item) {
            item.quantity++;
        }

        // Decrement item being ordered by 1.
        function decrement(item) {
            item.quantity--;
        }

        // Set selected Location
        function selectLocation(location) {
            $scope.selectedLocation = location;
        }

        // Reset selected Location
        function resetSelectedLocation() {
            $scope.selectedLocation = undefined;
        }

        // Watches and updates current listing of food being ordered.
        function currentFoodOrderWatcher(newVal, oldVal) {
            if (newVal !== oldVal) {
                // Update Order
                $scope.order = $scope.food.filter(function (el) {
                    return el.order.quantity > 0;
                });
            }
        }

        // Calculates total cost of an order
        function calculateOrderTotal(order) {
            return order.reduce(function (prevVal, curVal) {
                return prevVal + (curVal.order.quantity * curVal.taxedprice);
            }, 0);
        };

        // Returns a bool value of whether timer is on
        function isCountingDown() {
            return $scope.countDownVal > 0;
        }

        // Dynamic Order Btn Place Holder
        function orderBtnPlaceHolder() {
            if ($scope.isCountingDown()) {
                return "请等" + $scope.countDownVal + "秒";
            } else {
                return "下单";
            }
        }

        // Make Order and timeout the order button.
        function makeOrder(phoneNumber, order, selectedLocation) {
            OrderService
                .makeOrder(phoneNumber, order, selectedLocation)
                .success(function (res) {
                    toastr.success('谢谢！你的订单已经收到。请查看短信完成订单');
                    var countDown = function (val) {
                        $scope.countDownVal = val;
                        $timeout(function () {
                            if (val > 0) {
                                countDown(--val);
                            }
                        }, 1000);
                    };
                    countDown(ORDER_TIMEOUT);
                });
        };
    }

})();
