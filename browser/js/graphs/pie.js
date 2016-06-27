app.config(function($stateProvider) {
    $stateProvider.state('pie', {
        url: '/pie',
        controller: 'PieCtrl',
        templateUrl: 'js/graphs/pie.html'
    });
});

app.controller('PieCtrl', function($scope) {
    $scope.width = 500;
    $scope.height = 500;
    $scope.data2 = [{ "label": "Category A", "value": 20 },
        { "label": "Category B", "value": 50 },
        { "label": "Category C", "value": 30 },
        { "label": "Category D", "value": 1 },
        { "label": "Category D", "value": 1 },
        { "label": "Category D", "value": 1 }
    ];

    $scope.data = [{ "label": "Category A", "value": 20 },
        { "label": "Category B", "value": 50 },
        { "label": "Category C", "value": 30 }
    ];

});


app.directive('pieChart', function(d3Service, $window) {

    return {
        restrict: 'E',
        scope: {
            data: "=",
            width: "=",
            height: "=",
            num: "="
        },

        template: '<div><svg id="pie"></svg></div>',

        link: function(scope, ele, attrs) {

            //figure out how to choose columns to graph
            // let col1 = Object.keys(scope.data[0])[2]
            // let col2 = Object.keys(scope.data[0])[5]

            // var myData = scope.data.map(function(e) {
            //     return { key: e[col1], y: e[col2] }
            // });

            var myData = scope.data


            d3Service.d3().then(function(d3) {
                nv.addGraph(function() {
                    var chart = nv.models.pieChart()
                        .x(function(d) {
                            return d.label;
                        })
                        .y(function(d) {
                            return d.value;
                        })
                        .width(scope.width)
                        .height(scope.height);

                    console.log(scope.data);

                    var svg = d3.select('svg#pie')

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

app.directive('pieChart2', function(d3Service, $window) {

    return {
        restrict: 'E',
        scope: {
            data: "=",
            width: "=",
            height: "=",
            num: "="
        },

        template: '<div id="pie"></div>',
        link: function(scope, ele, attrs) {

            //figure out how to  format data appropriately after choosing columns to graph!!!
            // let col1 = Object.keys(scope.data[0])[2];
            // let col2 = Object.keys(scope.data[0])[5];

            // var myData = scope.data.map(function(e) {
            //     return { label: e[col1], value: e[col2] }
            // });


            var w = scope.width;
            var h = scope.height;
            var r = h / 2;

            d3Service.d3().then(function(d3) {

                //uses build in d3 method to create color scale
                var color = d3.scale.category20c();

                var vis = d3.select('directive#pie').append("svg:svg").data([scope.data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
                var pie = d3.layout.pie().value(function(d) {
                    return d.value;
                });

                // declare an arc generator function
                var arc = d3.svg.arc().outerRadius(r);

                // select paths, use arc generator to draw
                var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");

                arcs.append("svg:path")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", function(d) {
                        // log the result of the arc generator to show how cool it is :)
                        console.log(arc(d));
                        return arc(d);
                    });

                // add the text
                arcs.append("svg:text").attr("transform", function(d) {
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";
                }).attr("text-anchor", "middle").text(function(d, i) {
                    return scope.data[i].label;
                });

            });
        }
    };
});

app.directive('multiBar', function(d3Service, $window) {

    return {
        restrict: 'E',
        scope: {
            data: "=",
            width: "=",
            height: "=",
        },

        template: '<div><svg id="mbar"></svg></div>',

        link: function(scope, ele, attrs) {

            nv.addGraph(function() {
                var chart = nv.models.multiBarChart()
                    .reduceXTicks(true) //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(0) //Angle to rotate x-axis labels.
                    .showControls(true) //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1) //Distance between each group of bars.
                ;

                chart.xAxis
                    .tickFormat(d3.format(',f'));

                chart.yAxis
                    .tickFormat(d3.format(',.1f'));

                d3.select('#mbar')
                    .datum(scope.data)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });

        }
    };
});
