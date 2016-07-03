app.config(function($stateProvider,$urlRouterProvider) {

    $stateProvider.state('login', {
        url: '/login/:source',
        template: '<login-form></login-form>'
    });
});

app.config(function($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup/:source',
        template: '<signup-form></signup-form>'
    });

});
