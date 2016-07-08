app.config (function ($stateProvider) {
  $stateProvider.state('singleGraph', {
    url: '/graph',
    controller: 'singleGraphCtrl',
    templateUrl: 'js/graph/singleGraph.html',
    params: {
        dataset: null,
    	graphType: null,
    	settings: null,
    	data: null,
    	seriesx: null,
        seriesy: null,
        allColumns: null,
    }
  });
});

app.controller('singleGraphCtrl', function ($scope, $stateParams, $timeout, $state, $localStorage, GraphFactory, Session) {
	let domain;
    $localStorage.graphId = $stateParams.graphId || $localStorage.graphId;
    $scope.graphType = $stateParams.graphType || $localStorage.graphType;
    $localStorage.graphType = $scope.graphType;
	$scope.data = $stateParams.data || $localStorage.data;
    $localStorage.data = $scope.data;
    console.log("HERERERERERE", $localStorage.data)
	$scope.seriesx = $stateParams.seriesx || $localStorage.seriesx;
    $localStorage.seriesx = $scope.seriesx;
    $scope.seriesy = $stateParams.seriesy || $localStorage.seriesy;
    $localStorage.seriesy = $scope.seriesy;
	$scope.settings = $stateParams.settings || $localStorage.settings;
    $localStorage.settings = $scope.settings;
    $scope.dataset = $stateParams.dataset;
    $scope.allColumns = $stateParams.allColumns || $localStorage.allColumns;
    $localStorage.allColumns = $scope.allColumns;

    $scope.unchanged = false;
    $scope.addedGraph = false;
    if (Session.user) $scope.user = Session.user;
    $scope.saveUserGraph = function () {
        let graphToSave = {};
        graphToSave.columns = $scope.columns;
        graphToSave.graphType = $scope.graphType;
        GraphFactory.saveUserGraph($scope.user, $localStorage.dataset, graphToSave, $scope.settings)
            .then(function(data) {
                $scope.success = data.success;
                $scope.message = data.message;
                $scope.userGraph=true;
                $scope.addedGraph = true; 
                $scope.unchanged = true;
                $timeout(function () {
                    $scope.addedGraph=false;
                }, 2000);
            })
            .catch();
    };

    $scope.$watch(function($scope) {
        return $scope.settings;
    }, function() {
        $scope.unchanged = false;
    }, true);

    $scope.$watch(function($scope) {
        return $scope.seriesx;
    }, function() {
        $scope.unchanged = false;
    }, true);

    $scope.$watch(function($scope) {
        return $scope.seriesy;
    }, function() {
        $scope.unchanged = false;
    }, true);

    $scope.removeUserGraph = function () {
        GraphFactory.removeUserGraph($localStorage.graphId, $scope.user)
        .then (function () {
            $state.go('userHome', {userId: $scope.user.id});
        });
    };
});
