app.config(function ($stateProvider) {
    $stateProvider.state('datasetDetails', {
        url: '/datasetDetails/:datasetId',
        templateUrl: 'js/one-dataset-details/one-dataset-details.html',
        controller:"DatasetDetailsCtrl",
        params: {
            dataset: null,
            rows: null,
        }
    });
});

app.controller('DatasetDetailsCtrl', function ($scope, $stateParams, NgTableParams, $localStorage) {
    $localStorage.datasetId = $stateParams.datasetId || $localStorage.datasetId;
    $scope.dataset = $stateParams.dataset || $localStorage.dataset;
    $localStorage.dataset = $scope.dataset;
    $scope.rows = $stateParams.rows || $localStorage.rows;
    $localStorage.rows = $scope.rows;
    $scope.columns = Object.keys($localStorage.rows[0]);
    $scope.tableParams = new NgTableParams({}, {
        dataset: $localStorage.rows
    }); 
});
