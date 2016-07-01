app.directive('datasetDetails', function(Session,DatasetFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/dataset-details/dataset-details.directive.html',
        scope: {
            dataset: "=",
            rows: "=",
            columns: "=",
            tableParams: "=",
        },
        link: function(scope, elem, attr) {

            if (Session.user) scope.user = Session.user;
            scope.addDataset = function() {
                var domain;
                if (scope.dataset.metadata) domain = scope.dataset.metadata.domain;
                DatasetFactory.addDataset(scope.user, scope.dataset.resource, domain)
                    .then(function() {
                        scope.datasetAdd = true;
                    });
            };
        },

    }
})