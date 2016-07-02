app.factory('GraphFactory',function($http){
	return {
		saveUserGraph: function(user, data, columns, type, settings){
			return $http.post('/api/users/'+user.id+'/graphs', {data, columns, type, settings})
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