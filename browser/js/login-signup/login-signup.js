app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        template: '<login-form></login-form>'
    });

});

app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        template: '<signup-form></signup-form>'
    });

});

