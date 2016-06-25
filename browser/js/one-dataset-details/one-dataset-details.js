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

app.controller('DatasetDetailsCtrl', function ($scope, $stateParams, NgTableParams) {
    $scope.dataset = $stateParams.dataset;
    $scope.rows = $stateParams.rows;
    $scope.columns = Object.keys($scope.rows[0]);
    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10
    }, {
        dataset: $scope.rows
    }); 
});
