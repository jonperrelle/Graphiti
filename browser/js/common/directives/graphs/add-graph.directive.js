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
        	
            // scope.pieEnabled = function(){
            //     return AddGraphFactory.pieEnabled(scope.data, scope.column1, scope.column2);
            // };

            // scope.barEnabled = function(){
            //     return AddGraphFactory.barEnabled(scope.data, scope.column1, scope.column2);
            // };

            // scope.scatterEnabled = function(){
            //     return AddGraphFactory.scatterEnabled(scope.seriesx[0], scope.seriesy[0]);
            // };

            // scope.lineEnabled = function(){
                
            //     return AddGraphFactory.lineEnabled(scope.seriesx[0], scope.seriesy[0]);
            // };

            scope.showGraphs = function () {  
                
                GraphFilterFactory.filterData(scope.seriesx, scope.seriesy, scope.data)
                .then(function(values) {

                    scope.values = values;
                    scope.withinLength = true;
                   
                    if ((scope.seriesx[0].type === 'date') && scope.seriesy[0].type === 'number' ) {
                            scope.lineEnable = true;

                        }
                    else if (scope.seriesx[0].type === 'number' && scope.seriesy[0].type === 'number' ) {
                            scope.scatterEnable = true;
                            scope.lineEnable = true; 
                    }

                    else if (scope.seriesx[0].type === 'string' && scope.seriesy[0].type === 'number' ) {
                            scope.pieEnable = true;
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

            // scope.withinLength = function(){
            //     let groupedData = DataFactory.groupByCategory(scope.data, scope.column1.name, scope.column2.name, 'total');
            //     return DataFactory.withinLength(groupedData, scope.column1.name, 30);
            // };

        }
    };
});



 
