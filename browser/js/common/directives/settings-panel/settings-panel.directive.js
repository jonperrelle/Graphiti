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
                return elem.type === 'number' || elem.type === 'date';
            })
            scope.yColumns = scope.allColumns.filter(function(elem){
                return elem.type === 'number';
            })

            scope.fontSizes = [8, 10, 12, 14, 16, 20, 24, 32, 48];

            scope.downloadGraph = function() {
                saveSvgAsPng(document.querySelector('.graph-container svg'), 'sample.png');
            };

            scope.showGraphs = function () {  
                console.log(scope.settings)
                GraphFilterFactory.filterData(scope.seriesx, scope.seriesy, scope.data)
                .then(function(values) {
                    scope.values = values;
                    scope.lineEnable = true;
                    scope.scatterEnable = true;
                });
                
            };
        }
    };
});

