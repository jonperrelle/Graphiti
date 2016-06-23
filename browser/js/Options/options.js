app.controller('optionsCtrl', function ($scope,QueryFactory) {

  QueryFactory.getCategories().then(cats=>{
    $scope.categories = cats.map(cat=>cat.category.toUpperCase());
  });

});

app.config(function ($stateProvider) {

    $stateProvider.state('options', {
        url: '/options',
        templateUrl: 'js/options/options.html',
        controller: 'optionsCtrl'
    });

});