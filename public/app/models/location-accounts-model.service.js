(function () {
    "use strict";

    angular.module('app.models')
        .service('LocationAccountService', function($http) {
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
                },
                get: function() {
                    return $http.get('api/locationaccount')
                        .then(function(res) {
                            return res.data;
                        });
                },
                create: function(location) {
                    return $http.post('api/locationaccount', location);
                },
                update: function(location) {
                    return $http.put('api/locationaccount', location);
                }
            }
        });
})();
