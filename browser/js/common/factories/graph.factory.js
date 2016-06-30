app.factory('GraphFactory',function($http){
	return {
		addUserGraph: function(user, dataset, graph, settings){
			return $http.post('/api/users/'+user.id+'/graphs', {dataset, graph, settings})
			.then(res=>res.data)
			.catch();
		},
		removeUserGraph: function(graph, user) {
            return $http.delete('/api/users/' + user.id + '/graphs/' + graph.id)
                    .then()
                    .catch();
        }

	}
})