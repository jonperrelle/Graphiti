app.config(function ($stateProvider) {
    $stateProvider.state('searchDatasets', {
        url: '/search-datasets',
        controller: 'SearchDatasetsCtrl',
        templateUrl: 'js/search-datasets/search-datasets.html'
    });
});






app.controller('SearchDatasetsCtrl', function($scope, QueryFactory, $state) {

    QueryFactory.getCategories().then(cats => {
        $scope.categories = cats.map(cat => cat.category.toUpperCase());
    });

    $scope.searchForDataset = function(query) {
        QueryFactory.searchForDataset(query)
        .then( datasets => $scope.datasets = datasets);
    };

    $scope.getDataset = function (dataset) {
        QueryFactory.getOneDataset(dataset)
        .then( rows => {
            $state.go('datasetDetails', {datasetId: dataset.resource.id, dataset: dataset, rows: rows});
        });
    };

    // $scope.getDatasets = function (cat) {
    //     QueryFactory.getDatasets(cat).then(dsets => {
    //         $scope.datasets = dsets;
    //     });
    // };

    // $scope.getColumns = function (ds) {
    //     $scope.columns = QueryFactory.getColumns(ds);
    // };

    // $scope.getData = function (ds, colArr) {
    //     QueryFactory.getData(ds, colArr)
    //     .then(function(data) {
    //         $scope.graphData = data.graphData;
    //         $scope.columns = data.columns;
    //     })
    // }
});
