app.factory('DatasetFactory', function($http) {

    let successFunction = res => res.data;

    return {

        addDataset: function(user, dataset) {
            if (dataset.socrataDomain)  {
                return $http.post('/api/users/' + user.id + '/datasets/SocrataDataset', { dataset})
                    .then(successFunction)
                    .catch();
            } else {
                return $http.post('/api/users/' + user.id + '/datasets/UploadedDataset', { dataset })
                    .then(successFunction)
                    .catch();
            }
        },

        getOneUserDataset: function(dataset, user) {
            
            let route = '';
            if (dataset.userUploaded) { 
                route = '/api/users/' + user.id + '/datasets/awsDataset/' + dataset.id;
            }
            else {
                route = 'api/soda?datasetId=' + dataset.socrataId + "&domain=" + dataset.socrataDomain;
            }
            return $http.get(route)
                    .then(successFunction)
                    .catch();
        },

        removeDataset: function(dataset, user) {
            let datasetId = dataset.id || dataset;
            return $http.delete('/api/users/' + user.id + '/datasets/' + datasetId)
                    .then(res => res.data)
                    .catch();
        },
    };
});
