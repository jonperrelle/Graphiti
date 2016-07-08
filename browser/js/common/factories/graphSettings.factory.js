app.factory("graphSettingsFactory", function(d3Service){
	
	let graphSettings = {};

	graphSettings.getDefaultSettings = function () {
		
		let defaultSettings = {};
		let yLabelLength = 2;
        let xLabelLength = 3;                
            defaultSettings.margin = { 
                top: 30,
                right: 20,
                bottom: (xLabelLength + 6) * 5,
                left: (yLabelLength + 6) * 7,
            };
        return defaultSettings;      
	};

	graphSettings.getSavedSettings = function (sets, ele, data) {
		return d3Service.d3().then(function(d3) {
			let formatColX = 'X Axis';
			let formatColY = 'Y Axis';
			let savedSettings = {};
			savedSettings.width = sets.width || ele.parentNode.offsetWidth;
            savedSettings.height = sets.height || 500;
            savedSettings.xAxisLabel = sets.xAxisLabel || formatColX;
            savedSettings.yAxisLabel = sets.yAxisLabel || formatColY;
            savedSettings.title = sets.title || (formatColX + " .vs " + formatColY).toUpperCase();
            savedSettings.color = sets.color || d3.scale.category10();

            // ifscope.rows.forEach(function (arr) {
                        
            //             let tempMin = d3.min(arr, function(d) {return d[0]});
            //             let tempMax = d3.max(arr, function(d) {return d[0]});

            //             if(tempMin < minX || typeof minX === 'undefined') minX = tempMin;
            //             if(tempMax > maxX || typeof maxX === 'undefined') maxX = tempMax;
            //         });
            //         scope.rows.forEach(function (arr) {
            //             let tempMin = d3.min(arr, function(d) {return d[1]});
            //             let tempMax = d3.max(arr, function(d) {return d[1]});
            //             if(tempMin < minY || typeof minY === 'undefined') minY = tempMin;
            //             if(tempMax > maxY || typeof maxY === 'undefined') maxY = tempMax;
            //         });








            return savedSettings;
        });
	};

	return graphSettings;
});