(function () {
    "use strict";

    var ns = 'app';
    var BASEPATH = 'app/';
    var TEMPLATEPATH = BASEPATH + 'templates/';

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

    function uiRouterConfig($stateProvider, $urlRouterProvider) {
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

    function toastrConfig() {
        toastr.options.timeOut = 10000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

})();
