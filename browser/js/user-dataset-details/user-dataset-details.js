app.config(function ($stateProvider) {
    $stateProvider.state('userDatasetDetails', {
        url: '/users/:userId/datasetDetails/:datasetId',
        templateUrl: 'js/user-dataset-details/user-dataset-details.html',
        controller:"DatasetDetailsCtrl",
        params: {
            dataset: null,
            rows: null,
        }
    });
});
