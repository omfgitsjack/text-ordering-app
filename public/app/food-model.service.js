(function () {
    "use strict";

    angular.module('app.main')
        .service('FoodService', function($http) {
            return {
                items: [],
                get: function() {
                    var me = this;

                    return $http.get('api/food')
                        .success(function(res) {
                            me.items = res;
                            return me.items;
                        });
                }
            }
        });
})();