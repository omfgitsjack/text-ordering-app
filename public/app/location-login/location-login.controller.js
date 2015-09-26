(function () {
    "use strict";

    angular
        .module('app.location-login')
        .controller('locationLoginController', locationLoginController);


    function locationLoginController($scope, $http, $mdDialog) {

        $scope.login = function(username, password) {
            $http.post('api/locationaccount/auth', {
                username: username,
                password: password
            })
            .then(function(res) {
                if (res.data.success) {
                    toastr.success("You have logged in successfully!");
                    $mdDialog.hide(res.data);
                } else {
                    toastr.error("Incorrect username / password");
                }
            });
        };

        $scope.cancel = function() {
            $mdDialog.hide({
                success: false
            });
        }
    }

})();
