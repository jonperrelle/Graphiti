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

    let setColor = function (color) {
        switch (colorScale) {
          case '10':
            return d3.scale.category10();
          case '20a':
            return d3.scale.category20();
          case '20b':
            return d3.scale.category20b();
          case '20c':
            return d3.scale.category20c();
          default: 
            return colorScale;
        }
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
            savedSettings.xAxisLabelSize = sets.xAxisLabelSize || 8;
            savedSettings.yAxisLabelSize = sets.yAxisLabelSize || 8;
            savedSettings.radius = sets.radius || savedSettings.height / 3;
            savedSettings.title = sets.title || (formatColX + " .vs " + formatColY).toUpperCase();
            savedSettings.titleSize = sets.titleSize || 14;
            savedSettings.color = setColor(sets.color) || d3.scale.category10(); 
            savedSettings.minX = (sets.minX || sets.minX === 0) ? sets.minX : getMin(d3, data, 0);
            savedSettings.maxX = (sets.maxX || sets.maxX === 0) ? sets.maxX : getMax(d3, data, 0);
            savedSettings.minY = (sets.minY || sets.minY === 0) ? sets.minY : getMin(d3, data, 1);
            savedSettings.maxY = (sets.maxY || sets.maxY === 0) ? sets.maxY : getMax(d3, data, 1);
            savedSettings.displayType = sets.displayType || 'number';
            savedSettings.groupType = sets.groupType || 'total';
            savedSettings.orderType = sets.orderType || 'sort';

            return savedSettings;
        });
	};
	return graphSettings;
});