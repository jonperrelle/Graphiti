app.directive('loginForm', function ($state, AuthService,$stateParams,$localStorage) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/login/login.directive.html',
        scope: { },
        link: function(scope) {
        	scope.sendLogin = function (loginInfo) {

                scope.error = null;

                AuthService.login(loginInfo).then(function (user) {
                    if($stateParams.source === 'dataset') $state.go('datasetDetails',{datasetId: $localStorage.datasetId});
                    else if ($stateParams.source === 'graph') $state.go('singleGraph');
                    else $state.go('userHome', {userId: user.id});
                }).catch(function () {
                    scope.error = 'Invalid login credentials.';
                });

            };
        }
    };
});