
app.directive('lineGraph', function(d3Service, SVGFactory, GraphFilterFactory, graphSettingsFactory) {

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

                            let svg = SVGFactory.appendSVG(anchor, savedSets.width, savedSets.height);

                            let x; 

                            if(scope.seriesx[0].type == 'number') x = d3.scale.linear().range([savedSets.margin.left, savedSets.width - savedSets.margin.right]);
                            else {
                                x = d3.time.scale().range([savedSets.margin.left, savedSets.width - savedSets.margin.right])
                            };  

                            let y = d3.scale.linear()
                                .range([savedSets.height - savedSets.margin.bottom, savedSets.margin.top]);

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

                            let filteredValues = GraphFilterFactory.setBounds(savedSets, scope.rows);
                            //xAxis
                            SVGFactory.appendXAxis(svg, savedSets.margin, savedSets.width, savedSets.height, xAxis, savedSets.xAxisLabel, savedSets.xAxisLabelSize);

                            svg.select(".xlabel")
                                .attr("transform", "translate(" + (savedSets.width - savedSets.margin.left - savedSets.margin.right) / 2 + ", " + (savedSets.margin.bottom - 10) + ")");

                            //yAxis
                            SVGFactory.appendYAxis(svg, savedSets.margin, savedSets.height, yAxis, savedSets.yAxisLabel, savedSets.yAxisLabelSize);

                            let yData = svg.selectAll("yData")
                                .data(filteredValues)
                                .enter().append("g")
                                .attr("class", "yData"); 

                            yData.append("path")
                                .attr("d", function(d){
                                   
                                    return line(d.values);
                                })
                                .attr('fill', 'none')
                                .attr("data-legend",function(d) { 
                                    return d.name
                                })
                                .attr("stroke", function(d, i) {
                                    if(typeof savedSets.color === 'function') return savedSets.color(i)
                                    else return savedSets.color;
                                })
                                .attr("stroke-width", 2);

                           
                            let longestData = 0;
                            filteredValues.forEach( obj => {
                                  let currentLength = obj.name.toString().length;
                                  if (currentLength > longestData) longestData = currentLength;
                            }); 

                            if (longestData < 7) longestData = 7;

                            
                                          
                           
                           let legend = svg.selectAll(".legend")
                                    .data(savedSets.color.domain())
                                    .enter().append("g")
                                        .attr("class", "legend")
                                        .attr("transform", function(d, i) { 
                                            return "translate(30," + (i * 15) + ")";
                                        })
                                        .attr('opacity', 0.7);

                            SVGFactory.appendLegend(legend, filteredValues, savedSets, longestData);      

                            SVGFactory.appendTitle(svg, savedSets.margin, savedSets.width, savedSets.title, savedSets.titleSize);
                            

                    });
                };
            });
        }
    };
});
