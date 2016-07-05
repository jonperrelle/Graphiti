app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('HomeCtrl', function($scope, QueryFactory, UploadFactory, $state, $uibModal) {

    QueryFactory.getCategories().then(cats => {
        $scope.categories = cats.map(cat => cat.category.toUpperCase());
    });

    $scope.getDatasets = function (cat) {
        QueryFactory.getDatasets(cat).then(dsets => {
            $scope.datasets = dsets;
        });
    };

    $scope.getColumns = function (ds) {
        $scope.columns = QueryFactory.getColumns(ds);
    };

    $scope.getData = function (ds, colArr) {
        QueryFactory.getData(ds, colArr)
        .then(function(data) {
            $scope.graphData = data.graphData;
            $scope.columns = data.columns;
        });
    };
});


























>>>>>>> master
