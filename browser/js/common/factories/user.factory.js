app.factory('UserFactory', function($http) {

    var successFunc = function(res) { return res.data};

    return {

        fetchUser: function(userId) {
            return $http.get('/api/users/' + userId)
                .then(successFunc)
                .catch();
        },
    }



});
