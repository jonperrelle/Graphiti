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
          let obj = {};
          obj[category] = key;
          obj[metric] = groupedObj[key];
          groupedData.push(obj);
        }
      }
      return groupedData;
    },

    orderByCategory: function (data, category, type) {
      if (type === 'number') {
        return data.sort(function (a, b) {
          return +a[category] - +b[category];
        });
      }
      else {
        return data.sort(function (a, b) {
          if (a[category] < b[category]) return -1;
          else return 1;
        });
      }
    }
  };
});