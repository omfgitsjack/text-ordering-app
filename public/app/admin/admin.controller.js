(function () {
    "use strict";

    angular
        .module('app.admin')
        .controller('adminController', adminController);

    function adminController($scope) {
        console.log('admin hit');
    }

})();