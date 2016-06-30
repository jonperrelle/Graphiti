app.directive('pieChart', function(d3Service, $window, DataFactory) {

    return {
        restrict: 'E',
        scope: {
            rows: "=",
            columns: "="
        },
        
        link: function(scope, ele, attrs) {

            let w = 500;
            let h = 500;
            let r = h / 2;
            scope.rows = scope.rows.filter(obj => Number(obj[scope.columns[1].name]) > 0);
            d3Service.d3().then(function(d3) {

              let groupedData = DataFactory.groupByCategory(scope.rows, scope.columns[0].name, scope.columns[1].name);
              groupedData = DataFactory.orderByCategory(groupedData, scope.columns[0].name);

                //uses build in d3 method to create color scale
                let color = d3.scale.category20c();

                let vis = d3.select(ele[0])
                    .append("svg")
                    .data([groupedData])
                    .attr("width", w)
                    .attr("height", h)
                    .append("g")
                    .attr("transform", "translate(" + r + "," + r + ")");
                let pie = d3.layout.pie().value(function(d) {
                    return +d[scope.columns[1].name];
                });

                // declare an arc generator function
                let arc = d3.svg.arc().outerRadius(r);
                // select paths, use arc generator to draw
                let arcs = vis.selectAll("g.slice")
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
                    return groupedData[i][scope.columns[0].name];
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
