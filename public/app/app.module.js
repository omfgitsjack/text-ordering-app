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
                templateUrl: TEMPLATEPATH + 'menu.html',
                controller: 'menuController'
            })
            .state("admin", {
                abstract: true,
                url: "/admin",
                templateUrl: TEMPLATEPATH + "admin.html"/*,
                controller: 'adminController'*/
            })
            .state("admin.orders", {
                url: "/orders",
                templateUrl: TEMPLATEPATH + "orders.html",
                controller: 'ordersController'
            });
    }

    function toastrConfig() {
        toastr.options.timeOut = 10000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

})();
