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
            scope.assignedColumns = ValidationFactory.assignColumnNameAndType(scope.data, scope.columns);
            
            scope.counter = function () {
                scope.count++;
            };
        
            scope.showGraphs = function () {  
                
                GraphFilterFactory.filterData(scope.seriesx, scope.seriesy, scope.data)
                .then(function(values) {
                    scope.values = values;
                    scope.withinLength = true;
                    if (scope.seriesx[0].type === 'date' && scope.seriesy[0].type === 'number' ) {
                            scope.lineEnable = true;
                            scope.pieEnable = false;
                            scope.scatterEnable = false;
                            GraphFilterFactory.filterBarData(scope.seriesx, scope.seriesy, scope.data)
                            .then(function(barValues) {
                                scope.barvalues = barValues;
                                scope.barEnable = true;
                            });

                        }
                    else if (scope.seriesx[0].type === 'number' && scope.seriesy[0].type === 'number' ) {
                            scope.scatterEnable = true;
                            scope.lineEnable = true;
                            GraphFilterFactory.filterBarData(scope.seriesx, scope.seriesy, scope.data)
                            .then(function(barValues) {
                                scope.barvalues = barValues;
                                scope.barEnable = true;
                            });

                    }

                    else if (scope.seriesx[0].type === 'string' && scope.seriesy[0].type === 'number' ) {
                            scope.pieEnable = true;
                            scope.scatterEnable = false;
                            scope.lineEnable = false;
                            GraphFilterFactory.filterBarData(scope.seriesx, scope.seriesy, scope.data)
                            .then(function(barValues) {
                                scope.barvalues = barValues;
                                scope.barEnable = true;
                            });
                            let groupedData = DataFactory.groupByCategory(values, scope.seriesx, scope.seriesy, 'total');
                            if (groupedData[0].length > 30) scope.withinLength = false;
                           // scope.barEnabled = true
                    }
                });
                
            };

            scope.viewSingleGraph = function (graphType) {
                $state.go('singleGraph', {graphType, data: scope.data, 
                    values: scope.values, 
                    seriesx: scope.seriesx, 
                    seriesy: scope.seriesy, 
                    settings: scope.settings, 
                    allColumns: scope.assignedColumns});
            };

        }
    };
});



 
