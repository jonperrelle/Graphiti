app.factory('UploadFactory', function ($http, Upload) {
   return {
      uploadFile: function (file) {
       return Upload.upload({
            url: 'api/upload',
            data: {file: file}
        })
        .then(function(response) {
          return response.data;
        });
      },

      getUploadedDataset: function (fileName) {
          return $http.get('/upload?fileName=' + fileName)
          .then(function(response) {
              return response.data;
          });
      }

   };
});