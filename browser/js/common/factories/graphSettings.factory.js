app.factory("graphSettingsFactory", function(d3Service){
	
	let graphSettings = {};

	let getMin = function (d3, data, idx) {
		let min, tempMin;
		data.forEach(function (obj) {
            tempMin = d3.min(obj.values, function(d) {
            	return d[idx]
            });
            if(tempMin < min || typeof min === 'undefined') min = tempMin;
        });
        return min;
	};

	let getMax = function (d3, data, idx) {
		let max, tempMax;
		data.forEach(function (obj) {
            tempMax = d3.max(obj.values, function(d) {return d[idx]});
            if(tempMax > max || typeof max === 'undefined') max = tempMax;   
        });
        return max;
	};

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
            savedSettings.minX = sets.minX || getMin(d3, data, 0);
            savedSettings.maxX = sets.maxX || getMax(d3, data, 0);
            savedSettings.minY = sets.minY || getMin(d3, data, 1);
            savedSettings.maxY = sets.maxY || getMax(d3, data, 1);

            return savedSettings;
        });
	};
	return graphSettings;
});