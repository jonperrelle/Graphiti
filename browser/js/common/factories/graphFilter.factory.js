app.factory('GraphFilterFactory', function (d3Service) {
   
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
      else  {
          for (let k in obj) {
              obj[k] = obj[k].sort((a, b) => a[0].getTime() - b[0].getTime());
          }

      }
      return obj;
     };  

     graphFilter.filterData = function (seriesx, seriesy, data) {

        let formatDate;
        let dataObj = setDataObject(seriesy);
        return d3Service.d3().then(function(d3) {
          if (seriesx[0].type==='date') formatDate = setDateFormat(d3, data, seriesx);

          data.forEach(row => {
              for (let k in row) {
                if (dataObj[k]) {
                  if (row[seriesx[0].name] && row[k] && (!!Number(row[seriesx[0].name]) || Number(row[seriesx[0].name]) === 0 || seriesx[0].type === 'date')
                      && (!!Number(row[k]) || Number(row[k]) === 0)) {
                      if(formatDate)  dataObj[k].push([formatDate.parse(row[seriesx[0].name]), +row[k]]);
                      else dataObj[k].push([+row[seriesx[0].name], +row[k]]);
                                    }
                }
              }
          });

          dataObj = sortData(seriesx, dataObj);

          return d3.values(dataObj);
        });

     };

     return graphFilter;
});