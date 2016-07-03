app.factory('GraphFactory',function($http){

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
		saveUserGraph: function(user, dataset, columns, type, settings){
			console.log(user, dataset, columns, type, settings)
			return $http.post('/api/users/'+user.id+'/graphs', {dataset, columns, type, settings})
			.then(addGraphFunction)
			.catch();
		},
		removeUserGraph: function(graph, user) {
            return $http.delete('/api/users/' + user.id + '/graphs/' + graph.id)
                    .then(res=>res.data)
                    .catch();
        }

	};
});