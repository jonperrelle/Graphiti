
app.directive('barChart', function(d3Service, graphSettingsFactory, SVGFactory) {
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

                        graphSettingsFactory.getSavedSettings(scope.settings, ele[0], scope.rows)
                            .then(function (savedSets) {
                                let defaultSettings = graphSettingsFactory.getDefaultSettings();
                                let svg = SVGFactory.appendSVG(anchor, savedSets.width, savedSets.height);



                                let barSpace = 0.1,
                               
                                tooMuchData = scope.rows[0].values.length > 50; //this can be replaced. 
                                
                                

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
                                    .rangeBands([0, savedSets.width - defaultSettings.margin.left - defaultSettings.margin.right], barSpace);

                                let x2Scale = d3.scale.ordinal();

                                let yScale = d3.scale.linear()
                                    .range([savedSets.height - defaultSettings.margin.bottom, defaultSettings.margin.top]);

                                let xAxis = d3.svg.axis()
                                    .scale(x1Scale)
                                    .orient("bottom");

                                let yAxis = d3.svg.axis()
                                    .scale(yScale)
                                    .orient("left");

                                let xAxisNames = [],
                                groupCats = []
                                scope.rows.forEach(obj => {
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
                                //     .attr("transform", "translate(" + defaultSettings.margin.left + ", " + (savedSets.height - defaultSettings.margin.bottom) + ")")
                                //     .call(xAxis)
                                //     .append("text")
                                //     .attr("class", "xlabel")
                                //     .text(savedSets.xAxisLabel);
                                SVGFactory.appendXAxis(svg, defaultSettings.margin, savedSets.width, savedSets.height, xAxis, savedSets.xAxisLabel, savedSets.xAxisLabelSize);

                                svg.selectAll(".x text")
                                    .attr("transform", "translate(-7,0)rotate(-45)")
                                    .style("text-anchor", "end");

                                svg.select(".xlabel")
                                     .attr("transform", "translate(" + ((savedSets.width - defaultSettings.margin.left - defaultSettings.margin.right) / 2) + ", " + (defaultSettings.margin.bottom - savedSets.xAxisLabelSize) + ")")
                                     .style("text-anchor", "middle")
                                     .style("font-size", savedSets.xAxisLabelSize);

                                SVGFactory.appendYAxis(svg, defaultSettings.margin, savedSets.height, yAxis, savedSets.yAxisLabel, savedSets.yAxisLabelSize);

                                // svg.append("g")
                                //     .attr("class", "y axis")
                                //     .attr("transform", "translate(" + defaultSettings.margin.left + ",0)")
                                //     .call(yAxis)
                                //     .append("text")
                                //     .attr("class", "ylabel")
                                //     .attr("transform", "rotate(-90)translate(" + -((savedSets.height - defaultSettings.margin.bottom) / 2) + ", " + -(defaultSettings.margin.left - savedSets.yAxisLabelSize) + ")")
                                //     .text(savedSets.yAxisLabel)
                                //     .style("text-anchor", "middle")
                                //     .style("font-size", savedSets.yAxisLabelSize);


                                var yData = svg.selectAll("yData")
                                    .data(scope.rows)
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
                                    .attr("width", tooMuchData ? 10 : x2Scale.rangeBand())
                                    .attr("y", function(d) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return savedSets.height - defaultSettings.margin.bottom - yScale(d[1]);
                                    })
                                    .attr("fill", function(d, i) {
                                            if(typeof savedSets.color === 'function') return savedSets.color(i)
                                            else return savedSets.color;
                                        })
                                    .attr("transform", "translate(" + defaultSettings.margin.left + ", 0)");

                                SVGFactory.appendTitle(svg, defaultSettings.margin, savedSets.width, savedSets.title, savedSets.titleSize);
                                // svg.append("text")
                                //     .attr("x", (savedSets.width / 2))             
                                //     .attr("y", (defaultSettings.margin.top / 2))
                                //     .attr("text-anchor", "middle") 
                                //     .style("font-size", savedSets.titleSize)
                                //     .text(savedSets.title);

                    });
                };
            });
        }
    };
});
