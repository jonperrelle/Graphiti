app.config (function ($stateProvider) {
  $stateProvider.state('singleGraph', {
    url: '/graph',
    controller: 'singleGraphCtrl',
    templateUrl: 'js/graph/singleGraph.html',
    params: {
    	graphType: null,
    	settings: null,
    	data: null,
    	columns: null
    }
  });
});

app.controller('singleGraphCtrl', function ($scope, $stateParams, $localStorage, GraphFactory) {
	$scope.graphType = $stateParams.graphType || $localStorage.graphType;
    $localStorage.graphType = $scope.graphType;
	$scope.data = $stateParams.data || $localStorage.data;
    $localStorage.data = $scope.data;
	$scope.columns = $stateParams.columns || $localStorage.columns;
    $localStorage.columns = $scope.columns;
	$scope.settings = $stateParams.settings || $localStorage.settings;
    $localStorage.settings = $scope.settings;


    $scope.saveUserGraph = function () {
        GraphFactory.saveUserGraph($scope.user, $scope.data, $scope.columns, $scope.graphType, $scope.settings)
            .then(function(data) {
                $scope.success = data.success;
                $scope.message = data.message;
                $scope.userGraph=true;
                $scope.addedGraph = true; 
                $timeout(function () {
                    $scope.addedGraph=false;
                }, 2000);
            })
            .catch();
    };
});
