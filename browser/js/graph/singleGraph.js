app.config(function ($stateProvider) {
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

app.controller('singleGraphCtrl', function($scope, $stateParams){
	// console.log($stateParams)
	$scope.graphType = $stateParams.graphType;
	$scope.data = $stateParams.data;
	$scope.columns = $stateParams.columns;
	//$scope.settings = $stateParams.settings; 
	
})