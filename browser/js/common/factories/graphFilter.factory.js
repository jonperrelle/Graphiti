app.factory('GraphFilterFactory', function (d3Service) {
   
                    
   d3Service.d3().then(function(d3) {
    
   let graphFilter = {};
   let formatDate, dateFormat;
  
     graphFilter.setDateFormat = function (seriesx) {
        if (seriesx[0].type === 'date') {
            let commonDateFormats = ["%Y", "%Y-%y", "%x", "%m-%d-%Y", "%m.%d.%Y", "%m/%d/%y", "%m-%d-%y", "%m.%d.%y", "%Y/%m/%d", "%Y-%m-%d", "%Y.%m.%d", "%xT%X", "%m-%d-%YT%X", "%m.%d.%YT%X", "%m/%d/%yT%X", "%m-%d-%yT%X", "%m.%d.%yT%X", "%Y-%m-%dT%X", "%Y/%m/%dT%X", "%Y.%m.%dT%X", "%c"];
            dateFormat = commonDateFormats.filter(f => d3.time.format(f).parse(scope.rows[0][scope.seriesx[0].name]))[0];
            formatDate = d3.time.format(dateFormat); //d3.time.format("%Y-%y");
        }
     }        

     graphFilter.setDataObject = function (series) {
        let dataObj = {};
        series.forEach (s => {
          dataObj[s.name];
        });
        return dataObj;
     }                 
     graphFilter.filterData = function (seriesx, data, dataObj) {
        data.forEach(row => {
            for (let k in row) {
              if (dataObj[k]) {
                if (row[seriesx[0].name] && row[k] && (!!Number(row[seriesx[0].name]) || Number(row[seriesx[0].name]) === 0 || seriesx[0].type === 'date')
                    && (!!Number(row[k]) || Number(row[k]) === 0)) {
                    if(formatDate)  dataObj[k].push([formatDate.parse(row[scope.seriesx[0].name]), +row[k]]);
                    else dataObj[k].push([+row[scope.seriesx[0].name], +row[k]]);
                                  }
              }
            }
        })

     }
   })

   
   return graphFilter;
});