(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('locationsController', locationsController);

    function locationsController($scope, LocationAccountService, $mdDialog) {

        $scope.locationAccountService = LocationAccountService;

        var me = this;

        me.init = function () {
            $scope.locationAccountService.get().then(function(res) {
                $scope.locations = res;
            })
        };

        $scope.edit = function (ev, item) {
            // Save ref to current item
            $scope.curItem = item;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/admin/editLocation.tmpl.html',
                parent: angular.element(document.body),
                locals: {
                    item: angular.copy(item)
                },
                targetEvent: ev,
            })
                .then(function (newItem) {
                    // Hardcoding the way we update the new item.
                    $scope.curItem.school = newItem.school;
                    $scope.curItem.pickupLocation = newItem.pickupLocation;
                    $scope.curItem.username = newItem.username;
                    $scope.curItem.password = newItem.password;

                    $scope.locationAccountService
                        .update($scope.curItem)
                        .then(function(res) {
                            toastr.success("Updated School");
                        });

                    $scope.curItem = null;
                }, function () {
                    $scope.curItem = null;
                    $scope.alert = 'You cancelled the dialog.';
                });

            function DialogController($scope, $mdDialog, item) {
                $scope.item = item;
                $scope.closeDialog = function (item) {
                    $mdDialog.hide(item);
                };
                $scope.cancelDialog = function () {
                    $mdDialog.cancel('canceled');
                };
            }
        };

        $scope.createNew = function () {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/admin/editLocation.tmpl.html',
                parent: angular.element(document.body),
                locals: {
                    item: {}
                }
            })
            .then(function (newItem) {
                // Hardcoding the way we update the new item.

                var loc = $scope.locationAccountService
                    .create(newItem)
                    .then(function(res) {
                        toastr.success("Created School");
                    });
                $scope.locations.push(newItem);
            }, function () {
                $scope.alert = 'You cancelled the dialog.';
            });

            function DialogController($scope, $mdDialog, item) {
                $scope.item = item;
                $scope.closeDialog = function (item) {
                    $mdDialog.hide(item);
                };
                $scope.cancelDialog = function () {
                    $mdDialog.cancel('canceled');
                };
            }
        };

        me.init();
    }


})();
