app.factory('QueryFactory', function ($http) {

	let obj = {
		getCategories: function(){
			return $http.get('https://api.us.socrata.com/api/catalog/v1/categories')
			.then(function(categories){
				return categories.data.results;
			});
		},
		getDatasets: function(category){
			return $http.get('https://api.us.socrata.com/api/catalog/v1?categories=' + category + '&only=datasets&limit=3000')
			.then(function(set){
				return set.data.results;
			});
				
		},
		getColumns: function(dataset){
			return dataset.resource.columns_field_name;
		},
		getData: function(dataset, arrOfColumns){
			return $http.put('api/soda',{dataset: dataset,arrOfColumns: arrOfColumns})
			.then(function(set){

				console.log(set.data);
				return set.data;
			});
		}
	}

	return obj;
});
