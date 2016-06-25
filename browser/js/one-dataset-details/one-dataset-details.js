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

app.controller('DatasetDetailsCtrl', function ($scope, $stateParams) {
    console.log($stateParams.dataset)
    $scope.dataset = $stateParams.dataset;
    $scope.rows = $stateParams.rows;   
});

