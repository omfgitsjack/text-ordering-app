(function () {
    "use strict";

    angular
        .module('utilities.entitymanager')
        .factory('laravelDataService', laravelDataService);

    function laravelDataService(API_ROOT) {
        var apiRootRoute = API_ROOT;

        var jsonResultsAdapter = new breeze.JsonResultsAdapter({
            name: "laravelAdapter",
            extractResults: function (json) {
                return json.results;
            },
            visitNode: function (node, mappingContext, nodeContext) {

                var entityType = "";

                if (node.$type) {
                    entityType = node.$type;
                } else {
                    // It's a GET call
                    var queryResourceName = mappingContext.query.resourceName;
                    entityType = mappingContext.metadataStore.getEntityTypeNameForResourceName(queryResourceName);
                }

                return {
                    entityType: entityType,
                    nodeId: node.id
                };
            }
        });

        // Setup data service
        return new breeze.DataService({
            serviceName: apiRootRoute,
            hasServerMetadata: false,
            jsonResultsAdapter: jsonResultsAdapter
        });
    }
})();