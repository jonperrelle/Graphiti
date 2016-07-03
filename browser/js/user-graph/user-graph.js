app.config(function ($stateProvider) {
	$stateProvider.state('userGraph',{
		url: "/:userId/userGraph/:graphId",
		templateUrl: "js/user-graph/user-graph.html",
		controller: "userGraphController",
		params: {
			graph: null,
		},
	});
});

app.controller('userGraphController', function ($scope,$stateParams) {

	$scope.graph = $stateParams.graph;

});
