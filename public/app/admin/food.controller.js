(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('foodController', foodController);

    function foodController() {
        console.log('food');
    }

})();