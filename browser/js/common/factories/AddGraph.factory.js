app.factory('AddGraphFactory', function (ValidationFactory) {
   return {
            pieEnabled: function(col1, col2){
              return col1 && col2 && (col1.type === 'number' || col2.type === 'number');
            },

            barEnabled: function(col1, col2){
              return col1 && col2 && (col1.type === 'number' || col2.type === 'number');
            },

            scatterEnabled: function(col1, col2){
              return col1 && col2 && col1.type === 'number' && col2.type === 'number';
            },

            lineEnabled: function(col1, col2){
              return col1 && col2 && ((col1.type === 'number' || col1.type === 'date') && col2.type === 'number');
            }
   };
});