app.factory('ValidationFactory', function () {
   return {
          
            validateNumber: function(data, col) {
              if (col) {
                for (let i=0; i < data.length && i < 10; i++) {
                    if (!isNaN(data[i][col.name])) return true;
                }
              }
              return false;
            },

            validateDate: function(col) {
              let column;
              let possibleDateColumns = ['year', 'date', 'time', 'occurred'];
              if (col) {
                column = col.name.toLowerCase();
                return possibleDateColumns.filter( item => new RegExp(item).test(column)).length > 0;
              }
            },
            
            assignColumnType: function (data, col) {
              if (this.validateDate(col)) {
                col.type = 'date';
                return true;
              }
              else if (this.validateNumber(data, col)) {
                col.type = 'number';
                return true;
              }
              else {
                col.type = "string";
                return false;
              }
              
            },

            validateDateOrNumber: function(col) {
              if (col) return (col.type === 'number' || col.type === 'date');
              return false;
            },

   };
});

