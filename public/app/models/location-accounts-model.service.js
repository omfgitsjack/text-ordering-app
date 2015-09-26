(function () {
    "use strict";

    angular.module('app.models')
        .service('LocationAccountsService', function($http) {
            return {
                items: [],
                auth: function(username, password) {
                    var me = this;

                    return $http.post('api/locationaccount/auth', {
                        username:username,
                        password:password
                    })
                    .success(function(res) {
                        return res;
                    });
                }
            }
        });
})();
