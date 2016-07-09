app.factory('GraphFilterFactory', function (d3Service, graphSettingsFactory) {
   
    let graphFilter = {};
  
    let setDateFormat = function (d3, data, seriesx) {
         
          let commonDateFormats = ["%Y", "%Y-%y", "%x", "%m-%d-%Y", "%m.%d.%Y", "%m/%d/%y", "%m-%d-%y", "%m.%d.%y", "%Y/%m/%d", "%Y-%m-%d", "%Y.%m.%d", "%xT%X", "%m-%d-%YT%X", "%m.%d.%YT%X", "%m/%d/%yT%X", "%m-%d-%yT%X", "%m.%d.%yT%X", "%Y-%m-%dT%X", "%Y/%m/%dT%X", "%Y.%m.%dT%X", "%c"];
          let dateFormat = commonDateFormats.filter(f => d3.time.format(f).parse(data[0][seriesx[0].name]))[0];
          return d3.time.format(dateFormat); 
     };        

     let setDataObject = function (seriesy) {
        let obj = {};
        seriesy.forEach (s => {
          obj[s.name] = [];
        });
        return obj;
     };

     let sortData = function (seriesx, obj) {
      if(seriesx[0].type === 'number'){
          for (let k in obj) {
              obj[k] = obj[k].sort((a, b) => a[0] - b[0]);
          }
      } 
      else if (seriesx[0].type === 'date') {
          for (let k in obj) {
              obj[k] = obj[k].sort((a, b) => a[0].getTime() - b[0].getTime());
          }
      }
      else {
        for (let k in obj) {
            obj[k] = obj[k].sort((a, b) => {
              if (a[0] < b[0]) return -1;
              else return 1;
            });
        }
      }
      return obj;
     };  

    let sortBarData = function (seriesx, obj) {
      let sortArr = [];
      let newObj = {};
      if(seriesx[0].type === 'number'){
          for (let k in obj) {
            sortArr.push([k, obj[k]]);
            sortArr.sort((a, b) => a[0] - b[0]);
          }
          sortArr.forEach( arr => {
            newObj[arr[0]] = arr[1];
          });
      } 
      else {
          for (let k in obj) {
            sortArr.push([k, obj[k]])
            sortArr.sort((a, b) => {
              if (a[0] < b[0]) return -1;
              else return 1;
            });
          }
          
          sortArr.forEach( arr => {
            newObj[arr[0]] = arr[1];
          });
      }
      return newObj;
     }; 

     let groupBarData = function(filteredData) {
        let groupedData ={};
        for (var k in filteredData) {
          let groupedObj = {};
          filteredData[k].forEach(arr => {
            if (!groupedObj[arr[0]]) {
              groupedObj[arr[0]] = [arr[1], 1];
            } else {
              groupedObj[arr[0]][0] += arr[1];
              groupedObj[arr[0]][1]++;
            }
          groupedData[k] = Object.keys(groupedObj).map(key => {
            return [key, groupedObj[key][0], groupedObj[key][1]];  
          });
        });
       }  
       return groupedData;
    };

     graphFilter.filterBarData = function(seriesx, seriesy, data) {
        let xVal= seriesx[0].name;
        let formatDate;
        return d3Service.d3().then(function(d3) {
          let filteredArr = seriesy.map(obj => obj.name);
          let filteredData = {};
          data.forEach(row => {
              let newRow = {};
              for (let k in row) {
                  if (seriesx[0].type === 'number') {
                    if (filteredArr.indexOf(k) > -1 && row[xVal] && (!!Number(row[xVal]) || Number(row[xVal]) === 0)
                      && row[k] && (!!Number(row[k]) || Number(row[k]) === 0)) {
                          if (!filteredData[+row[xVal]]) filteredData[+row[xVal]] = [];
                          filteredData[+row[xVal]].push([k, +row[k]]);
                    }
                  }
                  else {
                    if (filteredArr.indexOf(k) > -1 && row[xVal]
                      && row[k] && (!!Number(row[k]) || Number(row[k]) === 0)) {
                          if (!filteredData[row[xVal]]) filteredData[row[xVal]] = [];
                          filteredData[row[xVal]].push([k, +row[k]]);
                      }     
                    }
                  }

              });
          
          filteredData = sortBarData(seriesx, filteredData);
          filteredData = groupBarData(filteredData);
          let values = []
          for (let k in filteredData) {
            values.push( {
              name: k,
              values: filteredData[k]
            });
          }
          return values;

        });
     };

     graphFilter.filterData = function (seriesx, seriesy, data) {
      
        let formatDate;
        let dataObj = setDataObject(seriesy);
        return d3Service.d3().then(function(d3) {
          if (seriesx[0].type ==='date') formatDate = setDateFormat(d3, data, seriesx);

          data.forEach(row => {
              for (let k in row) {
                if (dataObj[k] && seriesx[0].type === 'number') {
                  if (row[seriesx[0].name] && row[k] && (!!Number(row[seriesx[0].name]) || Number(row[seriesx[0].name]) === 0) 
                      && (!!Number(row[k]) || Number(row[k]) === 0)) {
                      dataObj[k].push([+row[seriesx[0].name], +row[k]]);
                    }
                }
                else if (dataObj[k]) {
                  if (row[seriesx[0].name] && row[k] && (!!Number(row[k]) || Number(row[k]) === 0)) {
                      if(formatDate)  dataObj[k].push([formatDate.parse(row[seriesx[0].name]), +row[k]]);
                      else dataObj[k].push([row[seriesx[0].name], +row[k]]);
                    
                  }
                }
              }
          });

          dataObj = sortData(seriesx, dataObj);
          let count = 0;
          let values = d3.values(dataObj).map(arr => {      
          let obj = {
                name: seriesy[count++].name.replace(/\_/g, " "), 
                values: arr
              }
              return obj;
          });
          return values;
        });

     };

     graphFilter.setBounds = function(settings, values){
         return values.map(obj => {

            obj.values = obj.values.filter(arr => {
                return (arr[0] >= settings.minX 
                 && arr[0] <= settings.maxX
                 && arr[1] >= settings.minY
                 && arr[1] <= settings.maxY)
               })
             return obj;
           })
      
    };

    return graphFilter;
});