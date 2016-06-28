app.directive('loginForm', function ($state, AuthService) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/login/login.directive.html',
        scope: { },
        link: function(scope) {
        	scope.sendLogin = function (loginInfo) {

                scope.error = null;

                AuthService.login(loginInfo).then(function (user) {
                    $state.go('userHome', {userId: user.id});

                }).catch(function () {
                    scope.error = 'Invalid login credentials.';
                });

            };
        }
    };
});