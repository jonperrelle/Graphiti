app.factory("graphSettingsFactory", function(d3Service){
	
	let graphSettings = {}

	graphSettings.getSettings = function (settings) {
		return d3Service.d3().then(function(d3) {


		})
	}

	return graphSettings;
});