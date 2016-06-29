app.directive('datasetTable', function(Session,UserFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/dataset-table/dataset-table.directive.html',
        scope: {
            dataset: "=",
            rows: "=",
            columns: "=",
            tableParams: "=",
        },
        link: function(scope,ele,attr){
            scope.user = Session.user;
            scope.addDataset = function(){
                var domain;
                if(scope.dataset.metadata) domain = scope.dataset.metadata.domain;
                UserFactory.addDataset(scope.user,scope.dataset.resource, domain);
            }
        }
    };
});
