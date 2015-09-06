(function () {
    "use strict";

    var ns = 'app';

    angular
        .module(ns, [
            // Third party dependencies
            'ui.bootstrap',
            'ngMaterial',
            'sticky',

            // App dependencies
            'app.menu',
            'app.admin-login',
            'app.admin',
            'app.completeMenu',
            'app.routes',

            // Core
            'utilities.datetime',
            'utilities.googleanalytics',
            'utilities.localstorage',
            'ngSanitize'

        ])
        .config(materialConfig)
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

    function toastrConfig() {
        toastr.options.timeOut = 5000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

})();
