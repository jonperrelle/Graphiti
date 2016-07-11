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


	// graphSettings.getDefaultSettings = function () {
	// 	let defaultSettings = {};
	// 	let yLabelLength = 2;
 //     let xLabelLength = 3;                
 //            defaultSettings.margin = { 
 //                top: 30,
 //                right: 20,
 //                bottom: (xLabelLength + 6) * 5,
 //                left: (yLabelLength + 6) * 7,
 //            };
 //        return defaultSettings;      
	// };


    let setColor = function (color) {
        switch (color) {
          case '10':
            return d3.scale.category10();
          case '20a':
            return d3.scale.category20();
          case '20b':
            return d3.scale.category20b();
          case '20c':
            return d3.scale.category20c();
          default: 
            return color;
        }
      };

	graphSettings.getSavedSettings = function (sets, ele, data, hist, tooMuchData) {

		return d3Service.d3().then(function(d3) {
			let formatColX = 'X Axis';
			let formatColY = 'Y Axis';
			let savedSettings = {};
            let yLabelLength = 2;
            let xLabelLength = 3;  
            savedSettings.height = sets.height || 500;
            savedSettings.xAxisLabel = sets.xAxisLabel || formatColX;
            savedSettings.xAxisTitleSize =  sets.xAxisTitleSize || 12;
            savedSettings.yAxisLabel = sets.yAxisLabel || formatColY;
            savedSettings.yAxisTitleSize =  sets.yAxisTitleSize || 12;
            savedSettings.title = sets.title || (formatColX + " .vs " + formatColY).toUpperCase();
            savedSettings.titleSize = sets.titleSize || 16;          
            savedSettings.margin = { 
                top: savedSettings.titleSize * 1.5,
                right: 20,
                bottom: (xLabelLength + 6) * 5 + Number(savedSettings.xAxisTitleSize), 
                left: (yLabelLength + 6) * 5 + Number(savedSettings.yAxisTitleSize)
            };
            savedSettings.width = sets.width || (tooMuchData ? savedSettings.margin.left + savedSettings.margin.right + data.length * 15 : ele.parentNode.offsetWidth);
            savedSettings.radius = sets.radius || savedSettings.height / 3;
            savedSettings.color = setColor(sets.color) || d3.scale.category10(); 
            if (hist !== 'histogram') {
                savedSettings.minX = (sets.minX || sets.minX === 0) ? sets.minX : getMin(d3, data, 0);
                savedSettings.maxX = (sets.maxX || sets.maxX === 0) ? sets.maxX : getMax(d3, data, 0);
                savedSettings.minY = (sets.minY || sets.minY === 0) ? sets.minY : getMin(d3, data, 1);
                savedSettings.maxY = (sets.maxY || sets.maxY === 0) ? sets.maxY : getMax(d3, data, 1);
            }
            savedSettings.display = sets.display || 'total';
            savedSettings.displayType = sets.displayType || 'number';
            savedSettings.groupType = sets.groupType || 'total';
            savedSettings.orderType = sets.orderType || 'sort';

            return savedSettings;
        });
	};
	return graphSettings;
});