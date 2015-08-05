(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('drinksController', drinksController);

    function drinksController($scope, FoodService, $mdDialog) {
        console.log('drinks menu');
    }

})();