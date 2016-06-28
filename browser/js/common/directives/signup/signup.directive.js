app.directive('signupForm', function ($state, AuthService) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/signup/signup.directive.html',
        scope: { },
        link: function(scope) {
        	scope.sendSignup = function (signupInfo) {

                scope.error = null;

                AuthService.signup(signupInfo)
                .then(function () {
                    return AuthService.login({email: signupInfo.email, password: signupInfo.password});
                })
                .then(function (user) {
                   $state.go('userHome', {userId: user.id});
                })
                .catch(function () {
                    scope.error = 'Invalid signup credentials.';
                });

            };
        }
    };
});