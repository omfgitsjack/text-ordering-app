(function () {
    "use strict";

    angular.module('app.models')
        .service('OrderService', function($http) {
            return {
                todayItemAggregate: null,
                yesterdayItemAggregate: null,
                todayOrderList: [],
                yesterdayOrderList: [],
                getToday: function() {
                    return $http.get('http://ucafe.jackyiu.me/api/orders/today');
                },
                aggregateTransformer: function(items) {
                    var aggregate = {};
                    for (var i = 0; i < items.length; i++) {
                        if (aggregate[items[i].name]) {
                            aggregate[items[i].name] += items[i].quantity;
                        } else {
                            aggregate[items[i].name] = items[i].quantity;
                        }
                    }
                    return aggregate;
                },
                orderListTransformer: function(items) {
                    var list = [];

                    var isInList = function(id) {
                        for (var i = 0; i < list.length; i++) {
                            if (list[i]) {
                                if (list[i].id === id)
                                    return i;
                            }
                        }
                        return false;
                    };

                    for (var i = 0; i < items.length; i++) {
                        var index = isInList(items[i].id);
                        if (index !== false) {
                            list[index].items.push({
                                name: items[i].name,
                                quantity: items[i].quantity
                            });
                        } else {
                            list.push({
                                id: items[i].id,
                                phone: items[i].phone,
                                items: [{
                                    name: items[i].name,
                                    quantity: items[i].quantity
                                }]
                            });
                        }
                    }

                    return list;
                }
            }
        });
})();