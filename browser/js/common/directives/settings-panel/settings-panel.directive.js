app.directive('settingsPanel', function(ValidationFactory, $localStorage){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/settings-panel/settings-panel.directive.html',
		link: function(scope, element, attributes){
            $(function() {
                var cp2 = $('#cp2');
                cp2.colorpicker();
                cp2.on('changeColor', function(e){
					scope.settings.color = cp2.colorpicker('getValue');
					scope.$digest();
  				});
            });

            scope.assignColumnType = function (col) {
                ValidationFactory.assignColumnType(scope.data, col);
                $localStorage.column1 = scope.column1;
                $localStorage.column2 = scope.column2;
            }; 

            scope.downloadGraph = function () {
            	saveSvgAsPng(document.querySelector('.graph-container svg'), 'sample.png');
            };
        }
	};
});