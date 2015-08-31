(function () {
    'use strict';

    angular
        .module('utilities.entitymanager')
        .factory('entityManagerFactory', entityManagerFactory);

    function entityManagerFactory(breeze) {
        // Convert server-side PascalCase to client-side camelCase property names
        breeze.NamingConvention.camelCase.setAsDefault();
        // Do not validate when we attach a newly created entity to an EntityManager.
        // We could also set this per entityManager
        new breeze.ValidationOptions({validateOnAttach: false}).setAsDefault();

        var serviceRoot = window.location.protocol + '//' + window.location.host + '/';
        var serviceName = 'api/';
        var metadataStore = new breeze.MetadataStore();

        var provider = {
            metadataStore: metadataStore,
            newManager: newManager
        };

        return provider;

        function newManager(apiRoute) {
            var mgr = new breeze.EntityManager({
                serviceName: serviceName + apiRoute,
                metadataStore: metadataStore
            });
            return mgr;
        }
    }
})();