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
    let loadPage = Math.ceil(Math.random() * 3);
    switch (loadPage){
        case 1:
            $scope.headType = 0; 
            $scope.headRows = [{name: 'Graphing', data: 30}, {name: 'Relaxing', data: 600}]
            $scope.headColumns = [{name: 'name'}, {name: 'data'}]
            $scope.headSettings = {title: 'Graphiti: Build Graphs Faster.', height: 400, xAxisLabel: 'Software', yAxisLabel: 'Time Spent (s)'}
            break;
        case 2:
            $scope.headType = 1;
            $scope.headRows = [{name: 'Some', data: 10}, 
            {name: 'Of', data: 42}, 
            {name: 'The', data: 60}, 
            {name: 'Cool', data: 88}, 
            {name: 'Graphs', data: 33}, 
            {name: 'You', data: 50}, 
            {name: 'Can', data: 10}, 
            {name: 'Build', data: 90}, 
            {name: 'With', data: 40}, 
            {name: 'Graphiti', data: 200}]
            $scope.headColumns = [{name: 'name'}, {name: 'data'}]
            $scope.headSettings = {title: 'GRAPHITI', height: 400, xAxisLabel: 'Activities', yAxisLabel: 'Hours in Day'};
            break;
        case 3:
            $scope.headType = 0;
            $scope.headRows = [{name: 'G', data: 2.015}, 
            {name: 'R', data: 5.987}, 
            {name: 'A', data: 8.167}, 
            {name: 'P', data: 1.929}, 
            {name: 'H', data: 6.094}, 
            {name: 'I', data: 6.966}, 
            {name: 'T', data: 9.056}, 
            {name: 'I', data: 6.966}]
            $scope.headColumns = [{name: 'name'}, {name: 'data'}]
            $scope.headSettings = {title: 'Build Graphs Faster.', height: 400, xAxisLabel: 'Letters of an Awesome Application', yAxisLabel: 'Frequency of Letter in English Language (%)', minY: 0, maxY: 20};
            break;
    }
    // $scope.defaultColumns =
});