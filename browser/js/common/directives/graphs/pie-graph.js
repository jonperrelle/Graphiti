app.directive('lineGraph', function(d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
        },
        link: function(scope, ele, attrs) {

           

            d3Service.d3().then(function(d3) {
              
                var chart2 = nv.models.pieChart();
                chart2.width(500);
                //chart2.title().titleOffset(-10);
                chart2.options({height: 500, donut: true });
                

                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };

                // Watch for resize event
                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render(filteredData);
                });

                
            });
        }
    };
});