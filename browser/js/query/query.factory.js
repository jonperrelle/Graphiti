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
			console.log(dataset)
			return dataset.resource.columns_field_name;
		},
		getData: function(dataset, arrOfColumns){
			console.log(arrOfColumns)
			return $http.get(dataset.permalink + '.json?$select=' + arrOfColumns.join(","))
			.then(function(set){
				return set.data.results;
			});
		}
	}

	return obj;
});
