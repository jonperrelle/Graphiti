app.directive('datasetTable', function(Session) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/dataset-table/dataset-table.directive.html',
        scope: {
            dataset: "=",
            rows: "=",
            columns: "=",
            tableParams: "="
        },
        link: function(scope,ele,attr){
            scope.user = Session.user;
        }
    };
});