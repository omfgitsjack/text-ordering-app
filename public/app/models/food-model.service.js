(function () {
    "use strict";

    angular.module('app.models')
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
                },
                update: function(foodItems) {
                    foodItems = foodItems.map(function(el) {
                        if (el.available === true) {
                            el.available = 1;
                        }
                        if (el.available === false) {
                            el.available = 0;
                        }
                    });

                    $http.put('api/food', foodItems);
                }
            }
        });
})();