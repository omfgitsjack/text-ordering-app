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
            'utilities.datetime'
        ])
        .config(materialConfig)
        .config(uiRouterConfig);

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

})();