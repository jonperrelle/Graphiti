app.directive('addGraph', function(AddGraphFactory, ValidationFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/graphs/add-graph.directive.html',
        scope: {
            data: "=",
            info: "=",
            columns: "="
        },
        link: function(scope, ele, attrs) {

            scope.assignColumnType = function (col) {
                ValidationFactory.assignColumnType(scope.data, col);
            } 
        	
        	scope.pieDisabled = function () {
        		return AddGraphFactory.pieDisabled(scope.column1, scope.column2);
        	};

        	scope.barOrPlotDisabled = function () {
        		return AddGraphFactory.barOrPlotDisabled(scope.column1, scope.column2);
        	};

        	scope.lineDisabled = function () {
        		return AddGraphFactory.lineDisabled(scope.column1, scope.column2);
        	};
        }
    };
});



 