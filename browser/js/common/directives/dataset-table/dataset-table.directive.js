app.directive('datasetTable', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/dataset-table/dataset-table.directive.html',
        scope: {
            dataset: "=",
            rows: "=",
            columns: "=",
            tableParams: "=",
        },
        link: function (scope, ele, attrs) {
            scope.columns = scope.columns.filter(function (column) {
                return column !== '$$hashKey';
            });
        }
    };
});
