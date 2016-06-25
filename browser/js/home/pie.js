app.config(function($stateProvider) {
    $stateProvider.state('pie', {
        url: '/pie',
        controller: 'PieCtrl',
        templateUrl: 'js/home/pie.html'
    });
});

app.controller('PieCtrl', function($scope) {
    $scope.width = 500;
    $scope.height = 500;
});


app.directive('pieChart', function(d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
            width: "=",
            height: "="
        },
        template: '<div><svg id="pie"></svg></div>',
        link: function(scope, ele, attrs) {

            //figure out how to choose columns to graph
            let col1 = Object.keys(scope.data[0])[2]
            let col2 = Object.keys(scope.data[0])[5]

            var myData = scope.data.map(function(e){
                return {key: e[col1], y: e[col2]}
            });


            d3Service.d3().then(function(d3) {
                nv.addGraph(function() {
                    var chart = nv.models.pieChart()
                        .x(function(d) {
                            return d.key })
                        .y(function(d) {
                            return d.y })
                        .donut(true)
                        .title(col1 + 'vs' + col2)
                        .width(scope.width)
                        .height(scope.height);


                    var svg = d3.select('#pie')

                        svg
                        .datum(myData)
                        .transition().duration(1200)
                        .attr('width', scope.width)
                        .attr('height', scope.height)
                        .call(chart);
                    
                    return chart;
                });
            });
        }
    };
});

