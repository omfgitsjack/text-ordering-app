(function () {
    "use strict";

    angular
        .module('app')
        .controller('appController', appController);

    function appController($scope, $mdDialog) {

        $scope.showQRCode = showQRCode;
        $scope.showAboutUs = showAboutUs;

        function showQRCode() {
            $mdDialog.show({
                controller: function($mdDialog) {
                    $scope.close = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: 'app/wechatqr.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        }

        function showAboutUs() {
            $mdDialog.show({
                controller: function($mdDialog) {
                    $scope.close = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: 'app/aboutus.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        }
    }

})();
