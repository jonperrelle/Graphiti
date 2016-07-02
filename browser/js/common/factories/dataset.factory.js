app.factory('DatasetFactory', function($http) {

    let addDatasetFunction = function(res) { 
        if (res.data === 'Created') {
            return {
                    success: true,
                    message: 'You have successfully added this dataset!'
            };
        }
        else {
            return {
                success: false,
                message: 'You already have this dataset'
            };
        }
    };

    return {

        addDataset: function(user, dataset, domain) {
            if (domain)  {
                return $http.post('/api/users/' + user.id + '/datasets/SocrataDataset', { dataset, domain })
                    .then(addDatasetFunction)
                    .catch();
            } else {
                return $http.post('/api/users/' + user.id + '/datasets/UploadedDataset', { dataset })
                    .then(addDatasetFunction)
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
                    .then(res => res.data)
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
