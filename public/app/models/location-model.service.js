(function () {
    "use strict";

    angular.module('app.models')
        .service('LocationService', function($http) {
            return {
                items: [],
                get: function() {
                    var me = this;

                    return $http.get('api/location')
                        .success(function(res) {
                            me.items = res;
                            return me.items;
                        });
                }
            }
        });
})();
