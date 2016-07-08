app.directive('settingsPanel', function(ValidationFactory, GraphFilterFactory, $localStorage) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/settings-panel/settings-panel.directive.html',
        link: function(scope, element, attributes) {
            $(function() {
                var cp2 = $('#cp2');
                cp2.colorpicker();
                cp2.on('changeColor', function(e) {
                    scope.settings.color = cp2.colorpicker('getValue');
                    scope.$digest();
                });
            });
    
            scope.xColumns = scope.allColumns.filter(function(elem){
                if (scope.graphType === 'lineGraph') return elem.type === 'number' || elem.type === 'date';
                else if (scope.graphType === 'scatterPlot') return elem.type === 'number';
                else if (scope.graphType === 'pieChart' || scope.graphType === 'barChart') return elem.type === 'string';
            });
            scope.yColumns = scope.allColumns.filter(function(elem){
                return elem.type === 'number';
            });

            scope.downloadGraph = function() {
                saveSvgAsPng(document.querySelector('.graph-container svg'), 'sample.png');
            };

            scope.showGraphs = function () {  
                
                GraphFilterFactory.filterData(scope.seriesx, scope.seriesy, scope.data)
                .then(function(values) {
                    console.log(values)
                    scope.values = values;
                    scope.lineEnable = true;
                });
                
            };
        }
    };
});

