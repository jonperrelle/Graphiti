app.factory('DataFactory', function () {
  return {

    groupByCategory: function (values, seriesx, seriesy, type) {
      if(type === 'none') return values; 
     
      let groupedObj = {};  
      let groupedData = [];
      values.forEach(function (obj) {
          let newObj= {name: obj.name}
          obj.values.forEach(function(arr) {
              if (!groupedObj[arr[0]]) {
                  groupedObj[arr[0]] = [arr[1], 1];
                } else {
                  groupedObj[arr[0]][0] += arr[1];
                  groupedObj[arr[0]][1]++;
                }
          });
      
          newObj.values = Object.keys(groupedObj).map(key => {
            if (type === 'total') return [key, groupedObj[key][0]];
            else if (type === 'mean') return [key, groupedObj[key][0]/groupedObj[key][1]];
          });

          groupedData.push(newObj);

        });
      return groupedData;
    },

    orderByCategory: function (data, category, type, orderStyle = 'sort') {
      if (orderStyle === 'none') return data;
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
    },

    // withinLength: function(data, col, length){
    //     let repeatTable = {};
    //     data.forEach(function(elem){
    //       let currentData = elem[col];
    //       repeatTable[currentData] = repeatTable[currentData] || 0;
    //       repeatTable[currentData]++; 
    //     })
    //     if(Object.keys(repeatTable).length > length) return false;
    //     else return true; 
    // }
  };
});
