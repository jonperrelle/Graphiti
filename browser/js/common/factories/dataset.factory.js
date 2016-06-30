app.factory('DatasetFactory', function($http) {

    var successFunc = function(res) { return res.data};

    return {

        addDataset: function(user, dataset, domain) {
            if (domain)  {
                return $http.post('/api/users/' + user.id + '/datasets/SocrataDataset', { dataset, domain })
                    .then(successFunc)
                    .catch();
            } else {
                return $http.post('/api/users/' + user.id + '/datasets/UploadedDataset', { dataset })
                    .then(successFunc)
                    .catch();
            }
        },

        getOneUserDataset: function(dataset, user) {
            
            var route = ''
            if (dataset.userUploaded) { 
                route = '/api/users/' + user.id + '/datasets/awsDataset/' + dataset.id;
            }
            else {
                route = 'api/soda?datasetId=' + dataset.socrataId + "&domain=" + dataset.socrataDomain;
            }
            return $http.get(route)
                    .then(successFunc)
                    .catch();
        },

        getAllUserDatasets: function(user) {
            return $http.get('/api/users/' + user.id + '/allDatasets')
                    .then(successFunc)
                    .catch();
        },

        removeDataset: function(dataset, user) {
            return $http.delete('/api/users/' + user.id + '/datasets/' + dataset.id)
                    .then(successFunc)
                    .catch();
        },
    }



});