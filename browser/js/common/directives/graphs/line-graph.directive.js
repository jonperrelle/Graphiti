
app.directive('lineGraph', function(d3Service, SVGFactory, graphSettingsFactory) {

    return {
        restrict: 'E',
        scope: {
            rows: "=",
            seriesx: '=',
            seriesy: '=',
            settings: "="
        },
        link: function(scope, ele, attrs) {

            d3Service.d3().then(function(d3) {
                // Watch for resize event
                SVGFactory.watchForChanges(scope);

                scope.render = function() {   

                    let anchor = d3.select(ele[0])
                    anchor.selectAll('*').remove();                        

                    graphSettingsFactory.getSavedSettings(scope.settings, ele[0], scope.rows)
                        .then(function (savedSets) {
                            let defaultSettings = graphSettingsFactory.getDefaultSettings();
                            let svg = SVGFactory.appendSVG(anchor, savedSets.width, savedSets.height);

                            let x; 

                            if(scope.seriesx[0].type == 'number') x = d3.scale.linear().range([defaultSettings.margin.left, savedSets.width - defaultSettings.margin.right]);
                            else {
                                x = d3.time.scale().range([defaultSettings.margin.left, savedSets.width - defaultSettings.margin.right])
                            };  

                            let y = d3.scale.linear()
                                .range([savedSets.height - defaultSettings.margin.bottom, defaultSettings.margin.top]);

                            let xAxis = d3.svg.axis()
                                .scale(x)
                                .orient("bottom");

                            let yAxis = d3.svg.axis()
                                .scale(y)
                                .orient("left");

                            let line = d3.svg.line()
                                .x(function(d) {
                                    return x(d[0]);
                                })
                                .y(function(d) {
                                    return y(d[1]);
                                });

                            x.domain([savedSets.minX, savedSets.maxX]);
                            y.domain([savedSets.minY, savedSets.maxY]);

                            //xAxis
                            SVGFactory.appendXAxis(svg, defaultSettings.margin, savedSets.width, savedSets.height, xAxis, savedSets.xAxisLabel, savedSets.xAxisLabelSize);

                    

                            // svg.append("g")
                            //     .attr("class", "x axis")
                            //     .attr("transform", "translate(0," + (savedSets.height - defaultSettings.margin.bottom) + ")")
                            //     .call(xAxis)
                            //     .append("text")
                            //     .attr("class", "xlabel")
                            //     .text(savedSets.xAxisLabel);

                            svg.select(".xlabel")
                                .attr("transform", "translate(" + (savedSets.width - defaultSettings.margin.left - defaultSettings.margin.right) / 2 + ", " + (defaultSettings.margin.bottom - 10) + ")");

                            //yAxis
                            SVGFactory.appendYAxis(svg, defaultSettings.margin, savedSets.height, yAxis, savedSets.yAxisLabel, savedSets.yAxisLabelSize);
                            // svg.append("g")
                            //     .attr("class", "y axis")
                            //     .attr("transform", "translate(" + defaultSettings.margin.left + ",0)")
                            //     .call(yAxis)
                            //     .append("text")
                            //     .attr("class", "ylabel")
                            //     .attr("transform", "rotate(-90)translate(" + -((savedSets.height + defaultSettings.margin.bottom + defaultSettings.margin.top) / 2) + ", " + -(defaultSettings.margin.left - 20) + ")")
                            //     .text(savedSets.yAxisLabel);

                            let yData = svg.selectAll("yData")
                                .data(scope.rows)
                                .enter().append("g")
                                .attr("class", "yData"); 

                            yData.append("path")
                                .attr("d", function(d){
                                   
                                    return line(d.values);
                                })
                                .attr('fill', 'none')
                                .attr("stroke", function(d, i) {
                                    if(typeof savedSets.color === 'function') return savedSets.color(i)
                                    else return savedSets.color;
                                })
                                .attr("stroke-width", 2);

                           yData.append("text")
                              .datum(function(d) { 
                                return {name: d.name, value: d.values[d.values.length - 1]}; 
                                })
                              .attr("transform", function(d) { return "translate(" + x(d.value[0]) + "," + y(d.value[1]) + ")"; })
                              .attr("x", 3)
                              .attr("dy", ".35em")
                              .text(function(d) { return d.name; });       

                            SVGFactory.appendTitle(svg, defaultSettings.margin, savedSets.width, savedSets.title, savedSets.titleSize);
                            // svg.append("text")
                            //     .attr("x", (savedSets.width / 2))             
                            //     .attr("y", defaultSettings.margin.top/2)
                            //     .attr("text-anchor", "middle")    
                            //     .text(savedSets.title);
                            
                    });
                };
            });
        }
    };
});
