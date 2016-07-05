app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('HomeCtrl', function($scope, QueryFactory, UploadFactory, $state, $uibModal) {

    $scope.uploadFile = function() {
      if ($scope.form.$valid && $scope.file) {
        
      }
    };

    $scope.openFileUpload = function () {

        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'upload.modal.html',
            controller: 'uploadModalInstanceCtrl',
            $scope: $scope,
            windowId: 'home'
        });

        modalInstance.result.then(function (file) {
            UploadFactory.uploadFile(file)
            .then(function(dataset) {
                $scope.file = null;
                $state.go('datasetDetails', {datasetId: dataset.fileName, dataset: dataset.dataset ,rows: dataset.data});
            })
        });   
    };

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


























