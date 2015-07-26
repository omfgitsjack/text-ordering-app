(function () {
    "use strict";

    angular.module('app.models')
        .service('ShopService', function($http) {
            return {
                items: [],
                get: function() {
                    var me = this;

                    return $http.get('api/shop')
                        .success(function(res) {
                            res.is_open = res.is_open === 1 ? true : false;

                            return res;
                        });
                },
                update: function(shop) {
              			var o = {};
              			if (shop.is_open) {
              				o.is_open = 1;
              			} else {
              				o.is_open = 0;
              			}
                    return $http.put('api/shop',
                        {
                            shop: o
                        });
                }
            }
        });
})();
