(function () {
    "use strict";

    angular
        .module('utilities.entitymanager')
        .factory('metadataStore', metadatastoreFactory);

    function metadatastoreFactory(breeze,
                                  laravelDataService,
                                  drinkEntity) {

        var helper = new breeze.config.MetadataHelper();
        var addTypeToStore = helper.addTypeToStore.bind(helper);

        var store = new breeze.MetadataStore({
            namingConvention: breeze.NamingConvention.none
        });

        store.addDataService(laravelDataService);

        // Add types below
        addTypeToStore(store, drinkEntity);

        return store;

    }
})();