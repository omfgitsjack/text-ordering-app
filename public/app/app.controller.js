(function () {
    "use strict";

    angular
        .module('app')
        .controller('appController', appController);

    function appController($scope, $mdDialog) {

        $scope.showQRCode = showQRCode;

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
    }

})();
