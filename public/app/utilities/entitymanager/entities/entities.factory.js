(function () {
    "use strict";

    angular
        .module('utilities.entitymanager.entities')
        .factory('entitiesService', entitiesFactory);

    function entitiesFactory(drinkEntity) {

        var service = {
            drinkEntity: drinkEntity
        };

        return service;
    }
})();