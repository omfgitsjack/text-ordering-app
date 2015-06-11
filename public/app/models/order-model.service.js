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
                getYesterday: function() {
                    return $http.get('http://ucafe.jackyiu.me/api/orders/yesterday');
                },
                aggregateTransformer: function(items) {
                    var aggregate = [];
                    var me = this;

                    for (var i = 0; i < items.length; i++) {
                        var index = me.isInList(items[i].name, 'name', aggregate);
                        if (index !== false ) {
                            aggregate[index].quantity += items[i].quantity;
                        } else {
                            aggregate.push({
                                'name': items[i].name,
                                'quantity': items[i].quantity
                            });
                        }
                    }
                    return aggregate;
                },
                orderListTransformer: function(items) {
                    var me = this;
                    var list = [];

                    for (var i = 0; i < items.length; i++) {
                        var index = me.isInList(items[i].id, 'id', list);
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
                },
                isInList: function(propertyValue, identifyingProperty, list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i]) {
                            if (list[i][identifyingProperty] === propertyValue)
                                return i;
                        }
                    }
                    return false;
                }
            }
        });
})();