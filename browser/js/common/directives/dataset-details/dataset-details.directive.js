app.directive('datasetDetails', function(Session,DatasetFactory,$state,$timeout) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/dataset-details/dataset-details.directive.html',
        scope: {
            dataset: "=",
            rows: "=",
            columns: "=",
            tableParams: "=",
        },
    };
});