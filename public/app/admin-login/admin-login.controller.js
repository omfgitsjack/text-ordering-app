(function () {
    "use strict";

    angular
        .module('app.admin-login')
        .controller('adminLoginController', adminLoginController);

    function adminLoginController($scope, $http, $mdDialog, store) {

        $scope.login = function(password) {
          $http.post('api/login', {
            password: password
          })
          .then(function(res) {
            if (res.data === 'OK') {
              store.set('loggedIn', true);
              toastr.success('You have successfully logged in.');
              $mdDialog.hide(true);
            } else {
              toastr.error('Sorry your password is incorrect. Please try again.');
            }
          });
        }
    }

})();
