app.config(function ($stateProvider) {
    $stateProvider.state('userSingleGraph', {
        url: '/users/:userId/graph/:graphId',
        templateUrl: 'js/graph/singleUserGraph.html',
        controller:"singleGraphCtrl",
        params: {
            graphType: null,
	    	settings: null,
	    	data: null,
	    	columns: null
        }
    });
});
