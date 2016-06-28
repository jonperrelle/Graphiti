app.factory('AddGraphFactory', function (ValidationFactory) {
   return {
          
            pieDisabled: function (col1, col2) {
              if ((col1 || col2) && (ValidationFactory.validateDateOrNumber(col1) || ValidationFactory.validateDateOrNumber(col2))) return false;
              else return true;
            },

            barOrPlotDisabled: function (col1, col2) {
              if (col1 && col2 && (ValidationFactory.validateDateOrNumber(col1) || ValidationFactory.validateDateOrNumber(col2))) return false;
              else return true;
            },

            lineDisabled: function (col1, col2) {
              if (col1 && col2 && (ValidationFactory.validateDateOrNumber(col1) && ValidationFactory.validateDateOrNumber(col2))) return false;
              else return true;
            }

   };
});