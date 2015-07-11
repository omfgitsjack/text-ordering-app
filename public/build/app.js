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
            'app.completeMenu',

            // Core
            'utilities.datetime',
            'utilities.googleanalytics',
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
            .state('completeMenu', {
                url: "/complete_menu",
                templateUrl: 'app/complete_menu/complete_menu.html',
                controller: 'completeMenuController'
            })
            .state("admin", {
                abstract: true,
                url: "/admin",
                templateUrl: TEMPLATEPATH + "admin.html",
                controller: 'adminController'
            })
            .state("admin.orders", {
                url: "/orders",
                templateUrl: TEMPLATEPATH + "orders.html",
                controller: 'ordersController'
            })
            .state("admin.food", {
                url: "/food",
                templateUrl: TEMPLATEPATH + "food.html",
                controller: 'foodController'
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

    angular.module('app.completeMenu', []);

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

    angular.module('utilities.googleanalytics',
        [
            'angulartics',
            'angulartics.google.analytics'
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
        .module('utilities.googleanalytics')
        .run(run);

    function run()
    {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-54553612-1', 'auto');
        ga('require', 'displayfeatures');
    }

})();
(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('adminController', adminController);

    function adminController($scope, $timeout, $mdSidenav, $mdUtil, $log, $state, ShopService) {

        $scope.toggleLeft = buildToggler('left');

        function buildToggler(navID) {
            var debounceFn =  $mdUtil.debounce(function(){
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            },300);
            return debounceFn;
        }

        $scope.leftClose = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };

        $scope.goToOrders = function() {
            $state.go('admin.orders');
        };

        $scope.goToFood = function() {
            $state.go('admin.food');
        }

        $scope.changeStoreStatus = function() {
            // Dont do anything.
        }

        // Initialize ShopService
        ShopService
            .get()
            .success(function(item) {
                $scope.shop = item['is_open'];
            });
    }
    adminController.$inject = ["$scope", "$timeout", "$mdSidenav", "$mdUtil", "$log", "$state", "ShopService"];

})();
(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('foodController', foodController);

    function foodController($scope, FoodService, $mdDialog) {

        var getFoodMenu = function() {
            FoodService.getAll()
                .success(function (res) {
                    $scope.food = res;

                    $scope.$watch('food', function(newVal, oldVal) {
                        if (newVal !== oldVal) {
                            FoodService
                                .update(newVal);
                            toastr.success('You have updated the menu!', 1000);
                        }
                    }, true);
                });
        };

        getFoodMenu();

        $scope.edit = function(ev, item) {
            // Save ref to current item
            $scope.curItem = item;

            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'app/templates/editFood.tmpl.html',
              parent: angular.element(document.body),
              locals: {
                item: angular.copy(item)
              },
              targetEvent: ev,
            })
            .then(function(newItem) {
                // Hardcoding the way we update the new item.
                $scope.curItem.name = newItem.name;
                $scope.curItem.description = newItem.description;
                $scope.curItem.ingredients = newItem.ingredients;
                $scope.curItem = null;
                console.log('You said the information was "' + newItem + '".');
            }, function() {
                $scope.curItem = null;
                $scope.alert = 'You cancelled the dialog.';
            });

            function DialogController($scope, $mdDialog, item) {
                $scope.item = item;
                console.log(item);
                $scope.closeDialog = function(item) {
                    $mdDialog.hide(item);
                }
                $scope.cancelDialog = function() {
                    $mdDialog.cancel('canceled');
                }
            }
            DialogController.$inject = ["$scope", "$mdDialog", "item"];

            function _update(srcObj, destObj) {
              for (var key in destObj) {
                if(destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                  destObj[key] = srcObj[key];
                }
              }
            }
        }

        $scope.tempModel = true;

    }
    foodController.$inject = ["$scope", "FoodService", "$mdDialog"];

})();
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
    ordersController.$inject = ["$scope", "$timeout", "OrderService", "DateTimeService"];


})();
(function () {
    "use strict";

    angular
        .module('app.completeMenu')
        .controller('completeMenuController', completeMenuController);

    function completeMenuController($scope, FoodService) {

        var getFoodMenu = function() {
            FoodService.getAll()
                .success(function (res) {
                    // Filter out the drinks
                    
                    $scope.food = res.filter(function(el) {
                        return  !(el.id === 21 || 
                                el.id === 22 || 
                                el.id === 23 || 
                                el.id === 24 || 
                                el.id === 25); 
                    });
                });
        };

        getFoodMenu();
    }
    completeMenuController.$inject = ["$scope", "FoodService"];

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

    // CONSTANTS
    var ORDER_TIMEOUT = 60 * 5;

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
        console.log(ns); 
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
                    countDown(ORDER_TIMEOUT); 
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
                },
                getAll: function() {
                    var me = this;

                    // change this back!
                    return $http.get('http://ucafe.jackyiu.me/api/food/all')
                        .success(function(res) {
                            res = res.map(function(el) {
                                if (el.available === 1) {
                                    el.available = true;
                                } else {
                                    el.available = false;
                                }
                                return el;
                            });

                            me.items = res;
                            return me.items;
                        });
                },
                update: function(foodItems) {
                    var items = foodItems.slice();
                    var me = this;
                    items = items.map(function(el) {

                        if (typeof el !== "number") {
                            if (el.available === true) {
                                el.available = 1;
                            } else if (el.available === false) {
                                el.available = 0;
                            }
                        }

                        return el;
                    });

                    $http.put('api/food',
                        {
                            foodList: items
                        });

                    foodItems = items.map(function(el) {
                        var temp = el;
                        if (temp.available === 1) {
                            temp.available = true;
                        } else {
                            temp.available = false;
                        }
                        return temp;
                    });

                    me.items = foodItems;
                    return me.items;
                }
            }
        }]);
})();
(function () {
    "use strict";

    angular.module('app.models')
        .service('OrderService', ["$http", "DateTimeService", function($http, DateTimeService) {
            return {
                getCurrent: function() {
                    return $http.get('api/orders/current')
                        .success(function(res) {
                            return res.map(function(el) {
                                var n = el;
                                n.updated_at = DateTimeService.parseUTC(el.updated_at);

                                return n;
                            })
                        });
                },
                isLastOrder: function(time) {
                    // Last Order is defined by any order between 10:00 - 10:30
                    var start = DateTimeService.now()
                        .startOf('day')
                        .add(10, 'hours');

                    var deadline = DateTimeService.now()
                        .startOf('day')
                        .add(10, 'hours')
                        .add(30, 'minutes');

                    return time.isAfter(start, 'minute') &&
                            time.isBefore(deadline, 'minute');
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

                        items[i].lastOrder = this.isLastOrder(items[i].updated_at);

                        if (index !== false) {
                            list[index].totalprice += (items[i].quantity * items[i].taxedprice);
                            list[index].items.push({
                                name: items[i].name,
                                quantity: items[i].quantity,
                                lastOrder: items[i].lastOrder
                            });
                        } else {
                            list.push({
                                id: items[i].id,
                                phone: items[i].phone,
                                totalprice: items[i].quantity * items[i].taxedprice,
                                items: [{
                                    name: items[i].name,
                                    quantity: items[i].quantity,
                                    price: items[i].taxedprice * items[i].quantity,
                                    lastOrder: items[i].lastOrder
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

(function () {
    "use strict";

    angular.module('app.models')
        .service('ShopService', ["$http", function($http) {
            return {
                items: [],
                get: function() {
                    var me = this;

                    return $http.get('api/shop')
                        .success(function(res) {
                            res.is_open = res.is_open === 1 ? true : false;

                            return res;
                        });
                },
                update: function(shop) {
                    shop.is_open = shop.is_open ? 1 : 0;
                    
                    return $http.put('api/shop',
                        {
                            shop: shop
                        });
                }
            }
        }]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhZG1pbi9hZG1pbi5tb2R1bGUuanMiLCJjb21wbGV0ZV9tZW51L2NvbXBsZXRlX21lbnUubW9kdWxlLmpzIiwibWVudS9tZW51Lm1vZHVsZS5qcyIsIm1vZGVscy9tb2RlbHMubW9kdWxlLmpzIiwidXRpbGl0aWVzL2RhdGV0aW1lL2RhdGV0aW1lLm1vZHVsZS5qcyIsInV0aWxpdGllcy9nb29nbGVhbmFseXRpY3MvZ29vZ2xlYW5hbHl0aWNzLm1vZHVsZS5qcyIsInV0aWxpdGllcy9kYXRldGltZS9kYXRldGltZS5jb25zdGFudC5qcyIsInV0aWxpdGllcy9kYXRldGltZS9kYXRldGltZS5jb25maWcuanMiLCJ1dGlsaXRpZXMvZ29vZ2xlYW5hbHl0aWNzL2dvb2dsZWFuYWx5dGljcy5jb25maWcuanMiLCJhZG1pbi9hZG1pbi5jb250cm9sbGVyLmpzIiwiYWRtaW4vZm9vZC5jb250cm9sbGVyLmpzIiwiYWRtaW4vb3JkZXJzLmNvbnRyb2xsZXIuanMiLCJjb21wbGV0ZV9tZW51L2NvbXBsZXRlX21lbnUuY29udHJvbGxlci5qcyIsIm1lbnUvZm9vZC5jb250cm9sbGVyLmpzIiwibWVudS9tZW51LmNvbnRyb2xsZXIuanMiLCJ1dGlsaXRpZXMvZGF0ZXRpbWUvZGF0ZXRpbWUuZmFjdG9yeS5qcyIsIm1vZGVscy9mb29kLW1vZGVsLnNlcnZpY2UuanMiLCJtb2RlbHMvb3JkZXItbW9kZWwuc2VydmljZS5qcyIsIm1vZGVscy9zaG9wLW1vZGVsLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxLQUFBO0lBQ0EsSUFBQSxlQUFBOztJQUVBO1NBQ0EsT0FBQSxJQUFBOztZQUVBO1lBQ0E7WUFDQTs7O1lBR0E7WUFDQTtZQUNBOzs7WUFHQTtZQUNBO1lBQ0E7O1NBRUEsT0FBQTtTQUNBLE9BQUE7U0FDQSxPQUFBOztJQUVBLFNBQUEsZUFBQSxvQkFBQTtRQUNBLG1CQUFBLE1BQUE7YUFDQSxlQUFBLFFBQUE7Z0JBQ0EsV0FBQTs7YUFFQSxjQUFBLFFBQUE7Z0JBQ0EsV0FBQTs7YUFFQSxZQUFBO1FBQ0EsbUJBQUEsTUFBQTthQUNBLGVBQUE7UUFDQSxtQkFBQSxNQUFBO2FBQ0EsZUFBQTs7OztJQUdBLFNBQUEsZUFBQSxnQkFBQSxvQkFBQTtRQUNBLG1CQUFBLFVBQUE7O1FBRUE7YUFDQSxNQUFBLEtBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxhQUFBLGVBQUE7O2FBRUEsTUFBQSxRQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsYUFBQSxlQUFBO2dCQUNBLFlBQUE7O2FBRUEsTUFBQSxnQkFBQTtnQkFDQSxLQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsWUFBQTs7YUFFQSxNQUFBLFNBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxLQUFBO2dCQUNBLGFBQUEsZUFBQTtnQkFDQSxZQUFBOzthQUVBLE1BQUEsZ0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxhQUFBLGVBQUE7Z0JBQ0EsWUFBQTs7YUFFQSxNQUFBLGNBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxhQUFBLGVBQUE7Z0JBQ0EsWUFBQTs7Ozs7SUFJQSxTQUFBLGVBQUE7UUFDQSxPQUFBLFFBQUEsVUFBQTtRQUNBLE9BQUEsUUFBQSxnQkFBQTs7Ozs7QUNoRkEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGFBQUE7OztBQ0hBLENBQUEsWUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxvQkFBQTs7O0FDSEEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxLQUFBOztJQUVBO1NBQ0EsT0FBQSxJQUFBO1lBQ0E7Ozs7O0FDUEEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGNBQUE7OztBQ0hBLENBQUEsWUFBQTtJQUNBOzs7Ozs7OztJQVFBLFFBQUEsT0FBQTtRQUNBO1lBQ0E7Ozs7QUNYQSxDQUFBLFlBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUE7UUFDQTtZQUNBO1lBQ0E7Ozs7QUNOQSxDQUFBLFlBQUE7SUFDQTs7Ozs7OztJQU9B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b0JBRUEsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsUUFBQSxLQUFBO3dCQUNBLElBQUEsUUFBQSxHQUFBLFNBQUEsTUFBQSxHQUFBLE1BQUEsUUFBQTt3QkFDQSxJQUFBLFVBQUEsUUFBQTs0QkFDQSxVQUFBLE9BQUEsWUFBQSxNQUFBLEdBQUE7K0JBQ0E7NEJBQ0EsVUFBQSxLQUFBO2dDQUNBLFFBQUEsTUFBQSxHQUFBO2dDQUNBLFlBQUEsTUFBQSxHQUFBOzs7O29CQUlBLE9BQUE7O2dCQUVBLHNCQUFBLFNBQUEsT0FBQTtvQkFDQSxJQUFBLEtBQUE7b0JBQ0EsSUFBQSxPQUFBOztvQkFFQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxRQUFBLEtBQUE7d0JBQ0EsSUFBQSxRQUFBLEdBQUEsU0FBQSxNQUFBLEdBQUEsSUFBQSxNQUFBOzt3QkFFQSxNQUFBLEdBQUEsWUFBQSxLQUFBLFlBQUEsTUFBQSxHQUFBOzt3QkFFQSxJQUFBLFVBQUEsT0FBQTs0QkFDQSxLQUFBLE9BQUEsZUFBQSxNQUFBLEdBQUEsV0FBQSxNQUFBLEdBQUE7NEJBQ0EsS0FBQSxPQUFBLE1BQUEsS0FBQTtnQ0FDQSxNQUFBLE1BQUEsR0FBQTtnQ0FDQSxVQUFBLE1BQUEsR0FBQTtnQ0FDQSxXQUFBLE1BQUEsR0FBQTs7K0JBRUE7NEJBQ0EsS0FBQSxLQUFBO2dDQUNBLElBQUEsTUFBQSxHQUFBO2dDQUNBLE9BQUEsTUFBQSxHQUFBO2dDQUNBLFlBQUEsTUFBQSxHQUFBLFdBQUEsTUFBQSxHQUFBO2dDQUNBLE9BQUEsQ0FBQTtvQ0FDQSxNQUFBLE1BQUEsR0FBQTtvQ0FDQSxVQUFBLE1BQUEsR0FBQTtvQ0FDQSxPQUFBLE1BQUEsR0FBQSxhQUFBLE1BQUEsR0FBQTtvQ0FDQSxXQUFBLE1BQUEsR0FBQTs7Ozs7O29CQU1BLE9BQUE7O2dCQUVBLFVBQUEsU0FBQSxlQUFBLHFCQUFBLE1BQUE7b0JBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxLQUFBO3dCQUNBLElBQUEsS0FBQSxJQUFBOzRCQUNBLElBQUEsS0FBQSxHQUFBLHlCQUFBO2dDQUNBLE9BQUE7OztvQkFHQSxPQUFBOzs7Ozs7QUN4RkEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsUUFBQSx5QkFBQSxTQUFBLE9BQUE7WUFDQSxPQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsS0FBQSxXQUFBO29CQUNBLElBQUEsS0FBQTs7b0JBRUEsT0FBQSxNQUFBLElBQUE7eUJBQ0EsUUFBQSxTQUFBLEtBQUE7NEJBQ0EsSUFBQSxVQUFBLElBQUEsWUFBQSxJQUFBLE9BQUE7OzRCQUVBLE9BQUE7OztnQkFHQSxRQUFBLFNBQUEsTUFBQTtvQkFDQSxLQUFBLFVBQUEsS0FBQSxVQUFBLElBQUE7O29CQUVBLE9BQUEsTUFBQSxJQUFBO3dCQUNBOzRCQUNBLE1BQUE7Ozs7O0tBS0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBucyA9ICdhcHAnO1xyXG4gICAgdmFyIFRFTVBMQVRFUEFUSCA9ICdhcHAvdGVtcGxhdGVzLyc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUobnMsIFtcclxuICAgICAgICAgICAgLy8gVGhpcmQgcGFydHkgZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgICAgICd1aS5ib290c3RyYXAnLFxyXG4gICAgICAgICAgICAnbmdNYXRlcmlhbCcsXHJcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxyXG5cclxuICAgICAgICAgICAgLy8gQXBwIGRlcGVuZGVuY2llc1xyXG4gICAgICAgICAgICAnYXBwLm1lbnUnLFxyXG4gICAgICAgICAgICAnYXBwLmFkbWluJyxcclxuICAgICAgICAgICAgJ2FwcC5jb21wbGV0ZU1lbnUnLFxyXG5cclxuICAgICAgICAgICAgLy8gQ29yZVxyXG4gICAgICAgICAgICAndXRpbGl0aWVzLmRhdGV0aW1lJyxcclxuICAgICAgICAgICAgJ3V0aWxpdGllcy5nb29nbGVhbmFseXRpY3MnLFxyXG4gICAgICAgICAgICAnbmdTYW5pdGl6ZSdcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb25maWcobWF0ZXJpYWxDb25maWcpXHJcbiAgICAgICAgLmNvbmZpZyh1aVJvdXRlckNvbmZpZylcclxuICAgICAgICAuY29uZmlnKHRvYXN0ckNvbmZpZyk7XHJcblxyXG4gICAgZnVuY3Rpb24gbWF0ZXJpYWxDb25maWcoJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcclxuICAgICAgICAgICAgLnByaW1hcnlQYWxldHRlKCdncmV5Jywge1xyXG4gICAgICAgICAgICAgICAgJ2RlZmF1bHQnOiAnOTAwJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYWNjZW50UGFsZXR0ZSgnZ3JleScsIHtcclxuICAgICAgICAgICAgICAgICdkZWZhdWx0JzogJzgwMCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndhcm5QYWxldHRlKCdkZWVwLW9yYW5nZScpO1xyXG4gICAgICAgICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgncmVkVGhlbWVCdG4nKVxyXG4gICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ2RlZXAtb3JhbmdlJyk7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdncmVlblRoZW1lQnRuJylcclxuICAgICAgICAgICAgLnByaW1hcnlQYWxldHRlKCdncmVlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVpUm91dGVyQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvbWVudScpO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFRFTVBMQVRFUEFUSCArICdwcm9tby5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL21lbnVcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBURU1QTEFURVBBVEggKyAnbWVudS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZW51Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wbGV0ZU1lbnUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NvbXBsZXRlX21lbnVcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBsZXRlX21lbnUvY29tcGxldGVfbWVudS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjb21wbGV0ZU1lbnVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhZG1pblwiLCB7XHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHVybDogXCIvYWRtaW5cIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBURU1QTEFURVBBVEggKyBcImFkbWluLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFkbWluLm9yZGVyc1wiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL29yZGVyc1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFRFTVBMQVRFUEFUSCArIFwib3JkZXJzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdvcmRlcnNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhZG1pbi5mb29kXCIsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvZm9vZFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFRFTVBMQVRFUEFUSCArIFwiZm9vZC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZm9vZENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvYXN0ckNvbmZpZygpIHtcclxuICAgICAgICB0b2FzdHIub3B0aW9ucy50aW1lT3V0ID0gMTAwMDA7XHJcbiAgICAgICAgdG9hc3RyLm9wdGlvbnMucG9zaXRpb25DbGFzcyA9ICd0b2FzdC1ib3R0b20tcmlnaHQnO1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuYWRtaW4nLCBbXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbXBsZXRlTWVudScsIFtdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBucyA9ICdhcHAubWVudSc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUobnMsIFtcclxuICAgICAgICAgICAgJ2FwcC5tb2RlbHMnXHJcbiAgICAgICAgXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5tb2RlbHMnLCBbXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb3ZpZGVzIGEgRGF0ZVRpbWVTZXJ2aWNlIHV0aWxpdHkgY2xhc3MgdGhhdCBwcm92aWRlcyBhbiBpbnRlcmZhY2UgdG9cclxuICAgICAqIG1vbWVudCBvYmplY3RzLCB1dGlsaXRpZXMgZm9yIHdvcmtpbmcgd2l0aCBNeVNRTCBVVEMgdGltZXMgZXRjLlxyXG4gICAgICpcclxuICAgICAqIFJlZmVyIHRvIGRhdGV0aW1lLmZhY3RvcnkuanMgZm9yIGRvY3VtZW50YXRpb24gJiBhdmFpbGFibGUgdG9vbHNcclxuICAgICAqL1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3V0aWxpdGllcy5kYXRldGltZScsXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAnYW5ndWxhck1vbWVudCdcclxuICAgICAgICBdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCd1dGlsaXRpZXMuZ29vZ2xlYW5hbHl0aWNzJyxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICdhbmd1bGFydGljcycsXHJcbiAgICAgICAgICAgICdhbmd1bGFydGljcy5nb29nbGUuYW5hbHl0aWNzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXcmFwIG1vbWVudCBhcyBhbiBhbmd1bGFyIGRlcGVuZGVuY3lcclxuICAgICAqIHdoaWxzdCBzZXR0aW5nIHRoZSBkZWZhdWx0IHRpbWV6b25lIGZvciBhbmd1bGFyXHJcbiAgICAgKiBtb21lbnRcclxuICAgICAqL1xyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ1dGlsaXRpZXMuZGF0ZXRpbWVcIilcclxuICAgICAgICAuY29uc3RhbnQoJ21vbWVudCcsIG1vbWVudClcclxuICAgICAgICAuY29uc3RhbnQoJ2FuZ3VsYXJNb21lbnRDb25maWcnLCB7XHJcbiAgICAgICAgICAgIHRpbWV6b25lOiAnQW1lcmljYS9EZXRyb2l0J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNvbnN0YW50KCdVVENfVElNRUZPUk1BVCcsIFwiWVlZWS1NTS1ERCBISDpNTTpTU1wiKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1dGlsaXRpZXMuZGF0ZXRpbWUnKVxyXG4gICAgICAgIC5jb25maWcoZGF0ZXRpbWVDb25maWcpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlndXJlIGRhdGUgdGltZSBjb25maWd1cmF0aW9uLCBBbWVyaWNhL0RldHJvaXQgaGFzIHNhbWUgdGltZXpvbmUgYXMgdG9yb250b1xyXG4gICAgICogQHBhcmFtIG1vbWVudFxyXG4gICAgICogQG5nSW5qZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRhdGV0aW1lQ29uZmlnKG1vbWVudClcclxuICAgIHtcclxuICAgICAgICAvLyBNYWtlIHN1cmUgbW9tZW50IGlzIGluIGVuZ2xpc2ggYW5kIHRoZSBmaXJzdCBkYXkgb2Ygd2VlayBpcyBhIG1vbmRheVxyXG4gICAgICAgIG1vbWVudC5sYW5nKCdlbicsIHtcclxuICAgICAgICAgICAgLy8gY3VzdG9taXphdGlvbnMuXHJcbiAgICAgICAgICAgIHdlZWs6IHtcclxuICAgICAgICAgICAgICAgIGRvdzogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYWxlbmRhcjoge1xyXG4gICAgICAgICAgICAgICAgbGFzdERheTogJ1tZZXN0ZXJkYXldLCBkZGRkIE1NTSBEJyxcclxuICAgICAgICAgICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5XSwgZGRkZCBNTU0gRCcsXHJcbiAgICAgICAgICAgICAgICBuZXh0RGF5IDogJ1tUb21vcnJvd10sIGRkZGQgTU1NIEQnLFxyXG4gICAgICAgICAgICAgICAgbGFzdFdlZWsgOiAnZGRkZCwgTU1NIEQnLFxyXG4gICAgICAgICAgICAgICAgbmV4dFdlZWsgOiAnZGRkZCwgTU1NIEQnLFxyXG4gICAgICAgICAgICAgICAgc2FtZUVsc2UgOiAnZGRkZCwgTU1NIEQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIEFtZXJpY2EvRGV0cm9pdCB0aW1lem9uZSwgbm90ZSB0aGF0IHRoaXMgaXMgdGhlIHNhbWUgYXMgVG9yb250b1xyXG4gICAgICAgIG1vbWVudC50ei5hZGQoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICdBbWVyaWNhL0RldHJvaXR8RVNUIEVEVHw1MCA0MHwwMTAxMDEwMTAxMDEwMTAxMDEwMTAxMHwxQlFUMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIFJkMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwIE9wMCAxemIwJyxcclxuICAgICAgICAgICAgICAgIFwiRXRjL1VUQ3xVVEN8MHwwfFwiXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3V0aWxpdGllcy5nb29nbGVhbmFseXRpY3MnKVxyXG4gICAgICAgIC5ydW4ocnVuKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW4oKVxyXG4gICAge1xyXG4gICAgICAgIChmdW5jdGlvbihpLHMsbyxnLHIsYSxtKXtpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXT1yO2lbcl09aVtyXXx8ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgKGlbcl0ucT1pW3JdLnF8fFtdKS5wdXNoKGFyZ3VtZW50cyl9LGlbcl0ubD0xKm5ldyBEYXRlKCk7YT1zLmNyZWF0ZUVsZW1lbnQobyksXHJcbiAgICAgICAgICAgIG09cy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTthLmFzeW5jPTE7YS5zcmM9ZzttLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsbSlcclxuICAgICAgICB9KSh3aW5kb3csZG9jdW1lbnQsJ3NjcmlwdCcsJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsJ2dhJyk7XHJcblxyXG4gICAgICAgIGdhKCdjcmVhdGUnLCAnVUEtNTQ1NTM2MTItMScsICdhdXRvJyk7XHJcbiAgICAgICAgZ2EoJ3JlcXVpcmUnLCAnZGlzcGxheWZlYXR1cmVzJyk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFkbWluJylcclxuICAgICAgICAuY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgYWRtaW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZG1pbkNvbnRyb2xsZXIoJHNjb3BlLCAkdGltZW91dCwgJG1kU2lkZW5hdiwgJG1kVXRpbCwgJGxvZywgJHN0YXRlLCBTaG9wU2VydmljZSkge1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlTGVmdCA9IGJ1aWxkVG9nZ2xlcignbGVmdCcpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBidWlsZFRvZ2dsZXIobmF2SUQpIHtcclxuICAgICAgICAgICAgdmFyIGRlYm91bmNlRm4gPSAgJG1kVXRpbC5kZWJvdW5jZShmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJG1kU2lkZW5hdihuYXZJRClcclxuICAgICAgICAgICAgICAgICAgICAudG9nZ2xlKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoXCJ0b2dnbGUgXCIgKyBuYXZJRCArIFwiIGlzIGRvbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sMzAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlYm91bmNlRm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUubGVmdENsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbWRTaWRlbmF2KCdsZWZ0JykuY2xvc2UoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoXCJjbG9zZSBMRUZUIGlzIGRvbmVcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZ29Ub09yZGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluLm9yZGVycycpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5nb1RvRm9vZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluLmZvb2QnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5jaGFuZ2VTdG9yZVN0YXR1cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBEb250IGRvIGFueXRoaW5nLlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBTaG9wU2VydmljZVxyXG4gICAgICAgIFNob3BTZXJ2aWNlXHJcbiAgICAgICAgICAgIC5nZXQoKVxyXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hvcCA9IGl0ZW1bJ2lzX29wZW4nXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFkbWluJylcclxuICAgICAgICAuY29udHJvbGxlcignZm9vZENvbnRyb2xsZXInLCBmb29kQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gZm9vZENvbnRyb2xsZXIoJHNjb3BlLCBGb29kU2VydmljZSwgJG1kRGlhbG9nKSB7XHJcblxyXG4gICAgICAgIHZhciBnZXRGb29kTWVudSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBGb29kU2VydmljZS5nZXRBbGwoKVxyXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb29kID0gcmVzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdmb29kJywgZnVuY3Rpb24obmV3VmFsLCBvbGRWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCAhPT0gb2xkVmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGb29kU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUobmV3VmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgaGF2ZSB1cGRhdGVkIHRoZSBtZW51IScsIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnZXRGb29kTWVudSgpO1xyXG5cclxuICAgICAgICAkc2NvcGUuZWRpdCA9IGZ1bmN0aW9uKGV2LCBpdGVtKSB7XHJcbiAgICAgICAgICAgIC8vIFNhdmUgcmVmIHRvIGN1cnJlbnQgaXRlbVxyXG4gICAgICAgICAgICAkc2NvcGUuY3VySXRlbSA9IGl0ZW07XHJcblxyXG4gICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC90ZW1wbGF0ZXMvZWRpdEZvb2QudG1wbC5odG1sJyxcclxuICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICBsb2NhbHM6IHtcclxuICAgICAgICAgICAgICAgIGl0ZW06IGFuZ3VsYXIuY29weShpdGVtKVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihuZXdJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBIYXJkY29kaW5nIHRoZSB3YXkgd2UgdXBkYXRlIHRoZSBuZXcgaXRlbS5cclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJJdGVtLm5hbWUgPSBuZXdJdGVtLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VySXRlbS5kZXNjcmlwdGlvbiA9IG5ld0l0ZW0uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VySXRlbS5pbmdyZWRpZW50cyA9IG5ld0l0ZW0uaW5ncmVkaWVudHM7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VySXRlbSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IHNhaWQgdGhlIGluZm9ybWF0aW9uIHdhcyBcIicgKyBuZXdJdGVtICsgJ1wiLicpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJJdGVtID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydCA9ICdZb3UgY2FuY2VsbGVkIHRoZSBkaWFsb2cuJztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZURpYWxvZyA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZShpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5jYW5jZWxEaWFsb2cgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuY2FuY2VsKCdjYW5jZWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBfdXBkYXRlKHNyY09iaiwgZGVzdE9iaikge1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkZXN0T2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkZXN0T2JqLmhhc093blByb3BlcnR5KGtleSkgJiYgc3JjT2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgZGVzdE9ialtrZXldID0gc3JjT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUudGVtcE1vZGVsID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFkbWluJylcclxuICAgICAgICAuY29udHJvbGxlcignb3JkZXJzQ29udHJvbGxlcicsIG9yZGVyc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9yZGVyc0NvbnRyb2xsZXIoJHNjb3BlLCAkdGltZW91dCwgT3JkZXJTZXJ2aWNlLCBEYXRlVGltZVNlcnZpY2UpIHtcclxuICAgICAgICAkc2NvcGUub3JkZXJTZXJ2aWNlID0gT3JkZXJTZXJ2aWNlO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG5vdyA9IERhdGVUaW1lU2VydmljZS5ub3coKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZGF5RGF5ID0gRGF0ZVRpbWVTZXJ2aWNlLm5vdygpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgICAgICRzY29wZS50b21vcnJvd0RheSA9IERhdGVUaW1lU2VydmljZS5ub3coKS5hZGQoMSwgJ2RheXMnKS5zdGFydE9mKCdkYXknKTtcclxuXHJcbiAgICAgICAgLy8gSWYgaXQncyB0b2RheSBiZWZvcmUgNHBtLCBzaG93IHllc3RlcmRheSdzIG9yZGVyLlxyXG4gICAgICAgICRzY29wZS50b21vcnJvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnREYXkgPSAkc2NvcGUudG9tb3Jyb3dEYXk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudERheSA9ICRzY29wZS50b2RheURheTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgbWUuZ2V0T3JkZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgaXQncyBkdXJpbmcgZGVsaXZlcnkgdGltZSwgc2hvdyB0aGUgb3JkZXIgdG8gYmUgZGVsaXZlcmVkIHRvZGF5LlxyXG4gICAgICAgICAgICAgICAgaWYgKDAgPD0gbm93LmdldCgnaG91cicpICYmIG5vdy5nZXQoJ2hvdXInKSA8IDE2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvZGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGl0J3MgYWZ0ZXIgZGVsaXZlcnkgdGltZSBmb3IgdG9kYXksIHNob3cgdGhlIG9yZGVyIHRvIGJlIGRlbGl2ZXJlZCB0b21vcnJvd1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50b21vcnJvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yZGVyU2VydmljZS5nZXRDdXJyZW50KClcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50QWdncmVnYXRlT3JkZXIgPSAkc2NvcGUub3JkZXJTZXJ2aWNlLmFnZ3JlZ2F0ZVRyYW5zZm9ybWVyKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50T3JkZXJMaXN0ID0gJHNjb3BlLm9yZGVyU2VydmljZS5vcmRlckxpc3RUcmFuc2Zvcm1lcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG1lLmluaXRQb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lLmdldE9yZGVycygpLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5pbmZvKCdVcGRhdGVkIE9yZGVyIExpc3QnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUuaW5pdFBvbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIDE1MDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG1lLmdldE9yZGVycygpO1xyXG4gICAgICAgICAgICBtZS5pbml0UG9sbCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG1lLmluaXQoKTtcclxuICAgIH1cclxuXHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBsZXRlTWVudScpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2NvbXBsZXRlTWVudUNvbnRyb2xsZXInLCBjb21wbGV0ZU1lbnVDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21wbGV0ZU1lbnVDb250cm9sbGVyKCRzY29wZSwgRm9vZFNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgdmFyIGdldEZvb2RNZW51ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEZvb2RTZXJ2aWNlLmdldEFsbCgpXHJcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlsdGVyIG91dCB0aGUgZHJpbmtzXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvb2QgPSByZXMuZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAgIShlbC5pZCA9PT0gMjEgfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuaWQgPT09IDIyIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLmlkID09PSAyMyB8fCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5pZCA9PT0gMjQgfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuaWQgPT09IDI1KTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnZXRGb29kTWVudSgpO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIG5zID0gJ2FwcC5tZW51JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZShucywgW1xyXG4gICAgICAgICAgICAnYXBwLm1vZGVscydcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdmb29kQ29udHJvbGxlcicsIGZvb2RDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBmb29kQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIENPTlNUQU5UU1xyXG4gICAgdmFyIE9SREVSX1RJTUVPVVQgPSA2MCAqIDU7XHJcblxyXG4gICAgdmFyIG5zID0gJ2FwcC5tZW51JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZShucylcclxuICAgICAgICAuY29udHJvbGxlcignbWVudUNvbnRyb2xsZXInLCBtZW51Q29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gbWVudUNvbnRyb2xsZXIoJHNjb3BlLCAkaHR0cCwgJHRpbWVvdXQsICRmaWx0ZXIsIEZvb2RTZXJ2aWNlLCBEYXRlVGltZVNlcnZpY2UpIHtcclxuICAgICAgICAkc2NvcGUub3JkZXIgPSBbXTtcclxuICAgICAgICAkc2NvcGUuYXV0aCA9IHtcclxuICAgICAgICAgICAgaWQ6IC0xLFxyXG4gICAgICAgICAgICBjb2RlOiAnJ1xyXG4gICAgICAgIH07ICBcclxuICAgICAgICBjb25zb2xlLmxvZyhucyk7IFxyXG4gICAgICAgIHZhciBub3cgPSBEYXRlVGltZVNlcnZpY2Uubm93KCk7XHJcbiAgICAgICAgdmFyIGRlYWRsaW5lID0gRGF0ZVRpbWVTZXJ2aWNlLm5vdygpXHJcbiAgICAgICAgICAgIC5zdGFydE9mKCdkYXknKVxyXG4gICAgICAgICAgICAuYWRkKDEwLCAnaG91cnMnKVxyXG4gICAgICAgICAgICAuYWRkKDMwLCAnbWludXRlcycpO1xyXG5cclxuICAgICAgICAkc2NvcGUudG9tb3Jyb3dEYXkgPSBEYXRlVGltZVNlcnZpY2Uubm93KCkuYWRkKDEsICdkYXlzJykuc3RhcnRPZignZGF5JykuZm9ybWF0KCdkZGRkLCBNTU1NIERvJyk7XHJcblxyXG4gICAgICAgIGlmIChub3cuaXNCZWZvcmUoZGVhZGxpbmUsICdtaW51dGUnKSkge1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0b2FzdHIud2FybmluZygnQWxsIG9yZGVycyBtYWRlIGZyb20gdGhpcyBwb2ludCBvbiB3aWxsIGJlIGZvciAnICsgJHNjb3BlLnRvbW9ycm93RGF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEluaXQgb3VyICRzY29wZS5mb29kXHJcbiAgICAgICAgRm9vZFNlcnZpY2UuZ2V0KClcclxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvb2QgPSByZXMubWFwKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLm9yZGVyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29zdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVhbnRpdHkgKiBlbC50YXhlZHByaWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmluY3JlbWVudCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ub3JkZXIucXVhbnRpdHkrK1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmRlY3JlbWVudCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ub3JkZXIucXVhbnRpdHktLVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFdhdGNoIGZvb2QgY29sbGVjdGlvbiBhbmQgdXBkYXRlIG9yZGVyLlxyXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ2Zvb2QnLCBmdW5jdGlvbiAobmV3VmFsLCBvbGRWYWwpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbCAhPSBvbGRWYWwpIHtcclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBPcmRlclxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9yZGVyID0gJHNjb3BlLmZvb2QuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5vcmRlci5xdWFudGl0eSA+IDA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRydWUpO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgdG90YWwgcHJpY2Ugb2Ygb3JkZXJcclxuICAgICAgICAkc2NvcGUub3JkZXJUb3RhbCA9IGZ1bmN0aW9uIChvcmRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gb3JkZXIucmVkdWNlKGZ1bmN0aW9uIChwcmV2VmFsLCBjdXJWYWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcmV2VmFsICsgKGN1clZhbC5vcmRlci5xdWFudGl0eSAqIGN1clZhbC50YXhlZHByaWNlKTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ291bnRpbmdEb3duID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY291bnREb3duVmFsID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5jb3VudERvd25WYWwgPSAwO1xyXG4gICAgICAgICRzY29wZS5kaXNhYmxlT3JkZXJCdG4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlucHV0UGxhY2VIb2xkZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5pc0NvdW50aW5nRG93bigpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCLor7fnrYlcIiArICRzY29wZS5jb3VudERvd25WYWwgKyBcIuenklwiXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCLkuIvljZVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUubWFrZU9yZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgICAgICAgLnBvc3QoJ2FwaS9hdXRoZW50aWNhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBvcmRlcjogJHNjb3BlLm9yZGVyXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCfosKLosKLvvIHkvaDnmoTorqLljZXlt7Lnu4/mlLbliLDjgILor7fmn6XnnIvnn63kv6HlrozmiJDorqLljZUnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY291bnREb3duID0gZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jb3VudERvd25WYWwgPSB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudERvd24oLS12YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnREb3duKE9SREVSX1RJTUVPVVQpOyBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3V0aWxpdGllcy5kYXRldGltZScpXHJcbiAgICAgICAgLmZhY3RvcnkoJ0RhdGVUaW1lU2VydmljZScsIERhdGVUaW1lRmFjdG9yeSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEYXRlIFRpbWUgdXRpbGl0eSBiZWx0IHRoYXQgdXRpbGl6ZXMgbW9tZW50ICYgc3VwcGxpZXMga2V5XHJcbiAgICAgKiB1dGlsaXRpZXMgZm9yIHdvcmtpbmcgd2l0aCBNeVNRTCBEYXRlVGltZSAmIHRpbWUgem9uZSBpc3N1ZXNcclxuICAgICAqIEByZXR1cm5zIHt7bm93OiBub3csIHRvVVRDOiB0b1VUQywgcGFyc2VVVEM6IHBhcnNlVVRDfX1cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQG5nSW5qZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIERhdGVUaW1lRmFjdG9yeShVVENfVElNRUZPUk1BVCkge1xyXG5cclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgbm93OiBub3csXHJcbiAgICAgICAgICAgIHRvVVRDOiB0b1VUQyxcclxuICAgICAgICAgICAgcGFyc2VVVEM6IHBhcnNlVVRDLFxyXG4gICAgICAgICAgICBnZXREYXlzSW5UaGlzV2VlazogZ2V0RGF5c0luVGhpc1dlZWtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvdmlkZSBhbiBpbnRlcmZhY2UgdG8gcmV0cmlldmUgYSBtb21lbnQvZGF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIG1vbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIG5vdygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC50eihuZXcgRGF0ZSgpLCAnQW1lcmljYS9EZXRyb2l0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUcmFuc2Zvcm1zIG1vbWVudCBpbnRvIE15U1FMIGFjY2VwdGFibGUgVVRDIERhdGVUaW1lIG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSBtb21lbnRPYmpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiB0b1VUQyhtb21lbnRPYmopIHtcclxuICAgICAgICAgICAgaWYgKCFtb21lbnQuaXNNb21lbnQobW9tZW50T2JqKSkge1xyXG4gICAgICAgICAgICAgICAgZXhjZXB0aW9uU2VydmljZS5jYXRjaGVyKCdOb24tbW9tZW50IG9iamVjdCBkZXRlY3RlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbW9tZW50T2JqLnR6KFwiRXRjL1VUQ1wiKS5mb3JtYXQoVVRDX1RJTUVGT1JNQVQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVHJhbnNmb3JtcyBNeVNRTCBVVEMgdGltZSBTdHJpbmdzIGludG8gbW9tZW50c1xyXG4gICAgICAgICAqIEBwYXJhbSB1dGNTdHJpbmdcclxuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZVVUQyh1dGNTdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC50eih1dGNTdHJpbmcsICdBbWVyaWNhL0RldHJvaXQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBhcnJheSBvZiBtb21lbnRzIGZvciB0aGlzIHdlZWssXHJcbiAgICAgICAgICogZWFjaCBtb21lbnQgcmVwcmVzZW50cyB0aGUgc3RhcnQgb2YgdGhlIGRheS5cclxuICAgICAgICAgKiBAcmV0dXJuczpcclxuICAgICAgICAgKiBbXHJcbiAgICAgICAgICogICAgICBtb21lbnQsIC8vIE1vbWVudCBmb3IgTW9uZGF5XHJcbiAgICAgICAgICogICAgICBtb21lbnQgLy8gIE1vbWVudCBmb3IgVHVlc2RheVxyXG4gICAgICAgICAqICAgICAgLi4uIC8vIFNvIG9uIHRpbCBTdW5kYXlcclxuICAgICAgICAgKiBdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF5c0luVGhpc1dlZWsoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXREYXlzSW5XZWVrKG5vdygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBhcnJheSBvZiBtb21lbnRzIGZvciBhIHdlZWssIHRoZSB3ZWVrIGlzIGJhc2VkXHJcbiAgICAgICAgICogb24gdGhlIGlucHV0dGVkIG1vbWVudFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXlJbldlZWtcclxuICAgICAgICAgKiBAcmV0dXJuc1xyXG4gICAgICAgICAqIFtcclxuICAgICAgICAgKiAgICAgIG1vbWVudCwgLy8gTW9tZW50IGZvciBNb25kYXlcclxuICAgICAgICAgKiAgICAgIG1vbWVudCAvLyAgTW9tZW50IGZvciBUdWVzZGF5XHJcbiAgICAgICAgICogICAgICAuLi4gLy8gU28gb24gdGlsIFN1bmRheVxyXG4gICAgICAgICAqIF1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXlzSW5XZWVrKGRheUluV2Vlaykge1xyXG4gICAgICAgICAgICB2YXIgZmlyc3REYXlPZldlZWsgPSBkYXlJbldlZWsuc3RhcnRPZignd2VlaycpO1xyXG4gICAgICAgICAgICB2YXIgZGF5c0luV2VlayA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA3OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGRheXNJbldlZWsucHVzaChhbmd1bGFyLmNvcHkoZmlyc3REYXlPZldlZWspLmFkZChpLCAnZGF5cycpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRheXNJbldlZWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLm1vZGVscycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ0Zvb2RTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXSxcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL2Zvb2QnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLml0ZW1zID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lLml0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0aGlzIGJhY2shXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3VjYWZlLmphY2t5aXUubWUvYXBpL2Zvb2QvYWxsJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMubWFwKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmF2YWlsYWJsZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLmF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5pdGVtcyA9IHJlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZS5pdGVtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihmb29kSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBmb29kSXRlbXMuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gaXRlbXMubWFwKGZ1bmN0aW9uKGVsKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsICE9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWwuYXZhaWxhYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuYXZhaWxhYmxlID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWwuYXZhaWxhYmxlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLmF2YWlsYWJsZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAucHV0KCdhcGkvZm9vZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvb2RMaXN0OiBpdGVtc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9vZEl0ZW1zID0gaXRlbXMubWFwKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wLmF2YWlsYWJsZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcC5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcC5hdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWUuaXRlbXMgPSBmb29kSXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lLml0ZW1zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAubW9kZWxzJylcclxuICAgICAgICAuc2VydmljZSgnT3JkZXJTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHAsIERhdGVUaW1lU2VydmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZ2V0Q3VycmVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL29yZGVycy9jdXJyZW50JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLm1hcChmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbi51cGRhdGVkX2F0ID0gRGF0ZVRpbWVTZXJ2aWNlLnBhcnNlVVRDKGVsLnVwZGF0ZWRfYXQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGlzTGFzdE9yZGVyOiBmdW5jdGlvbih0aW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTGFzdCBPcmRlciBpcyBkZWZpbmVkIGJ5IGFueSBvcmRlciBiZXR3ZWVuIDEwOjAwIC0gMTA6MzBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBEYXRlVGltZVNlcnZpY2Uubm93KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0T2YoJ2RheScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoMTAsICdob3VycycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVhZGxpbmUgPSBEYXRlVGltZVNlcnZpY2Uubm93KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0YXJ0T2YoJ2RheScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoMTAsICdob3VycycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoMzAsICdtaW51dGVzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aW1lLmlzQWZ0ZXIoc3RhcnQsICdtaW51dGUnKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZS5pc0JlZm9yZShkZWFkbGluZSwgJ21pbnV0ZScpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZVRyYW5zZm9ybWVyOiBmdW5jdGlvbihpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZ2dyZWdhdGUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IG1lLmlzSW5MaXN0KGl0ZW1zW2ldLm5hbWUsICduYW1lJywgYWdncmVnYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSBmYWxzZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZVtpbmRleF0ucXVhbnRpdHkgKz0gaXRlbXNbaV0ucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGUucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBpdGVtc1tpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdxdWFudGl0eSc6IGl0ZW1zW2ldLnF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWdncmVnYXRlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9yZGVyTGlzdFRyYW5zZm9ybWVyOiBmdW5jdGlvbihpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBtZS5pc0luTGlzdChpdGVtc1tpXS5pZCwgJ2lkJywgbGlzdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS5sYXN0T3JkZXIgPSB0aGlzLmlzTGFzdE9yZGVyKGl0ZW1zW2ldLnVwZGF0ZWRfYXQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFtpbmRleF0udG90YWxwcmljZSArPSAoaXRlbXNbaV0ucXVhbnRpdHkgKiBpdGVtc1tpXS50YXhlZHByaWNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RbaW5kZXhdLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW1zW2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IGl0ZW1zW2ldLnF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RPcmRlcjogaXRlbXNbaV0ubGFzdE9yZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW1zW2ldLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lOiBpdGVtc1tpXS5waG9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHByaWNlOiBpdGVtc1tpXS5xdWFudGl0eSAqIGl0ZW1zW2ldLnRheGVkcHJpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW1zW2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBpdGVtc1tpXS5xdWFudGl0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGl0ZW1zW2ldLnRheGVkcHJpY2UgKiBpdGVtc1tpXS5xdWFudGl0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE9yZGVyOiBpdGVtc1tpXS5sYXN0T3JkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGlzSW5MaXN0OiBmdW5jdGlvbihwcm9wZXJ0eVZhbHVlLCBpZGVudGlmeWluZ1Byb3BlcnR5LCBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0W2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdFtpXVtpZGVudGlmeWluZ1Byb3BlcnR5XSA9PT0gcHJvcGVydHlWYWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAubW9kZWxzJylcclxuICAgICAgICAuc2VydmljZSgnU2hvcFNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvc2hvcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmlzX29wZW4gPSByZXMuaXNfb3BlbiA9PT0gMSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKHNob3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG9wLmlzX29wZW4gPSBzaG9wLmlzX29wZW4gPyAxIDogMDtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdhcGkvc2hvcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3A6IHNob3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=