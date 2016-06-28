app.config(function ($stateProvider) {
    $stateProvider.state('uploadedDataset', {
        url: '/uploadedDataset/:fileName',
        templateUrl: 'js/uploaded-dataset/uploaded-dataset.html',
        controller:"UploadedDatasetCtrl",
        params: {
            dataset: null
        }
    });
});

app.controller('UploadedDatasetCtrl', function ($scope, $stateParams, NgTableParams, $localStorage) {
    $scope.fileName = $stateParams.fileName;
    $scope.rows = $stateParams.dataset;
    $scope.rows = $stateParams.dataset || $localStorage.rows;
    $localStorage.rows = $scope.rows;
    $scope.columns = Object.keys($localStorage.rows[0]);
    $scope.tableParams = new NgTableParams({}, {
        dataset: $localStorage.rows
    }); 
});
