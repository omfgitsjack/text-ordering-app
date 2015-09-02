(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('adminController', adminController);

    function adminController($scope, $timeout, $mdSidenav, $mdUtil, $log, $state, ShopService,
                             metadataStore,
                             entitiesService,
                            entityManagerFactory) {

        $scope.toggleLeft = buildToggler('left');

        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 300);
            return debounceFn;
        }

        $scope.leftClose = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };

        $scope.goToOrders = function () {
            $state.go('admin.orders');
        };

        $scope.goToFoodMenu = function () {
            $state.go('admin.food');
        };

        $scope.goToDrinkMenu = function () {
            $state.go('admin.drinks');
        };

        $scope.changeStoreStatus = function () {
            // Dont do anything.
        };

        // Initialize ShopService
        ShopService
            .get()
            .success(function (item) {
                $scope.shop = {
                    is_open: item['is_open']
                };

                $scope.$watch('shop', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        ShopService
                            .update(newVal)
                            .success(function (res) {
                                toastr.success("You updated your shop's status");
                            });
                    }
                }, true)
            });

        /*var manager = entityManagerFactory.newManager();

        var q = breeze.EntityQuery
            .from("drinks")
            .using(manager)
            .execute()
            .then(function (res) {
                console.log('read worked');
                console.log(res);

                var newDrink = manager.createEntity('drink', {
                    "name": "new drink baby",
                    "description": "Quam reprehenderit aut tempore voluptatibus facilis voluptas fuga distinctio in eligendi et quia voluptatum nam iste facilis et optio non sit sit sit est corporis totam dolores non perferendis est qui unde eos omnis nostrum quidem autem quibusdam rerum re",
                    "price": 7.55,
                    "taxedprice": 8.5,
                    "image": "assets/food/7.JPG",
                    "calories": 172,
                    "protein": 15,
                    "fat": 381,
                    "carbs": 160,
                    "fiber": 115,
                    "ingredients": "Molestiae minus ipsa quia sed sint et voluptatem dicta ipsam est et rerum repellat soluta fuga voluptatem blanditiis dolorem vitae facilis omnis incidunt quod aut adipisci recusandae odio laudantium amet dolore quia numquam ab tenetur harum sint enim poss",
                    "spicy": 1,
                    "food_type": "drink"
                });

                var so = new breeze.SaveOptions({
                    resourceName: entitiesService.drinkEntity.defaultResourceName,
                    dataService: entityManagerFactory.dataService
                });
                manager.saveChanges(null, so, function (res) {
                        console.log('save worked');
                        console.log(res);
                        var m = res.entities[0].entityAspect.entityManager;
                        var q = breeze.EntityQuery.from('drinks');

                        console.log('local query');

                        var localItems = m.executeQueryLocally(q);
                        console.log(localItems);

                        console.log('editing...');

                        localItems[0].price = 99999;

                        m.saveChanges(null, so, function (res) {
                            console.log('put worked');
                            console.log(res);
                        })
                    },
                    function (res) {
                        console.log('fail');
                        console.log(res);
                    });
            }, function (res) {
                console.log('fail!');
                console.log(res);
            });

*/
    }

})();
