(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('foodController', foodController);

    function foodController($scope, FoodService, $mdDialog) {

        var getFoodMenu = function() {
            FoodService.getAll()
                .success(function (res) {
                    $scope.food = res;

                    $scope.$watch('food', function(newVal, oldVal) {
                        if (newVal !== oldVal) {
                            FoodService
                                .update(newVal);
                            toastr.success('You have updated the menu!', 1000);
                        }
                    }, true);
                });
        };

        getFoodMenu();

        $scope.edit = function(ev, item) {
            // Save ref to current item
            $scope.curItem = item;

            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'app/admin/editFood.tmpl.html',
              parent: angular.element(document.body),
              locals: {
                item: angular.copy(item)
              },
              targetEvent: ev,
            })
            .then(function(newItem) {
                // Hardcoding the way we update the new item.
                $scope.curItem.name = newItem.name;
                $scope.curItem.description = newItem.description;
                $scope.curItem.ingredients = newItem.ingredients;
                $scope.curItem.spicy = newItem.spicy;
                $scope.curItem = null;
                console.log('You said the information was "' + newItem + '".');
            }, function() {
                $scope.curItem = null;
                $scope.alert = 'You cancelled the dialog.';
            });

            function DialogController($scope, $mdDialog, item) {
                $scope.item = item;
                console.log(item);
                $scope.closeDialog = function(item) {
                    $mdDialog.hide(item);
                }
                $scope.cancelDialog = function() {
                    $mdDialog.cancel('canceled');
                }
            }

            function _update(srcObj, destObj) {
              for (var key in destObj) {
                if(destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                  destObj[key] = srcObj[key];
                }
              }
            }
        };

    }

})();
