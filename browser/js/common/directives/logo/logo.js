app.directive('barChart', function(d3Service, $window, DataFactory) {
    return {
    	restrict: 'E',
    	templateUrl: '',
    	link: function(scope, ele, attrs){

    		 // d3Service.d3().then(function(d3) {
    		 // 	window.onresize = function() {
       //              scope.$apply();
       //          };

       //          // Watch for resize event
       //          scope.$watch(function() {
       //              return angular.element($window)[0].innerWidth;
       //          }, function() {
       //              scope.render();
       //          });

       //          scope.render = function() {
       //          	let anchor = d3.select(ele[0]);
       //          	anchor.selectAll('*').remove();
       //          	let width = ele[0].parentNode.offsetWidth;
       //          	let height = 400; 
       //          	let color;
       //          	let svg = anchor
       //          	    .append('svg')
       //          	    .attr('width', width)
       //          	    .attr('height', height)
       //          	    .style('background-color', '#ffffff')
       //          	    .style('border-radius', '10px')
                	 
       //          	let pieGroup = svg.append("g")
       //      	    let pie = d3.layout.pie().value(function(d) {
       //                  return +d[scope.columns[1].name];
       //                });
       //      	    let arc = d3.svg.arc().outerRadius(180);




       //          }

    		 // })

    	}
    }
  })