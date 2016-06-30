app.factory('GraphSettingsFactory', function () {
	let settings;
   	return {
   		getPreviewSettings: function(){
   			settings.width = null;
   			settings.height = null; 
		}
   	}
});