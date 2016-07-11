
app.directive('barChart', function(d3Service, graphSettingsFactory, DataFactory, SVGFactory) {
    return {
        restrict: 'E',
        scope: {
            rows: "=",
            seriesx: "=",
            seriesy: '=',
            settings: "="
        },
        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {
   
                // Watch for resize event

                SVGFactory.watchForChanges(scope);
                
                scope.render = function() {

                    if (!scope.seriesy) return;

                    let anchor = d3.select(ele[0]);
                        anchor.selectAll('*').remove();
                    let values = [];
                    let tooMuchData = scope.rows.length > 50;
                    if (scope.settings.groupType === 'mean') values = DataFactory.groupByMean(scope.rows);
                    else values = scope.rows;

                        graphSettingsFactory.getSavedSettings(scope.settings, ele[0], values, null, tooMuchData)
                            .then(function (savedSets) {
                                
                                let svg = SVGFactory.appendSVG(anchor, savedSets.width, savedSets.height);

                                let barSpace = 0.1;

                                // let xLabelLength = groupedData.reduce(function (prev, current) {
                                //         let currentLength = current[scope.columns[0].name].toString().length;
                                //         return currentLength > prev ? currentLength : prev;
                                //     }, 0),
                                //     yLabelLength = groupedData.reduce(function (prev, current) {
                                //         let currentLength = Math.floor(current[scope.columns[1].name]).toString().length;
                                //         return currentLength > prev ? currentLength : prev;
                                //     }, 0);

                                //create the rectangles for the bar chart
                                let x1Scale = d3.scale.ordinal()
                                    .rangeBands([0, savedSets.width - savedSets.margin.left - savedSets.margin.right], barSpace);

                                let x2Scale = d3.scale.ordinal();

                                let yScale = d3.scale.linear()
                                    .range([savedSets.height - savedSets.margin.bottom, savedSets.margin.top]);

                                let xAxis = d3.svg.axis()
                                    .scale(x1Scale)
                                    .orient("bottom");

                                let yAxis = d3.svg.axis()
                                    .scale(yScale)
                                    .orient("left");

                                let xAxisNames = [],
                                groupCats = []
                                values.forEach(obj => {
                                    xAxisNames.push(obj.name);
                                    obj.values.forEach(arr => {
                                        if (groupCats.indexOf(arr[0]) === -1) groupCats.push(arr[0]);
                                    });
                                });

                                x1Scale.domain(xAxisNames);
                                x2Scale.domain(groupCats).rangeRoundBands([0, x1Scale.rangeBand()]);
                                yScale.domain([savedSets.minY, savedSets.maxY]);

                                // svg.append("g")
                                //     .attr("class", "x axis")
                                //     .attr("transform", "translate(" + savedSets.margin.left + ", " + (savedSets.height - savedSets.margin.bottom) + ")")
                                //     .call(xAxis)
                                //     .append("text")
                                //     .attr("class", "xlabel")
                                //     .text(savedSets.xAxisLabel);
                                SVGFactory.appendXAxis(svg, savedSets.margin, savedSets.width, savedSets.height, xAxis, savedSets.xAxisLabel, savedSets.xAxisTitleSize);

                                SVGFactory.appendYAxis(svg, savedSets.margin, savedSets.height, yAxis, savedSets.yAxisLabel, savedSets.yAxisTitleSize);

                                // svg.append("g")
                                //     .attr("class", "y axis")
                                //     .attr("transform", "translate(" + savedSets.margin.left + ",0)")
                                //     .call(yAxis)
                                //     .append("text")
                                //     .attr("class", "ylabel")
                                //     .attr("transform", "rotate(-90)translate(" + -((savedSets.height - savedSets.margin.bottom) / 2) + ", " + -(savedSets.margin.left - savedSets.yAxisLabelSize) + ")")
                                //     .text(savedSets.yAxisLabel)
                                //     .style("text-anchor", "middle")
                                //     .style("font-size", savedSets.yAxisLabelSize);


                                var yData = svg.selectAll("yData")
                                    .data(values)
                                    .enter().append("g")
                                    .attr("class", "yData")
                                    .attr("transform", function(d) { 
                                        return "translate(" + x1Scale(d.name) + ",0)"; 
                                    });

                                 yData.selectAll(".bar")
                                    .data(d =>  {
                                        return d.values;
                                    })
                                    .enter().append("rect")
                                    .attr("class", "bar")
                                    .attr("x", function(d) {
                                        return x2Scale(d[0]); })
                                    .attr("width", tooMuchData ? 10/scope.seriesy.length : x2Scale.rangeBand())
                                    .attr("y", function(d) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return savedSets.height - savedSets.margin.bottom - yScale(d[1]);
                                    })
                                    .attr("fill", function(d, i) {
                                            if(typeof savedSets.color === 'function') return savedSets.color(i)
                                            else return savedSets.color;
                                        })
                                    .attr("transform", "translate(" + savedSets.margin.left + ", 0)");

                                
                                let longestData = 0;
                                scope.seriesy.forEach( arr => {
                                      let currentLength = arr.name.toString().length;
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
                           
                                SVGFactory.appendLegend(legend, scope.seriesy, savedSets, longestData);

                                SVGFactory.appendTitle(svg, savedSets.margin, savedSets.width, savedSets.title, savedSets.titleSize);
                            

                    });
                };
            });
        }
    };
});
