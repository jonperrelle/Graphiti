app.directive('pieChart', function(d3Service, $window, DataFactory) {

    return {
        restrict: 'E',
        scope: {
            rows: "=",
            columns: "=",
            settings: "="
        },

        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {
                window.onresize = function() {
                    scope.$apply();
                };
                // Watch for resize event
                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render();
                });

                scope.$watch(function(scope) {
                    return scope.settings;
                }, function() {
                    scope.render();
                }, true);

                scope.$watch(function(scope) {
                    return scope.columns;
                }, function() {
                    scope.render();
                }, true);

                scope.render = function() {
                        d3.select(ele[0]).selectAll('*').remove();

                        let margin = { top: 20, right: 20, bottom: 30, left: 40 },
                            width = scope.settings.width || ele[0].parentNode.offsetWidth,
                            height = scope.settings.height || width,
                            radius = (height * 0.8) / 2;

                        let filteredData = scope.rows.filter(obj => Number(obj[scope.columns[1].name]) > 0);

                        let groupedData = DataFactory.groupByCategory(filteredData, scope.columns[0].name, scope.columns[1].name);
                        groupedData = DataFactory.orderByCategory(groupedData, scope.columns[0].name);

                        //uses build in d3 method to create color scale
                        let color = scope.settings.color || d3.scale.category20();

                        let vis = d3.select(ele[0])
                            .append('svg')
                            .attr('width', width)
                            .attr('height', height)
                            .data([groupedData])
                            .append("g")
                            .attr("transform", "translate(" + (width / 2) + "," + (radius + margin.top) + ")");
                        let pie = d3.layout.pie().value(function(d) {
                            return +d[scope.columns[1].name];
                        });

                        // declare an arc generator function
                        let arc = d3.svg.arc().outerRadius(radius);
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

                        arcs.forEach(function () {

                        });

                        // // add the text
                        // arcs.append("text").attr("transform", function(d) {
                        //     d.innerRadius = 0;
                        //     d.outerRadius = radius;
                        //     return "translate(" + arc.centroid(d) + ")";
                        // }).attr("text-anchor", "middle").text(function(d, i) {
                        //     return groupedData[i][scope.columns[0].name];
                        // });

                        // let legend = svg.selectAll(".legend")
                        //     .data(color.domain())
                        //     .enter().append("g")
                        //         .attr("class", "legend")
                        //         .attr("transform", function(d, i) { return "translate(" + (40) + "," + i * 20 + ")" });

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
                        //     .text(function(d) { return d[scope.columns[0].name]});
                    }
                    
            })
        }
    }
});
