app.factory('QueryFactory', function ($http) {

	let obj = {
		getCategories: function(){
			return $http.get('https://api.us.socrata.com/api/catalog/v1/categories')
			.then(function(categories){
				return categories.data.results;
			});
		},
		searchForDataset: function(query, categories) {
			return $http.get('https://api.us.socrata.com/api/catalog/v1?only=datasets&q=' + query + "&" + categories)
			.then(function(sets){
				return sets.data.results;
			});
		},

		getOneDataset: function(dataset) {
			return $http.get('api/soda?datasetId=' + dataset.socrataId + "&domain=" + dataset.socrataDomain)
			.then(function(set){
				return set.data;
			});
		}
	}

	return obj;
});
