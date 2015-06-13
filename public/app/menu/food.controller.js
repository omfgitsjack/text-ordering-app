(function () {
    "use strict";

    var ns = 'app.menu';

    angular
        .module(ns, [
            'app.models'
        ])
        .controller('foodController', foodController);

    function foodController($scope) {
        $scope.isCollapsed = true;
    }

})();
