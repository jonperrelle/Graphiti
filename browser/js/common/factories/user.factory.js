app.factory('UserFactory', function($http) {

    return {
        addDataset: function(user, dataset, domain) {
            if (domain) {
                return $http.post('/api/users/' + user.id + '/addSocrataDataset', { dataset, domain })
                    .then(res => res.data)
                    .catch();
            } else {
                return $http.post('/api/users/' + user.id + '/addUploadedDataset', { dataset })
                    .then(res => res.data)
                    .catch();
            }
        },

        getDataset: function(user) {
             return $http.get('/api/users/' + user.id + '/awsDataset')
                    .then(res => res.data)
                    .catch();
        },

        getAllUserDatasets: function(user) {

            return $http.get('/api/users/' + user.id + '/allDatasets')
                    .then(res => res.data)
                    .catch();
        }
    }



});
