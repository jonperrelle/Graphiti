app.directive('addGraph', function($rootScope, AddGraphFactory, ValidationFactory, DataFactory, GraphFilterFactory, $state, $localStorage) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/graphs/add-graph.directive.html',
        scope: {
            data: "=",
            info: "=",
            columns: "="
        },
        link: function(scope, ele, attrs) {
            scope.seriesx = [];
            scope.seriesy = [];
            scope.settings = {};
            scope.count = 0;
            // scope.column1 = $localStorage.column1;
            // scope.column2 = $localStorage.column2;
            
            scope.assignColumnType = function (col) {
                ValidationFactory.assignColumnType(scope.data, col);
                
                // $localStorage.column1 = scope.column1;
                // $localStorage.column2 = scope.column2;
            }; 

            scope.counter = function () {
                scope.count++;
            };
        	
            // scope.pieEnabled = function(){
            //     return AddGraphFactory.pieEnabled(scope.data, scope.column1, scope.column2);
            // };

            // scope.barEnabled = function(){
            //     return AddGraphFactory.barEnabled(scope.data, scope.column1, scope.column2);
            // };

            // scope.scatterEnabled = function(){
            //     return AddGraphFactory.scatterEnabled(scope.column1, scope.column2);
            // };

            scope.lineEnabled = function(){
                
                return AddGraphFactory.lineEnabled(scope.seriesx[0], scope.seriesy[0]);
            };

            scope.showGraphs = function () {  
                GraphFilterFactory.filterData(scope.seriesx, scope.seriesy, scope.data)
                .then(function(values) {
                    scope.values = values;
                    scope.lineEnable = true;
                });
                
            };

            scope.viewSingleGraph = function (graphType) {
                $state.go('singleGraph', {graphType, data: scope.values, seriesx: scope.seriesx, seriesy: scope.seriesy, settings: scope.settings, allColumns: scope.columns});
            };

            scope.withinLength = function(){
                let groupedData = DataFactory.groupByCategory(scope.data, scope.column1.name, scope.column2.name, 'total');
                return DataFactory.withinLength(groupedData, scope.column1.name, 30);
            };

        }
    };
});



 
