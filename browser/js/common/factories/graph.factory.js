app.factory('GraphFactory',function($http, DatasetFactory){

	let addGraphFunction = function(res) { 
        if (res.data === 'Created') {
            return {
                    success: true,
                    message: 'You have successfully added this graph!'
            };
        }
        else {
            return {
                success: false,
                message: 'You already have this graph!'
            };
        }
    };
       
	return {
	        saveUserGraph: function(user, dataset, graph, settings){ 
                        let selector = document.querySelector('.graph-container svg');
                        svgAsDataUri(selector, {}, function(uri) {
                        graph.imageSource = uri;
                        });

			return DatasetFactory.addDataset(user, dataset)
			.then(function(data) {
                                return $http.post('/api/users/'+user.id+'/graphs', {dataset: data[0], graph, settings})
                        })
			.then(addGraphFunction)
			.catch();
		},
		removeUserGraph: function(graphId, user) {
                        return $http.delete('/api/users/' + user.id + '/graphs/' + graphId)
                        .then(res=>res.data)
                        .catch();
                },

	};
});
