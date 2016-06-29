app.config(function ($stateProvider) {
    $stateProvider.state('userHome', {
        url: '/users/:userId',
        templateUrl: 'js/user-home/user-home.html',
        controller:"UserHomeCtrl",
        // resolve: {
        //     User: function ($stateParams, UserFactory) {
        //         return UserFactory.getUser($stateParams.userId);
        //     }
        // }
    });
});

app.controller('UserHomeCtrl', function ($scope, Session, UserFactory) {
    $scope.user = Session.user;

    UserFactory.getAllUserDatasets($scope.user)
    .then(function(data) {
        $scope.datasets = data;
    });

    $scope.getDataset = function () {
        UserFactory.getDataset($scope.user)
        .then(function(res) {
            console.log(res);
        });
    }
});