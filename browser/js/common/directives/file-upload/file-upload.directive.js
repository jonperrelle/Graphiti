// app.directive('fileUpload', function (UploadFactory) {
//    return {
//        restrict: 'A',
//        scope: {},
//        link: function (scope, element, attr) {

//            element.bind('change', function () {
//                var formData = new FormData();
//                formData.append('dataset', element[0].files[0]);
               
//                UploadFactory.uploadFile(formData);
//            });

//        }
//    };
// });

app.factory('UploadFactory', function ($http, Upload) {
   return {
      uploadFile: function (file) {
        Upload.upload({
            url: 'api/upload',
            data: {file: file}
        })
        .then(function(response) {
          console.log(response.data);
        });
      }
   };
});