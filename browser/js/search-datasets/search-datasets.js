app.config(function ($stateProvider) {
    $stateProvider.state('searchDatasets', {
        url: '/search-datasets',
        controller: 'SearchDatasetsCtrl',
        templateUrl: 'js/search-datasets/search-datasets.html'
    });

    $stateProvider.state('searchDatasets.query', {
        url: '/?query/:page',
        templateUrl: 'js/search-datasets/search-queried-datasets.html',
        controller: 'SearchQueriedDatasetsCtrl',
        params: {
            allDatasets: null
        }
    });
});

app.controller('SearchQueriedDatasetsCtrl', function($scope, QueryFactory, $state, $stateParams, $localStorage) {
    $scope.numDatasets = $localStorage.numDatasets;
    $scope.currentPage = $stateParams.page;
    $scope.allDatasets = $localStorage.datasets;
    if ($scope.allDatasets) {
        $scope.currentDatasets = $scope.allDatasets.filter( (ds, i) => {
            return  i >= (10 * ($scope.currentPage - 1)) && i < 10 * $scope.currentPage; 
        });
    }
    $scope.changePage = function () {
        $state.go('searchDatasets.query', {query: $stateParams.query, page: $scope.currentPage});
    };
    
    $scope.getDataset = function (dataset) {
        QueryFactory.getOneDataset(dataset)
        .then( rows => {
            $state.go('datasetDetails', {datasetId: dataset.resource.id, dataset: dataset, rows: rows});
        });
    };


});

app.controller('SearchDatasetsCtrl', function($scope, QueryFactory, $state, $localStorage) {

    QueryFactory.getCategories().then(cats => {
        $scope.categories = cats.map(cat => cat.category.toUpperCase());
    });

    $scope.searchForDataset = function(query) {
        QueryFactory.searchForDataset(query)
        .then( datasets => {
            $localStorage.datasets = datasets;
            $localStorage.numDatasets = $localStorage.datasets.length || 0;
            $state.go('searchDatasets.query', {query: query, page: 1});
        });
    };

    angular.element(document).on('keyup', function (e) {
        if (e.which === 13 && $scope.query) {
            $scope.searchForDataset($scope.query);
        }
    });
});
