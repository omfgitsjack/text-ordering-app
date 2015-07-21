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
