(function () {
    "use strict";

    angular.module('app.models')
        .service('DrinkService', function (breeze, entityManagerFactory) {
            var manager = entityManagerFactory.newManager();

            return {
                items: getCurrentItems,
                get: function () {
                    return breeze.EntityQuery
                        .from("drinks")
                        .withParameters({ available: true })
                        .using(manager)
                        .execute()
                },
                getAll: function () {
                    return manager.executeQuery(breeze.EntityQuery
                        .from("drinks"))
                        .then(function(res) {
                            return res.entities;
                        });
                },
                update: function (foodItems) {

                }
            };

            function getCurrentItems()
            {
                return drinks.executeQueryLocally(breeze.EntityQuery.from('drinks'));
            }
        });
})();
