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
    let loadPage = Math.ceil(Math.random() * 2);
    switch (loadPage){
        case 1:
            $scope.headType = 0; 
            $scope.headRows = [{name: 'Graphing', data: 30}, {name: 'Relaxing', data: 600}]
            $scope.headColumns = [{name: 'name'}, {name: 'data'}]
            $scope.headSettings = {height: 400,
            title: 'Build Custom Graphs Fast', 
            xAxisLabel: 'Software', 
            yAxisLabel: 'Time Spent (s)',
            xAxisLabelSize: 12, 
            yAxisLabelSize: 12, 
            titleSize: 20}
            break;
        case 2:
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
            $scope.headSettings = {height: 400,
            title: 'Build Custom Graphs Fast', 
            xAxisLabel: 'Letters of an Awesome Application', 
            yAxisLabel: 'Frequency of Letter in English Language (%)', 
            minY: 0, 
            maxY: 20, 
            xAxisLabelSize: 12, 
            yAxisLabelSize: 12, 
            titleSize: 20, 
            orderType: 'none', 
            groupType: 'none'};
            break;
    }
});
