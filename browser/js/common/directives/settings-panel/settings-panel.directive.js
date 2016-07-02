app.directive('settingsPanel', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/settings-panel/settings-panel.directive.html',
		link: function(scope, element, attributes){
            $(function() {
                var cp2 = $('#cp2')
                cp2.colorpicker();
                cp2.on('changeColor', function(e){
					scope.settings.color = cp2.colorpicker('getValue');
					scope.$digest();
  				});
            });
		}
	};
});