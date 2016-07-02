app.config(function($stateProvider,$urlRouterProvider) {

    $stateProvider.state('login', {
        url: '/login/:dataset',
        template: '<login-form></login-form>'
    });
});

app.config(function($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup/:dataset',
        template: '<signup-form></signup-form>'
    });

});
