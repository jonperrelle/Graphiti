app.directive('pieChart', function(d3Service, $window) {

    return {
        restrict: 'E',
        scope: {
            rows: "=",
            columns: "="
        },

        template: '<div id="pie"></div>',
        link: function(scope, ele, attrs) {


            var w = 500;
            var h = 500;
            var r = h / 2;
            scope.rows = scope.rows.filter(obj => Number(obj[scope.columns[1].name]) > 0);
            d3Service.d3().then(function(d3) {

                //uses build in d3 method to create color scale
                var color = d3.scale.category20c();

                var vis = d3.select('#pie')
                    .append("svg")
                    .data([scope.rows])
                    .attr("width", w)
                    .attr("height", h)
                    .append("g")
                    .attr("transform", "translate(" + r + "," + r + ")");
                var pie = d3.layout.pie().value(function(d) {
                    return +d[scope.columns[1].name];
                });

                // declare an arc generator function
                var arc = d3.svg.arc().outerRadius(r);
                // select paths, use arc generator to draw
                var arcs = vis.selectAll("g.slice")
                    .data(pie)
                    .enter()
                        .append("g")
                        .attr("class", "slice");

                arcs.append("path")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", arc);

                // add the text
                arcs.append("text").attr("transform", function(d) {
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";
                }).attr("text-anchor", "middle").text(function(d, i) {
                    return scope.rows[i][scope.columns[0].name];
                });

              //     let legend = svg.selectAll(".legend")
              //     .data(color.domain())
              //   .enter().append("g")
              //     .attr("class", "legend")
              //     .attr("transform", function(d, i) { return "translate(" + (40) + "," + i * 20 + ")" });

              // // draw legend colored rectangles
              // legend.append("rect")
              //     .attr("x", width - 18)
              //     .attr("width", 18)
              //     .attr("height", 18)
              //     .style("fill", color);

              // // draw legend text
              // legend.append("text")
              //     .attr("x", width - 24)
              //     .attr("y", 9)
              //     .attr("dy", ".35em")
              //     .style("text-anchor", "end")
              //     //.text(function(d) { return d})
              //     .text(scope.columns[0].name);
            });
        }
    };
});
