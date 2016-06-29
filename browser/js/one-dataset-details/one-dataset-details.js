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
    $scope.dataset = $stateParams.dataset.resource || $localStorage.dataset;
    $localStorage.dataset = $scope.dataset;
    $scope.rows = $stateParams.rows || $localStorage.rows;
    $localStorage.rows = $scope.rows;
    $scope.columns = Object.keys($localStorage.rows[0]);
    $scope.tableParams = new NgTableParams({count: 1}, {
        dataset: $localStorage.rows,
        counts: [1, 5, 10, 25, 100]
    }); 
});
