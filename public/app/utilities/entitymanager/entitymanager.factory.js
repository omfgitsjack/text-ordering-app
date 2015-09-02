(function () {
    'use strict';

    angular
        .module('utilities.entitymanager')
        .factory('entityManagerFactory', entityManagerFactory);

    function entityManagerFactory(breeze,
                                  metadataStore,
                                  laravelDataService,
                                  entitiesService,
                                  API_ROOT) {

        var provider = {
            newManager: newManager,
            metadataStore: metadataStore,
            dataService: laravelDataService,
            entities: entitiesService
        };

        return provider;

        function newManager() {
            var mgr = new breeze.EntityManager({
                dataService: metadataStore.getDataService(API_ROOT),
                metadataStore: metadataStore
            });

            return mgr;
        }
    }
})();