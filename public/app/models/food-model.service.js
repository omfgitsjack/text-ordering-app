(function () {
    "use strict";

    angular.module('app.models')
        .service('FoodService', function($http) {
            return {
                items: [],
                get: function() {
                    var me = this;

                    return $http.get('http://ucafe.jackyiu.me/api/food')
                        .success(function(res) {
                            me.items = res;
                            return me.items;
                        });
                }
            }
        });
})();