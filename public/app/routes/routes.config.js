(function () {
    "use strict";

    var TEMPLATEPATH = BASEPATH + 'templates/';
    var BASEPATH = 'app/';

    angular
        .module('app.routes')
        .config(routesConfig);

    function routesConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/menu');

        $stateProvider
            .state('menu', {
                url: "/menu",
                templateUrl: 'app/menu/menu.html',
                controller: 'menuController',
                resolve: {
                    foodResolve: function (FoodService) {
                        return FoodService.get().success(function (res) {
                            return res.map(function (el) {
                                el.order = {
                                    quantity: 0,
                                    cost: function () {
                                        return this.quantity * el.taxedprice
                                    }
                                };
                                return el;
                            });
                        });
                    },
                    shopStatusResolve: function (ShopService) {
                        return ShopService.get().success(function (res) {
                            return {
                                is_open: res['is_open']
                            }
                        });
                    },
                    locationResolve: function(LocationService) {
                        return LocationService.get();
                    }
                },
                data: {
                    requireLogin: false
                }
            })
            .state('completeMenu', {
                url: "/complete_menu",
                templateUrl: 'app/complete_menu/complete_menu.html',
                controller: 'completeMenuController',
                data: {
                    requireLogin: false
                }
            })
            .state("admin", {
                abstract: true,
                url: "/admin",
                templateUrl: BASEPATH + "admin/admin.html",
                controller: 'adminController',
                data: {
                    requireLogin: true
                }
            })
            .state("admin.orders", {
                url: "/orders",
                templateUrl: BASEPATH + "admin/orders.html",
                controller: 'ordersController'
            })
            .state("admin.food", {
                url: "/food",
                templateUrl: BASEPATH + "admin/food.html",
                controller: 'foodController'
            });
    }

})();
