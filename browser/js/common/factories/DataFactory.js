app.factory('DataFactory', function () {
  return {
    groupByCategory: function (data, category, metric) {
      let groupedObj = {},
          groupedData = [];
      data.forEach(function (datum) {
        if (!groupedObj[datum[category]]) {
          groupedObj[datum[category]] = +datum[metric];
        } else {
          groupedObj[datum[category]] += +datum[metric];
        }
      });
      for (let key in groupedObj) {
        if (groupedObj.hasOwnProperty(key)) {
          groupedData.push({
            groupedCategory: key,
            value: groupedObj[key]
          });
        }
      }
      console.log(groupedData);
      return groupedData;
    }
  };
});