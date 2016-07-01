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

app.controller('singleGraphCtrl', function ($scope, $stateParams, $localStorage) {
	$scope.graphType = $stateParams.graphType || $localStorage.graphType;
    $localStorage.graphType = $scope.graphType;
	$scope.data = $stateParams.data || $localStorage.data;
    $localStorage.data = $scope.data;
	$scope.columns = $stateParams.columns || $localStorage.columns;
    $localStorage.columns = $scope.columns;
	$scope.settings = $stateParams.settings || $localStorage.settings;
    $localStorage.settings = $scope.settings;
})
