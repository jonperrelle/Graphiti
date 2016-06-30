app.factory('UserFactory', function($http) {

    var successFunc = function(res) { return res.data};

    return {

        fetchUser: function(userId) {
            return $http.get('/api/users/' + userId)
                .then(successFunc)
                .catch();
        },

        addDataset: function(user, dataset, domain) {
            if (domain) {
                return $http.post('/api/users/' + user.id + '/SocrataDataset', { dataset, domain })
                    .then(successFunc)
                    .catch();
            } else {
                return $http.post('/api/users/' + user.id + '/UploadedDataset', { dataset })
                    .then(successFunc)
                    .catch();
            }
        },

        getOneUserDataset: function(dataset, user) {
            if (dataset.userUploaded) { 
                return $http.get('/api/users/' + user.id + '/awsDataset/' + dataset.id)
                    .then(successFunc)
                    .catch();
            }
            else {
                return $http.get('api/soda?datasetId=' + dataset.socrataId + "&domain=" + dataset.socrataDomain)
                    .then(successFunc)
                    .catch();
            }
        },

        getAllUserDatasets: function(user) {
            return $http.get('/api/users/' + user.id + '/allDatasets')
                    .then(successFunc)
                    .catch();
        }
    }



});
