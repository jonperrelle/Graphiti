app.factory('UploadFactory', function ($http, Upload) {
   return {
      uploadFile: function (file) {
        Upload.upload({
            url: 'api/upload',
            data: {file: file}
        })
        .then(function(response) {
          return response.data;
        });
      }
   };
});