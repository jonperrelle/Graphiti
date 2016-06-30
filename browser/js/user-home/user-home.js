app.config(function ($stateProvider) {
    $stateProvider.state('userHome', {
        url: '/users/:userId',
        templateUrl: 'js/user-home/user-home.html',
        controller:"UserHomeCtrl",
        resolve: {
            UserInfo: function ($stateParams, UserFactory) {
                return UserFactory.fetchUser($stateParams.userId);
            }
        }
    });
});

app.controller('UserHomeCtrl', function ($scope, $state, Session, GraphFactory, UserFactory, UserInfo) {
    $scope.user = UserInfo.user;
    $scope.datasets = UserInfo.datasets;
    $scope.graphs = UserInfo.graphs;

    $scope.getUserGraph = function(graph){
        GraphFactory.getUserGraph($scope.user, graph)
        .then(graph => {
            $state.go('userGraph', {userId: $scope.user.id, graphId: graph.id, graph: graph, dataset: dataset});
        }
    }

    $scope.goToDataset = function (dataset) {
        UserFactory.getOneUserDataset(dataset, $scope.user)
        .then( rows => {
            if (dataset.socrataId) {
                $state.go('userDatasetDetails', {userId: $scope.user.id, datasetId: dataset.id, dataset: dataset, rows: rows});
            }
            else {
                $state.go('userDatasetDetails', {userId: $scope.user.id, datasetId: dataset.name, dataset: rows.dataset, rows: rows.data});
            }
        });
    };

    $scope.getDataset = function () {
        UserFactory.getDataset($scope.user)
        .then(function(res) {
            console.log(res);
        });
    };

    // $scope.removeDataset()
});
