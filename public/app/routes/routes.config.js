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
            .state('/', {
                url: "/",
                templateUrl: TEMPLATEPATH + 'promo.html'
            })
            .state('menu', {
                url: "/menu",
                templateUrl: 'app/menu/menu.html',
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
                templateUrl: BASEPATH + "admin/admin.html",
                controller: 'adminController'
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
