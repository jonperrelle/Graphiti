app.config(function ($stateProvider) {
    $stateProvider.state('userDatasetDetails', {
        url: '/users/:userId/datasetDetails/:datasetId',
        templateUrl: 'js/user-dataset-details/user-dataset-details.html',
        controller:"UserDatasetDetailsCtrl",
        params: {
            dataset: null,
            rows: null,
        }
    });
});

app.controller('UserDatasetDetailsCtrl', function ($scope, $stateParams, NgTableParams, $localStorage) {
    $localStorage.datasetId = $stateParams.datasetId || $localStorage.datasetId;
    $scope.dataset = $stateParams.dataset || $localStorage.dataset;
    $localStorage.dataset = $scope.dataset;
    $scope.rows = $stateParams.rows || $localStorage.rows;
    $localStorage.rows = $scope.rows;
    $scope.columns = Object.keys($localStorage.rows[0]);
    $scope.tableParams = new NgTableParams({}, {
        dataset: $localStorage.rows
    }); 

    // need $scope.removeDataset
});