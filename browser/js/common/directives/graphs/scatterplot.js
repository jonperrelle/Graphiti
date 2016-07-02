app.directive('scatterplotGraph', function(d3Service, $window, GraphSettingsFactory) {
    let directive = {};

    directive.restrict = 'E';
    directive.scope = {
        rows: '=',
        columns: '=',
        settings: '='
    };
    directive.link = linkFn;

    return directive;


    function linkFn(scope, ele, attrs) {
        // scope.settings = scope.settings || {};
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

                let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] 
                    && obj[scope.columns[1].name] 
                    && (!!Number(obj[scope.columns[0].name]) || Number(obj[scope.columns[0].name]) === 0)
                    && (!!Number(obj[scope.columns[1].name]) || Number(obj[scope.columns[1].name]) === 0))
                .sort((a, b) => a[scope.columns[0].name] - b[scope.columns[0].name]);

                let zoom = d3.behavior.zoom()
                   .scaleExtent([1, 5])
                   .on("zoom", zooming);

                let anchor = d3.select(ele[0])
                anchor.selectAll('*').remove();

                let margin = { top: 20, right: 20, bottom: 30, left: 40 },
                    width = (+scope.settings.width || ele[0].parentNode.offsetWidth - 20) - margin.left - margin.right,
                    height = (+scope.settings.height || width) - margin.top - margin.bottom,

                    dotRadius = width / 150,

                    xAxisLabel = scope.settings.xAxisLabel || scope.columns[0].name,
                    yAxisLabel = scope.settings.yAxisLabel || scope.columns[1].name,
                    svg = anchor
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .call(zoom);
                    


                let xValue = function(d) {
                        return +d[scope.columns[0].name]
                    }, // data -> value
                    xScale = d3.scale.linear()
                    .range([margin.left, margin.left + width]), // value -> display
                    xMap = function(d) {
                        return xScale(xValue(d))
                    }, // data -> display
                    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                let yValue = function(d) {
                        return +d[scope.columns[1].name]
                    }, // data -> value
                    yScale = d3.scale.linear().range([height, margin.top]), // value -> display
                    yMap = function(d) {
                        return yScale(yValue(d))
                    }, // data -> display
                    yAxis = d3.svg.axis().scale(yScale).orient("left");

                var minX = (typeof scope.settings.minX === 'number') ? scope.settings.minX : d3.min(filteredData, xValue) - 1;
                var maxX = (typeof scope.settings.maxX === 'number') ? scope.settings.maxX : d3.max(filteredData, xValue) - 1;
                var minY = (typeof scope.settings.minY === 'number') ? scope.settings.minY : d3.min(filteredData, yValue) - 1;
                var maxY = (typeof scope.settings.maxY === 'number') ? scope.settings.maxY : d3.max(filteredData, yValue) - 1;




            function zooming() {
               let e = d3.event;
               let tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale));
               let ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));

               zoom.translate([tx, ty]);

               dots.attr("transform", ["translate(" + [tx, ty] + ")", "scale(" + e.scale + ")"].join(" "));
              // xAxis.attr("transform", ["translate(" + [tx, ty] + ")", "scale(" + e.scale + ")"].join(" "));
              // yAxis.attr("transform", ["translate(" + [tx, ty] + ")", "scale(" + e.scale + ")"].join(" "));
               svg.attr("transform", ["translate(" + [tx, ty] + ")", "scale(" + e.scale + ")"].join(" "));
               // circles.attr("transform", ["translate(" + [tx, ty] + ")", "scale(" + e.scale + ")"].join(" "));
             }


                let cValue = function(d) {
                        return d
                    },
                    color = scope.settings.color || d3.scale.category10();
                // add the tooltip area to the webpage
                let tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                xScale.domain([minX, maxX]);
                yScale.domain([minY, maxY]);

                // x-axis
                svg.append("g")
                    .attr("class", "x axis")
                    //.attr("transform", "translate(0," + height + ")")
                    .attr("transform", "translate(0," + (height) + ")")
                    //.attr("transform", "translate(" + margin.left + "," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text(xAxisLabel);

                // y-axis
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.left + ",0)")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")

                //.attr("x", margin.left)
                .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(yAxisLabel);

                // draw dots
                let dots = svg.selectAll(".dot")
                    .data(filteredData)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", dotRadius)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr("fill", color)
                    .on("mouseover", function(d) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(d[scope.columns[0].name] + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                            .style("left", (d3.event.pageX + 5) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                // draw legend
                let legend = svg.selectAll(".legend")
                    .data(color.domain()) //color.domain() is not a function
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) {
                        return "translate(" + (40) + "," + i * 20 + ")"
                    });

                // draw legend colored rectangles
                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                // draw legend text
                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    //.text(function(d) { return d})
                    .text(scope.columns[0].name);
            };
        });
    };
});
