(function () {
    "use strict";

    angular.module('app.models')
        .service('OrderService', function($http, DateTimeService) {
            return {
                getCurrent: function() {
                    return $http.get('api/orders/current')
                        .success(function(res) {
                            return res.map(function(el) {
                                var n = el;
                                n.updated_at = DateTimeService.parseUTC(el.updated_at);

                                return n;
                            })
                        });
                },
                makeOrder: function(phoneNumber, order) {
                  return $http.post('api/authenticate', {
                    phoneNumber: phoneNumber,
                    order: order
                  });
                },
                isLastOrder: function(time) {
                    // Last Order is defined by any order between 10:00 - 10:30
                    var start = DateTimeService.now()
                        .startOf('day')
                        .add(10, 'hours');

                    var deadline = DateTimeService.now()
                        .startOf('day')
                        .add(10, 'hours')
                        .add(30, 'minutes');

                    return time.isAfter(start, 'minute') &&
                            time.isBefore(deadline, 'minute');
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

                        items[i].lastOrder = this.isLastOrder(items[i].updated_at);

                        if (index !== false) {
                            list[index].totalprice += (items[i].quantity * items[i].taxedprice);
                            list[index].items.push({
                                name: items[i].name,
                                quantity: items[i].quantity,
                                lastOrder: items[i].lastOrder
                            });
                        } else {
                            list.push({
                                id: items[i].id,
                                phone: items[i].phone,
                                totalprice: items[i].quantity * items[i].taxedprice,
                                items: [{
                                    name: items[i].name,
                                    quantity: items[i].quantity,
                                    price: items[i].taxedprice * items[i].quantity,
                                    lastOrder: items[i].lastOrder
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
