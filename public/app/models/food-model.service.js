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
                getAll: function() {
                    var me = this;

                    // change this back!
                    return $http.get('api/food/all')
                        .success(function(res) {
                            res = res.map(function(el) {
                                if (el.available === 1) {
                                    el.available = true;
                                } else {
                                    el.available = false;
                                }
                                if (el.spicy === 1) {
                                  el.spicy = true;
                                } else {
                                  el.available = false;
                                }
                                return el;
                            });

                            me.items = res;
                            return me.items;
                        });
                },
                update: function(foodItems) {
                    var items = foodItems.slice();
                    var me = this;
                    items = items.map(function(el) {

                        if (typeof el !== "number") {
                            if (el.available === true) {
                                el.available = 1;
                            } else if (el.available === false) {
                                el.available = 0;
                            }
                        }

                        return el;
                    });

                    $http.put('api/food',
                        {
                            foodList: items
                        });

                    foodItems = items.map(function(el) {
                        var temp = el;
                        if (temp.available === 1) {
                            temp.available = true;
                        } else {
                            temp.available = false;
                        }
                        return temp;
                    });

                    me.items = foodItems;
                    return me.items;
                }
            }
        });
})();
