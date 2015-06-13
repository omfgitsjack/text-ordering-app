(function () {
    "use strict";

    var ns = 'app';
    var TEMPLATEPATH = 'app/templates/';

    angular
        .module(ns, [
            // Third party dependencies
            'ui.bootstrap',
            'ngMaterial',
            'ui.router',

            // App dependencies
            'app.menu',
            'app.admin',

            // Core
            'utilities.datetime',
		'ngSanitize'
        ])
        .config(materialConfig)
        .config(uiRouterConfig)
        .config(toastrConfig);

    function materialConfig($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey', {
                'default': '900'
            })
            .accentPalette('grey', {
                'default': '800'
            })
            .warnPalette('deep-orange');
        $mdThemingProvider.theme('redThemeBtn')
            .primaryPalette('deep-orange');
        $mdThemingProvider.theme('greenThemeBtn')
            .primaryPalette('green');
    }
    materialConfig.$inject = ["$mdThemingProvider"];

    function uiRouterConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/menu');

        $stateProvider
            .state('/', {
                url: "/",
                templateUrl: TEMPLATEPATH + 'promo.html'
            })
            .state('menu', {
                url: "/menu",
                templateUrl: TEMPLATEPATH + 'menu.html',
                controller: 'menuController'
            })
            .state("admin", {
                url: "/admin",
                templateUrl: TEMPLATEPATH + "admin.html",
                controller: 'adminController'
            });
    }
    uiRouterConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

    function toastrConfig() {
        toastr.options.timeOut = 10000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

})();

(function () {
    "use strict";

    angular.module('app.admin', []);

})();
(function () {
    "use strict";

    var ns = 'app.menu';

    angular
        .module(ns, [
            'app.models'
        ]);

})();

(function () {
    "use strict";

    angular.module('app.models', []);

})();
(function () {
    "use strict";

    /**
     * Provides a DateTimeService utility class that provides an interface to
     * moment objects, utilities for working with MySQL UTC times etc.
     *
     * Refer to datetime.factory.js for documentation & available tools
     */
    angular.module('utilities.datetime',
        [
            'angularMoment'
        ]);

})();
(function () {
    "use strict";

    /**
     * Wrap moment as an angular dependency
     * whilst setting the default timezone for angular
     * moment
     */
    angular.module("utilities.datetime")
        .constant('moment', moment)
        .constant('angularMomentConfig', {
            timezone: 'America/Detroit'
        })
        .constant('UTC_TIMEFORMAT', "YYYY-MM-DD HH:MM:SS");

})();
(function () {
    "use strict";

    angular
        .module('utilities.datetime')
        .config(datetimeConfig);

    /**
     * Configure date time configuration, America/Detroit has same timezone as toronto
     * @param moment
     * @ngInject
     */
    function datetimeConfig(moment)
    {
        // Make sure moment is in english and the first day of week is a monday
        moment.lang('en', {
            // customizations.
            week: {
                dow: 1
            },
            calendar: {
                lastDay: '[Yesterday], dddd MMM D',
                sameDay : '[Today], dddd MMM D',
                nextDay : '[Tomorrow], dddd MMM D',
                lastWeek : 'dddd, MMM D',
                nextWeek : 'dddd, MMM D',
                sameElse : 'dddd, MMM D'
            }
        });

        // Add America/Detroit timezone, note that this is the same as Toronto
        moment.tz.add(
            [
                'America/Detroit|EST EDT|50 40|01010101010101010101010|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0',
                "Etc/UTC|UTC|0|0|"
            ]);
    }
    datetimeConfig.$inject = ["moment"];

})();
(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('adminController', adminController);

    function adminController($scope, $timeout, OrderService, DateTimeService) {
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
    adminController.$inject = ["$scope", "$timeout", "OrderService", "DateTimeService"];


})();
(function () {
    "use strict";

    var ns = 'app.menu';

    angular
        .module(ns, [
            'app.models'
        ])
        .controller('foodController', foodController);

    function foodController($scope) {
        $scope.isCollapsed = true;
    }
    foodController.$inject = ["$scope"];

})();

(function () {
    "use strict";

    var ns = 'app.menu';

    angular
        .module(ns)
        .controller('menuController', menuController);

    function menuController($scope, $http, $timeout, $filter, FoodService, DateTimeService) {
        $scope.order = [];
        $scope.auth = {
            id: -1,
            code: ''
        };  

        var now = DateTimeService.now();
        $scope.tomorrowDay = DateTimeService.now().add(1, 'days').startOf('day').format('dddd, MMMM Do');

        if (0 <= now.get('hour') && now.get('hour') < 10) {
            toastr.info('You can still order before 10AM today and it will be delivered!');
            toastr.warning('All orders made from this point on will be for ' + $scope.tomorrowDay);
        } else {
        }

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
                    countDown(60); 
                });
        };
    }
    menuController.$inject = ["$scope", "$http", "$timeout", "$filter", "FoodService", "DateTimeService"];

})();

(function () {
    "use strict";

    angular
        .module('utilities.datetime')
        .factory('DateTimeService', DateTimeFactory);

    /**
     * Date Time utility belt that utilizes moment & supplies key
     * utilities for working with MySQL DateTime & time zone issues
     * @returns {{now: now, toUTC: toUTC, parseUTC: parseUTC}}
     * @constructor
     * @ngInject
     */
    function DateTimeFactory(UTC_TIMEFORMAT) {

        var service = {
            now: now,
            toUTC: toUTC,
            parseUTC: parseUTC,
            getDaysInThisWeek: getDaysInThisWeek
        };

        return service;

        /**
         * Provide an interface to retrieve a moment/date
         * @returns moment
         */
        function now() {
            return moment.tz(new Date(), 'America/Detroit');
        }

        /**
         * Transforms moment into MySQL acceptable UTC DateTime object
         * @param momentObj
         * @returns {*}
         */
        function toUTC(momentObj) {
            if (!moment.isMoment(momentObj)) {
                exceptionService.catcher('Non-moment object detected');
            }

            return momentObj.tz("Etc/UTC").format(UTC_TIMEFORMAT);
        }

        /**
         * Transforms MySQL UTC time Strings into moments
         * @param utcString
         * @returns {*}
         */
        function parseUTC(utcString) {
            return moment.tz(utcString, 'America/Detroit');
        }

        /**
         * Retrieves an array of moments for this week,
         * each moment represents the start of the day.
         * @returns:
         * [
         *      moment, // Moment for Monday
         *      moment //  Moment for Tuesday
         *      ... // So on til Sunday
         * ]
         */
        function getDaysInThisWeek() {
            return getDaysInWeek(now());
        }

        /**
         * Retrieves an array of moments for a week, the week is based
         * on the inputted moment
         * @param dayInWeek
         * @returns
         * [
         *      moment, // Moment for Monday
         *      moment //  Moment for Tuesday
         *      ... // So on til Sunday
         * ]
         */
        function getDaysInWeek(dayInWeek) {
            var firstDayOfWeek = dayInWeek.startOf('week');
            var daysInWeek = [];

            for (var i = 0; i < 7; i++) {
                daysInWeek.push(angular.copy(firstDayOfWeek).add(i, 'days'));
            }

            return daysInWeek;
        }
    }
    DateTimeFactory.$inject = ["UTC_TIMEFORMAT"];
})();
(function () {
    "use strict";

    angular.module('app.models')
        .service('FoodService', ["$http", function($http) {
            return {
                items: [],
                get: function() {
                    var me = this;

                    return $http.get('api/food')
                        .success(function(res) {
                            me.items = res;
                            return me.items;
                        });
                }
            }
        }]);
})();
(function () {
    "use strict";

    angular.module('app.models')
        .service('OrderService', ["$http", function($http) {
            return {
                getCurrent: function() {
                    return $http.get('http://ucafe.jackyiu.me/api/orders/current');
                },
                aggregateTransformer: function(items) {
                    var aggregate = [];
                    var me = this;

                    for (var i = 0; i < items.length; i++) {
                        var index = me.isInList(items[i].name, 'name', aggregate);
                        if (index !== false ) {
                            aggregate[index].quantity += items[i].quantity;
                        } else {
                            aggregate.push({
                                'name': items[i].name,
                                'quantity': items[i].quantity
                            });
                        }
                    }
                    return aggregate;
                },
                orderListTransformer: function(items) {
                    var me = this;
                    var list = [];

                    for (var i = 0; i < items.length; i++) {
                        var index = me.isInList(items[i].id, 'id', list);
                        if (index !== false) {
                            list[index].items.push({
                                name: items[i].name,
                                quantity: items[i].quantity
                            });
                        } else {
                            list.push({
                                id: items[i].id,
                                phone: items[i].phone,
                                items: [{
                                    name: items[i].name,
                                    quantity: items[i].quantity
                                }]
                            });
                        }
                    }

                    return list;
                },
                isInList: function(propertyValue, identifyingProperty, list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i]) {
                            if (list[i][identifyingProperty] === propertyValue)
                                return i;
                        }
                    }
                    return false;
                }
            }
        }]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhZG1pbi9hZG1pbi5tb2R1bGUuanMiLCJtZW51L21lbnUubW9kdWxlLmpzIiwibW9kZWxzL21vZGVscy5tb2R1bGUuanMiLCJ1dGlsaXRpZXMvZGF0ZXRpbWUvZGF0ZXRpbWUubW9kdWxlLmpzIiwidXRpbGl0aWVzL2RhdGV0aW1lL2RhdGV0aW1lLmNvbnN0YW50LmpzIiwidXRpbGl0aWVzL2RhdGV0aW1lL2RhdGV0aW1lLmNvbmZpZy5qcyIsImFkbWluL2FkbWluLmNvbnRyb2xsZXIuanMiLCJtZW51L2Zvb2QuY29udHJvbGxlci5qcyIsIm1lbnUvbWVudS5jb250cm9sbGVyLmpzIiwidXRpbGl0aWVzL2RhdGV0aW1lL2RhdGV0aW1lLmZhY3RvcnkuanMiLCJtb2RlbHMvZm9vZC1tb2RlbC5zZXJ2aWNlLmpzIiwibW9kZWxzL29yZGVyLW1vZGVsLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxlQUFBOztJQUVBO1NBQ0EsT0FBQSxJQUFBOztZQUVBO1lBQ0E7WUFDQTs7O1lBR0E7WUFDQTs7O1lBR0E7RUFDQTs7U0FFQSxPQUFBO1NBQ0EsT0FBQTtTQUNBLE9BQUE7O0lBRUEsU0FBQSxlQUFBLG9CQUFBO1FBQ0EsbUJBQUEsTUFBQTthQUNBLGVBQUEsUUFBQTtnQkFDQSxXQUFBOzthQUVBLGNBQUEsUUFBQTtnQkFDQSxXQUFBOzthQUVBLFlBQUE7UUFDQSxtQkFBQSxNQUFBO2FBQ0EsZUFBQTtRQUNBLG1CQUFBLE1BQUE7YUFDQSxlQUFBOzs7O0lBR0EsU0FBQSxlQUFBLGdCQUFBLG9CQUFBO1FBQ0EsbUJBQUEsVUFBQTs7UUFFQTthQUNBLE1BQUEsS0FBQTtnQkFDQSxLQUFBO2dCQUNBLGFBQUEsZUFBQTs7YUFFQSxNQUFBLFFBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxhQUFBLGVBQUE7Z0JBQ0EsWUFBQTs7YUFFQSxNQUFBLFNB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O29CQUVBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLFFBQUEsS0FBQTt3QkFDQSxJQUFBLFFBQUEsR0FBQSxTQUFBLE1BQUEsR0FBQSxNQUFBLFFBQUE7d0JBQ0EsSUFBQSxVQUFBLFFBQUE7NEJBQ0EsVUFBQSxPQUFBLFlBQUEsTUFBQSxHQUFBOytCQUNBOzRCQUNBLFVBQUEsS0FBQTtnQ0FDQSxRQUFBLE1BQUEsR0FBQTtnQ0FDQSxZQUFBLE1BQUEsR0FBQTs7OztvQkFJQSxPQUFBOztnQkFFQSxzQkFBQSxTQUFBLE9BQUE7b0JBQ0EsSUFBQSxLQUFBO29CQUNBLElBQUEsT0FBQTs7b0JBRUEsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsUUFBQSxLQUFBO3dCQUNBLElBQUEsUUFBQSxHQUFBLFNBQUEsTUFBQSxHQUFBLElBQUEsTUFBQTt3QkFDQSxJQUFBLFVBQUEsT0FBQTs0QkFDQSxLQUFBLE9BQUEsTUFBQSxLQUFBO2dDQUNBLE1BQUEsTUFBQSxHQUFBO2dDQUNBLFVBQUEsTUFBQSxHQUFBOzsrQkFFQTs0QkFDQSxLQUFBLEtBQUE7Z0NBQ0EsSUFBQSxNQUFBLEdBQUE7Z0NBQ0EsT0FBQSxNQUFBLEdBQUE7Z0NBQ0EsT0FBQSxDQUFBO29DQUNBLE1BQUEsTUFBQSxHQUFBO29DQUNBLFVBQUEsTUFBQSxHQUFBOzs7Ozs7b0JBTUEsT0FBQTs7Z0JBRUEsVUFBQSxTQUFBLGVBQUEscUJBQUEsTUFBQTtvQkFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLEtBQUE7d0JBQ0EsSUFBQSxLQUFBLElBQUE7NEJBQ0EsSUFBQSxLQUFBLEdBQUEseUJBQUE7Z0NBQ0EsT0FBQTs7O29CQUdBLE9BQUE7Ozs7S0FJQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIG5zID0gJ2FwcCc7XHJcbiAgICB2YXIgVEVNUExBVEVQQVRIID0gJ2FwcC90ZW1wbGF0ZXMvJztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZShucywgW1xyXG4gICAgICAgICAgICAvLyBUaGlyZCBwYXJ0eSBkZXBlbmRlbmNpZXNcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAgICAgICAgICduZ01hdGVyaWFsJyxcclxuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXHJcblxyXG4gICAgICAgICAgICAvLyBBcHAgZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgICAgICdhcHAubWVudScsXHJcbiAgICAgICAgICAgICdhcHAuYWRtaW4nLFxyXG5cclxuICAgICAgICAgICAgLy8gQ29yZVxyXG4gICAgICAgICAgICAndXRpbGl0aWVzLmRhdGV0aW1lJyxcclxuXHRcdCduZ1Nhbml0aXplJ1xyXG4gICAgICAgIF0pXHJcbiAgICAgICAgLmNvbmZpZyhtYXRlcmlhbENvbmZpZylcclxuICAgICAgICAuY29uZmlnKHVpUm91dGVyQ29uZmlnKVxyXG4gICAgICAgIC5jb25maWcodG9hc3RyQ29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtYXRlcmlhbENvbmZpZygkbWRUaGVtaW5nUHJvdmlkZXIpIHtcclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ2dyZXknLCB7XHJcbiAgICAgICAgICAgICAgICAnZGVmYXVsdCc6ICc5MDAnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hY2NlbnRQYWxldHRlKCdncmV5Jywge1xyXG4gICAgICAgICAgICAgICAgJ2RlZmF1bHQnOiAnODAwJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2FyblBhbGV0dGUoJ2RlZXAtb3JhbmdlJyk7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdyZWRUaGVtZUJ0bicpXHJcbiAgICAgICAgICAgIC5wcmltYXJ5UGFsZXR0ZSgnZGVlcC1vcmFuZ2UnKTtcclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2dyZWVuVGhlbWVCdG4nKVxyXG4gICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ2dyZWVuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdWlSb3V0ZXJDb25maWcoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9tZW51Jyk7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnLycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogVEVNUExBVEVQQVRIICsgJ3Byb21vLmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbWVudVwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFRFTVBMQVRFUEFUSCArICdtZW51Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lbnVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhZG1pblwiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FkbWluXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogVEVNUExBVEVQQVRIICsgXCJhZG1pbi5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5Db250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2FzdHJDb25maWcoKSB7XHJcbiAgICAgICAgdG9hc3RyLm9wdGlvbnMudGltZU91dCA9IDEwMDAwO1xyXG4gICAgICAgIHRvYXN0ci5vcHRpb25zLnBvc2l0aW9uQ2xhc3MgPSAndG9hc3QtYm90dG9tLXJpZ2h0JztcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmFkbWluJywgW10pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIG5zID0gJ2FwcC5tZW51JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZShucywgW1xyXG4gICAgICAgICAgICAnYXBwLm1vZGVscydcclxuICAgICAgICBdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLm1vZGVscycsIFtdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvdmlkZXMgYSBEYXRlVGltZVNlcnZpY2UgdXRpbGl0eSBjbGFzcyB0aGF0IHByb3ZpZGVzIGFuIGludGVyZmFjZSB0b1xyXG4gICAgICogbW9tZW50IG9iamVjdHMsIHV0aWxpdGllcyBmb3Igd29ya2luZyB3aXRoIE15U1FMIFVUQyB0aW1lcyBldGMuXHJcbiAgICAgKlxyXG4gICAgICogUmVmZXIgdG8gZGF0ZXRpbWUuZmFjdG9yeS5qcyBmb3IgZG9jdW1lbnRhdGlvbiAmIGF2YWlsYWJsZSB0b29sc1xyXG4gICAgICovXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgndXRpbGl0aWVzLmRhdGV0aW1lJyxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICdhbmd1bGFyTW9tZW50J1xyXG4gICAgICAgIF0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXcmFwIG1vbWVudCBhcyBhbiBhbmd1bGFyIGRlcGVuZGVuY3lcclxuICAgICAqIHdoaWxzdCBzZXR0aW5nIHRoZSBkZWZhdWx0IHRpbWV6b25lIGZvciBhbmd1bGFyXHJcbiAgICAgKiBtb21lbnRcclxuICAgICAqL1xyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ1dGlsaXRpZXMuZGF0ZXRpbWVcIilcclxuICAgICAgICAuY29uc3RhbnQoJ21vbWVudCcsIG1vbWVudClcclxuICAgICAgICAuY29uc3RhbnQoJ2FuZ3VsYXJNb21lbnRDb25maWcnLCB7XHJcbiAgICAgICAgICAgIHRpbWV6b25lOiAnQW1lcmljYS9EZXRyb2l0J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNvbnN0YW50KCdVVENfVElNRUZPUk1BVCcsIFwiWVlZWS1NTS1ERCBISDpNTTpTU1wiKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1dGlsaXRpZXMuZGF0ZXRpbWUnKVxyXG4gICAgICAgIC5jb25maWcoZGF0ZXRpbWVDb25maWcpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlndXJlIGRhdGUgdGltZSBjb25maWd1cmF0aW9uLCBBbWVyaWNhL0RldHJvaXQgaGFzIHNhbWUgdGltZXpvbmUgYXMgdG9yb250b1xyXG4gICAgICogQHBhcmFtIG1vbWVudFxyXG4gICAgICogQG5nSW5qZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRhdGV0aW1lQ29uZmlnKG1vbWVudClcclxuICAgIHtcclxuICAgICAgICAvLyBNYWtlIHN1cmUgbW9tZW50IGlzIGluIGVuZ2xpc2ggYW5kIHRoZSBmaXJzdCBkYXkgb2Ygd2VlayBpcyBhIG1vbmRheVxyXG4gICAgICAgIG1vbWVudC5sYW5nKCdlbicsIHtcclxuICAgICAgICAgICAgLy8gY3VzdG9taXphdGlvbnMuXHJcbiAgICAgICAgICAgIHdlZWs6IHtcclxuICAgICAgICAgICAgICAgIGRvdzogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYWxlbmRhcjoge1xyXG4gICAgICAgICAgICAgICAgbGFzdERheTogJ1tZZXN0ZXJkYXldLCBkZGRkIE1NTSBEJyxcclxuICAgICAgICAgICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5XSwgZGRkZCBNTU0gRCcsXHJcbiAgICAgICAgICAgICAgICBuZXh0RGF5IDogJ1tUb21vcnJvd10sIGRkZGQgTU1NIEQnLFxyXG4gICAgICAgICAgICAgICAgbGFzdFdlZWsgOiAnZGRkZCwgTU1NIEQnLFxyXG4gICAgICAgICAgICAgICAgbmV4dFdlZWsgOiAnZGRkZCwgTU1NIEQnLFxyXG4gICAgICAgICAgICAgICAgc2FtZUVsc2UgOiAnZGRkZCwgTU1NIEQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIEFtZXJpY2EvRGV0cm9pdCB0aW1lem9uZSwgbm90ZSB0aGF0IHRoaXMgaXMgdGhlIHNhbWUgYXMgVG9yb250b1xyXG4gICAgICAgIG1vbWVudC50ei5hZGQoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICdBbWVyaWNhL0RldHJvaXR8RVNUIEVEVHw1MCA0MHwwMTAxMDEwMTAxMDEwMTAxMDEwMTAxMHwxQlFUMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIFJkMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwJyxcclxuICAgICAgICAgICAgICAgIFwiRXRjL1VUQ3xVVEN8MHwwfFwiXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hZG1pbicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2FkbWluQ29udHJvbGxlcicsIGFkbWluQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gYWRtaW5Db250cm9sbGVyKCRzY29wZSwgJHRpbWVvdXQsIE9yZGVyU2VydmljZSwgRGF0ZVRpbWVTZXJ2aWNlKSB7XHJcbiAgICAgICAgJHNjb3BlLm9yZGVyU2VydmljZSA9IE9yZGVyU2VydmljZTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIHZhciBub3cgPSBEYXRlVGltZVNlcnZpY2Uubm93KCk7XHJcblxyXG4gICAgICAgICRzY29wZS50b2RheURheSA9IERhdGVUaW1lU2VydmljZS5ub3coKS5zdGFydE9mKCdkYXknKTtcclxuICAgICAgICAkc2NvcGUudG9tb3Jyb3dEYXkgPSBEYXRlVGltZVNlcnZpY2Uubm93KCkuYWRkKDEsICdkYXlzJykuc3RhcnRPZignZGF5Jyk7XHJcblxyXG4gICAgICAgIC8vIElmIGl0J3MgdG9kYXkgYmVmb3JlIDRwbSwgc2hvdyB5ZXN0ZXJkYXkncyBvcmRlci5cclxuICAgICAgICAkc2NvcGUudG9tb3Jyb3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50RGF5ID0gJHNjb3BlLnRvbW9ycm93RGF5O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS50b2RheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnREYXkgPSAkc2NvcGUudG9kYXlEYXk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbWUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIG1lLmdldE9yZGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGl0J3MgZHVyaW5nIGRlbGl2ZXJ5IHRpbWUsIHNob3cgdGhlIG9yZGVyIHRvIGJlIGRlbGl2ZXJlZCB0b2RheS5cclxuICAgICAgICAgICAgICAgIGlmICgwIDw9IG5vdy5nZXQoJ2hvdXInKSAmJiBub3cuZ2V0KCdob3VyJykgPCAxNikge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50b2RheSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpdCdzIGFmdGVyIGRlbGl2ZXJ5IHRpbWUgZm9yIHRvZGF5LCBzaG93IHRoZSBvcmRlciB0byBiZSBkZWxpdmVyZWQgdG9tb3Jyb3dcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudG9tb3Jyb3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBPcmRlclNlcnZpY2UuZ2V0Q3VycmVudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudEFnZ3JlZ2F0ZU9yZGVyID0gJHNjb3BlLm9yZGVyU2VydmljZS5hZ2dyZWdhdGVUcmFuc2Zvcm1lcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudE9yZGVyTGlzdCA9ICRzY29wZS5vcmRlclNlcnZpY2Uub3JkZXJMaXN0VHJhbnNmb3JtZXIocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBtZS5pbml0UG9sbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZS5nZXRPcmRlcnMoKS5zdWNjZXNzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbygnVXBkYXRlZCBPcmRlciBMaXN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmluaXRQb2xsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAxNTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBtZS5nZXRPcmRlcnMoKTtcclxuICAgICAgICAgICAgbWUuaW5pdFBvbGwoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtZS5pbml0KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIG5zID0gJ2FwcC5tZW51JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZShucywgW1xyXG4gICAgICAgICAgICAnYXBwLm1vZGVscydcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdmb29kQ29udHJvbGxlcicsIGZvb2RDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBmb29kQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBucyA9ICdhcHAubWVudSc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUobnMpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ21lbnVDb250cm9sbGVyJywgbWVudUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1lbnVDb250cm9sbGVyKCRzY29wZSwgJGh0dHAsICR0aW1lb3V0LCAkZmlsdGVyLCBGb29kU2VydmljZSwgRGF0ZVRpbWVTZXJ2aWNlKSB7XHJcbiAgICAgICAgJHNjb3BlLm9yZGVyID0gW107XHJcbiAgICAgICAgJHNjb3BlLmF1dGggPSB7XHJcbiAgICAgICAgICAgIGlkOiAtMSxcclxuICAgICAgICAgICAgY29kZTogJydcclxuICAgICAgICB9OyAgXHJcblxyXG4gICAgICAgIHZhciBub3cgPSBEYXRlVGltZVNlcnZpY2Uubm93KCk7XHJcbiAgICAgICAgJHNjb3BlLnRvbW9ycm93RGF5ID0gRGF0ZVRpbWVTZXJ2aWNlLm5vdygpLmFkZCgxLCAnZGF5cycpLnN0YXJ0T2YoJ2RheScpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbycpO1xyXG5cclxuICAgICAgICBpZiAoMCA8PSBub3cuZ2V0KCdob3VyJykgJiYgbm93LmdldCgnaG91cicpIDwgMTApIHtcclxuICAgICAgICAgICAgdG9hc3RyLmluZm8oJ1lvdSBjYW4gc3RpbGwgb3JkZXIgYmVmb3JlIDEwQU0gdG9kYXkgYW5kIGl0IHdpbGwgYmUgZGVsaXZlcmVkIScpO1xyXG4gICAgICAgICAgICB0b2FzdHIud2FybmluZygnQWxsIG9yZGVycyBtYWRlIGZyb20gdGhpcyBwb2ludCBvbiB3aWxsIGJlIGZvciAnICsgJHNjb3BlLnRvbW9ycm93RGF5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW5pdCBvdXIgJHNjb3BlLmZvb2RcclxuICAgICAgICBGb29kU2VydmljZS5nZXQoKVxyXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9vZCA9IHJlcy5tYXAoZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwub3JkZXIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3N0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWFudGl0eSAqIGVsLnRheGVkcHJpY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuaW5jcmVtZW50ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaXRlbS5vcmRlci5xdWFudGl0eSsrXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuZGVjcmVtZW50ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaXRlbS5vcmRlci5xdWFudGl0eS0tXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gV2F0Y2ggZm9vZCBjb2xsZWN0aW9uIGFuZCB1cGRhdGUgb3JkZXIuXHJcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZm9vZCcsIGZ1bmN0aW9uIChuZXdWYWwsIG9sZFZhbCkge1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsICE9IG9sZFZhbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIE9yZGVyXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUub3JkZXIgPSAkc2NvcGUuZm9vZC5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLm9yZGVyLnF1YW50aXR5ID4gMDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0b3RhbCBwcmljZSBvZiBvcmRlclxyXG4gICAgICAgICRzY29wZS5vcmRlclRvdGFsID0gZnVuY3Rpb24gKG9yZGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvcmRlci5yZWR1Y2UoZnVuY3Rpb24gKHByZXZWYWwsIGN1clZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZWYWwgKyAoY3VyVmFsLm9yZGVyLnF1YW50aXR5ICogY3VyVmFsLnRheGVkcHJpY2UpO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNDb3VudGluZ0Rvd24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jb3VudERvd25WYWwgPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmNvdW50RG93blZhbCA9IDA7XHJcbiAgICAgICAgJHNjb3BlLmRpc2FibGVPcmRlckJ0biA9IGZhbHNlO1xyXG5cclxuICAgICAgICAkc2NvcGUuaW5wdXRQbGFjZUhvbGRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmlzQ291bnRpbmdEb3duKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIuivt+etiVwiICsgJHNjb3BlLmNvdW50RG93blZhbCArIFwi56eSXCJcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIuS4i+WNlVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5tYWtlT3JkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRodHRwXHJcbiAgICAgICAgICAgICAgICAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyOiAkc2NvcGUub3JkZXJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ+iwouiwou+8geS9oOeahOiuouWNleW3sue7j+aUtuWIsOOAguivt+afpeeci+efreS/oeWujOaIkOiuouWNlScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3VudERvd24gPSBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvdW50RG93blZhbCA9IHZhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50RG93bigtLXZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb3VudERvd24oNjApOyBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3V0aWxpdGllcy5kYXRldGltZScpXHJcbiAgICAgICAgLmZhY3RvcnkoJ0RhdGVUaW1lU2VydmljZScsIERhdGVUaW1lRmFjdG9yeSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEYXRlIFRpbWUgdXRpbGl0eSBiZWx0IHRoYXQgdXRpbGl6ZXMgbW9tZW50ICYgc3VwcGxpZXMga2V5XHJcbiAgICAgKiB1dGlsaXRpZXMgZm9yIHdvcmtpbmcgd2l0aCBNeVNRTCBEYXRlVGltZSAmIHRpbWUgem9uZSBpc3N1ZXNcclxuICAgICAqIEByZXR1cm5zIHt7bm93OiBub3csIHRvVVRDOiB0b1VUQywgcGFyc2VVVEM6IHBhcnNlVVRDfX1cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQG5nSW5qZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIERhdGVUaW1lRmFjdG9yeShVVENfVElNRUZPUk1BVCkge1xyXG5cclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgbm93OiBub3csXHJcbiAgICAgICAgICAgIHRvVVRDOiB0b1VUQyxcclxuICAgICAgICAgICAgcGFyc2VVVEM6IHBhcnNlVVRDLFxyXG4gICAgICAgICAgICBnZXREYXlzSW5UaGlzV2VlazogZ2V0RGF5c0luVGhpc1dlZWtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvdmlkZSBhbiBpbnRlcmZhY2UgdG8gcmV0cmlldmUgYSBtb21lbnQvZGF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIG1vbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIG5vdygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC50eihuZXcgRGF0ZSgpLCAnQW1lcmljYS9EZXRyb2l0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUcmFuc2Zvcm1zIG1vbWVudCBpbnRvIE15U1FMIGFjY2VwdGFibGUgVVRDIERhdGVUaW1lIG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSBtb21lbnRPYmpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiB0b1VUQyhtb21lbnRPYmopIHtcclxuICAgICAgICAgICAgaWYgKCFtb21lbnQuaXNNb21lbnQobW9tZW50T2JqKSkge1xyXG4gICAgICAgICAgICAgICAgZXhjZXB0aW9uU2VydmljZS5jYXRjaGVyKCdOb24tbW9tZW50IG9iamVjdCBkZXRlY3RlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbW9tZW50T2JqLnR6KFwiRXRjL1VUQ1wiKS5mb3JtYXQoVVRDX1RJTUVGT1JNQVQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVHJhbnNmb3JtcyBNeVNRTCBVVEMgdGltZSBTdHJpbmdzIGludG8gbW9tZW50c1xyXG4gICAgICAgICAqIEBwYXJhbSB1dGNTdHJpbmdcclxuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZVVUQyh1dGNTdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC50eih1dGNTdHJpbmcsICdBbWVyaWNhL0RldHJvaXQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBhcnJheSBvZiBtb21lbnRzIGZvciB0aGlzIHdlZWssXHJcbiAgICAgICAgICogZWFjaCBtb21lbnQgcmVwcmVzZW50cyB0aGUgc3RhcnQgb2YgdGhlIGRheS5cclxuICAgICAgICAgKiBAcmV0dXJuczpcclxuICAgICAgICAgKiBbXHJcbiAgICAgICAgICogICAgICBtb21lbnQsIC8vIE1vbWVudCBmb3IgTW9uZGF5XHJcbiAgICAgICAgICogICAgICBtb21lbnQgLy8gIE1vbWVudCBmb3IgVHVlc2RheVxyXG4gICAgICAgICAqICAgICAgLi4uIC8vIFNvIG9uIHRpbCBTdW5kYXlcclxuICAgICAgICAgKiBdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF5c0luVGhpc1dlZWsoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXREYXlzSW5XZWVrKG5vdygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBhcnJheSBvZiBtb21lbnRzIGZvciBhIHdlZWssIHRoZSB3ZWVrIGlzIGJhc2VkXHJcbiAgICAgICAgICogb24gdGhlIGlucHV0dGVkIG1vbWVudFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXlJbldlZWtcclxuICAgICAgICAgKiBAcmV0dXJuc1xyXG4gICAgICAgICAqIFtcclxuICAgICAgICAgKiAgICAgIG1vbWVudCwgLy8gTW9tZW50IGZvciBNb25kYXlcclxuICAgICAgICAgKiAgICAgIG1vbWVudCAvLyAgTW9tZW50IGZvciBUdWVzZGF5XHJcbiAgICAgICAgICogICAgICAuLi4gLy8gU28gb24gdGlsIFN1bmRheVxyXG4gICAgICAgICAqIF1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXlzSW5XZWVrKGRheUluV2Vlaykge1xyXG4gICAgICAgICAgICB2YXIgZmlyc3REYXlPZldlZWsgPSBkYXlJbldlZWsuc3RhcnRPZignd2VlaycpO1xyXG4gICAgICAgICAgICB2YXIgZGF5c0luV2VlayA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA3OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGRheXNJbldlZWsucHVzaChhbmd1bGFyLmNvcHkoZmlyc3REYXlPZldlZWspLmFkZChpLCAnZGF5cycpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRheXNJbldlZWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLm1vZGVscycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ0Zvb2RTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXSxcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL2Zvb2QnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLml0ZW1zID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lLml0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLm1vZGVscycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ09yZGVyU2VydmljZScsIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBnZXRDdXJyZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vdWNhZmUuamFja3lpdS5tZS9hcGkvb3JkZXJzL2N1cnJlbnQnKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGVUcmFuc2Zvcm1lcjogZnVuY3Rpb24oaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWdncmVnYXRlID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBtZS5pc0luTGlzdChpdGVtc1tpXS5uYW1lLCAnbmFtZScsIGFnZ3JlZ2F0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGVbaW5kZXhdLnF1YW50aXR5ICs9IGl0ZW1zW2ldLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogaXRlbXNbaV0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncXVhbnRpdHknOiBpdGVtc1tpXS5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFnZ3JlZ2F0ZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvcmRlckxpc3RUcmFuc2Zvcm1lcjogZnVuY3Rpb24oaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gbWUuaXNJbkxpc3QoaXRlbXNbaV0uaWQsICdpZCcsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0W2luZGV4XS5pdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpdGVtc1tpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBpdGVtc1tpXS5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtc1tpXS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG9uZTogaXRlbXNbaV0ucGhvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW1zW2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBpdGVtc1tpXS5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaXNJbkxpc3Q6IGZ1bmN0aW9uKHByb3BlcnR5VmFsdWUsIGlkZW50aWZ5aW5nUHJvcGVydHksIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0W2ldW2lkZW50aWZ5aW5nUHJvcGVydHldID09PSBwcm9wZXJ0eVZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==