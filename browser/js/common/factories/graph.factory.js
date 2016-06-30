app.factory('GraphFactory',function($http){
	return {
		getUserGraph: function(user, graph){
			return $http.get('/api/users/'+user.id+'/graphs/' + graph.id)
			.then(res=>res.data)
			.catch()
		},
	}
})