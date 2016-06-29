app.directive('pieChart', function(d3Service, $window) {

    return {
        restrict: 'E',
        scope: {
            data: "=",
            width: "=",
            height: "=",
            cols: "="
        },

        template: '<div><svg id="pie"></svg></div>',

        link: function(scope, ele, attrs) {



            var myData = scope.data


            d3Service.d3().then(function(d3) {
                nv.addGraph(function() {
                    var chart = nv.models.pieChart()
                        .x(function(d) {
                            return d[scope.cols[0].name];
                        })
                        .y(function(d) {
                            return d[scope.cols[1].name];
                        })
                        .width(scope.width)
                        .height(scope.height);

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

app.directive('pieChartt', function(d3Service, $window) {

    return {
        restrict: 'E',
        scope: {
            data: "=",
            width: "=",
            height: "=",
            cols: "="
        },

        template: '<div id="pie"></div>',
        link: function(scope, ele, attrs) {


            var w = scope.width;
            var h = scope.height;
            var r = h / 2;

            d3Service.d3().then(function(d3) {

                //uses build in d3 method to create color scale
                var color = d3.scale.category20c();

                var vis = d3.select('#pie').append("svg").data([scope.data]).attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + r + "," + r + ")");
                var pie = d3.layout.pie().value(function(d) {
                    return d[scope.cols[0].name];
                });

                // declare an arc generator function
                var arc = d3.svg.arc().outerRadius(r);

                // select paths, use arc generator to draw
                var arcs = vis.selectAll("g.slice").data(pie).enter().append("g").attr("class", "slice");

                arcs.append("path")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", function(d) {
                        // log the result of the arc generator to show how cool it is :)
                        return arc(d[scope.cols[1].name]);
                    });

                // add the text
                arcs.append("text").attr("transform", function(d) {
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




function type(d) {
    d.population = +d.population;
    return d;
}


app.directive('pieCharttt', function(d3Service, $window) {

    return {
        restrict: 'E',
        scope: {
            data: "=",
            width: "=",
            height: "=",
            cols: "="
        },
        template: '<div id="pie"></div>',
        link: function(scope, ele, attrs) {


            var radius = Math.min(scope.width, scope.height) / 2;

            var color = d3.scale.ordinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(0);

            // var labelArc = d3.svg.arc()
            //     .outerRadius(radius - 40)
            //     .innerRadius(radius - 40);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    return d[scope.cols[1].name]; });

            var svg = d3.select("#pie").append("svg")
                .attr("width", scope.width)
                .attr("height", scope.height)
                .append("g")
                .attr("transform", "translate(" + scope.width / 2 + "," + scope.height / 2 + ")");

            
                var g = svg.selectAll(".arc")
                    .data(pie(data))
                    .enter().append("g")
                    .attr("class", "arc");

                g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) {
                        return color(d[scope.cols[1].name]); });

                // g.append("text")
                //     .attr("transform", function(d) {
                //         return "translate(" + labelArc.centroid(d) + ")"; })
                //     .attr("dy", ".35em")
                //     .text(function(d) {
                //         return d.data.age; });
        },
    }
})
