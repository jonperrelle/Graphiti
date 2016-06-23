app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('HomeCtrl', function($scope, QueryFactory){
	// QueryFactory.getCategories()
	// .then(function(categories){
	
	// })

	// // $scope.categorySelect = function(category) {
	// // 	QueryFactory.
	// // }

	// QueryFactory.getDatasets({category: 'recreation', count: 500})
	// .then(function(data) {
	// 	console.log(QueryFactory.getColumns(data[78]));

	// })
})

