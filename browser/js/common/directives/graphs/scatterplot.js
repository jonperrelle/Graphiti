app.directive('scatterplotGraph', function(d3Service, $window) {
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
            }, function() { scope.render() });

            scope.$watch(function(scope) {
                return scope.settings;
            }, function() { scope.render() }, true);

            scope.$watch(function(scope) {
                return scope.columns;
            }, function() { scope.render() }, true);


            scope.render = function() {

                let anchor = d3.select(ele[0])
                anchor.selectAll('*').remove();

                let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] && obj[scope.columns[1].name] && (!!Number(obj[scope.columns[0].name]) || Number(obj[scope.columns[0].name]) === 0) && (!!Number(obj[scope.columns[1].name]) || Number(obj[scope.columns[1].name]) === 0))
                    .sort((a, b) => a[scope.columns[0].name] - b[scope.columns[0].name]);

                let xLabelLength = filteredData.reduce(function(prev, current) {
                        let currentLength = current[scope.columns[0].name].toString().length;
                        return currentLength > prev ? currentLength : prev;
                    }, 0),
                    yLabelLength = filteredData.reduce(function(prev, current) {
                        let currentLength = Math.floor(current[scope.columns[1].name]).toString().length;
                        return currentLength > prev ? currentLength : prev;
                    }, 0);

                let formatColX = scope.columns[0].name.replace(/\_+/g, " "),
                    formatColY = scope.columns[1].name.replace(/\_+/g, " "),
                    margin = {
                        top: 30,
                        bottom: (xLabelLength + 6) * 5,
                        left: (yLabelLength + 6) * 7,
                        right: 20
                    },
                    width = scope.settings.width || ele[0].parentNode.offsetWidth,
                    height = scope.settings.height || 500,
                    dotRadius = width / 150,
                    xAxisLabel = scope.settings.xAxisLabel || formatColX,
                    yAxisLabel = scope.settings.yAxisLabel || formatColY,
                    title = scope.settings.title || (formatColX + ' vs. ' + formatColY).toUpperCase(),
                    svg = anchor
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .style('background-color', '#ffffff')

                let xValue = function(d) {
                        return +d[scope.columns[0].name];
                    }, // data -> value
                    xScale = d3.scale.linear()
                    .range([margin.left, width - margin.right]), // value -> display
                    xMap = function(d) {
                        return xScale(xValue(d));
                    }, // data -> display
                    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                let yValue = function(d) {
                        return +d[scope.columns[1].name];
                    }, // data -> value
                    yScale = d3.scale.linear().range([height - margin.bottom, margin.top]), // value -> display
                    yMap = function(d) {
                        return yScale(yValue(d));
                    }, // data -> display
                    yAxis = d3.svg.axis().scale(yScale).orient("left");

                let minX = (typeof scope.settings.minX === 'number') ? scope.settings.minX : d3.min(filteredData, xValue);
                let maxX = (typeof scope.settings.maxX === 'number') ? scope.settings.maxX : d3.max(filteredData, xValue);
                let minY = (typeof scope.settings.minY === 'number') ? scope.settings.minY : d3.min(filteredData, yValue);
                let maxY = (typeof scope.settings.maxY === 'number') ? scope.settings.maxY : d3.max(filteredData, yValue);

                filteredData = scope.rows.filter(obj => Number(obj[scope.columns[0].name]) >= minX && Number(obj[scope.columns[0].name]) <= maxX && Number(obj[scope.columns[1].name]) >= minY && Number(obj[scope.columns[1].name]) <= maxY);

                let cValue = function(d) {
                        return d
                    },
                    color = scope.settings.color || 'steelblue';

                // add the tooltip area to the webpage
                let tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                xScale.domain([minX, maxX]);
                yScale.domain([minY, maxY]);

                // x-axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "xlabel")
                    .text(xAxisLabel);

                // svg.selectAll(".x text")
                //     .attr("transform", "translate(-10, 0)rotate(-45)")
                //     .style("text-anchor", "end");
                svg.select(".xlabel")
                    .attr("transform", "translate(" + (width - margin.left - margin.right) / 2 + ", " + (margin.bottom - 10) + ")");

                // y-axis
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.left + ",0)")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "ylabel")
                    .attr("transform", "rotate(-90)translate(" + -((height + margin.bottom + margin.top) / 2) + ", " + -(margin.left - 20) + ")")
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

                svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .text(title);



                let ySeries = filteredData.map(function(d) {
                    return parseFloat(yValue(d));
                });
                let xSeries = filteredData.map(function(d) {
                    //console.log(xValue(d));
                    return parseFloat(xValue(d));
                });





                let leastSquaresCoeff = leastSquares(xSeries, ySeries);

                // apply the reults of the least squares regression
                let x1 = minX;
                let x2 = maxX;



                let y1 = leastSquaresCoeff[0] * minX + leastSquaresCoeff[1];
                let y2 = leastSquaresCoeff[0] * maxX + leastSquaresCoeff[1];

                let trendData = [
                    [x1, y1, x2, y2]
                ];

                let trendline = svg.selectAll(".trendline")
                    .data(trendData);

                trendline.enter()
                    .append("line")
                    .attr("class", "trendline")
                    .attr("x1", function(d) {
                        return xScale(d[0]);
                    })
                    .attr("y1", function(d) {
                        return yScale(d[1]);
                    })
                    .attr("x2", function(d) {
                        return xScale(d[2]);
                    })
                    .attr("y2", function(d) {
                        return yScale(d[3]);
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);

                // svg.append("text")
                //     .text("eq: " + decimalFormat(leastSquaresCoeff[0]) + "x + " +
                //         decimalFormat(leastSquaresCoeff[1]))
                //     .attr("class", "text-label")
                //     .attr("x", function(d) {
                //         return xScale(x2) - 60; })
                //     .attr("y", function(d) {
                //         return yScale(y2) - 30; });

                // // display r-square on the chart
                // svg.append("text")
                //     .text("r-sq: " + decimalFormat(leastSquaresCoeff[2]))
                //     .attr("class", "text-label")
                //     .attr("x", function(d) {
                //         return xScale(x2) - 60; })
                //     .attr("y", function(d) {
                //         return yScale(y2) - 10; });



            };
        });


        function leastSquares(xSeries, ySeries) {

            let reduceSumFunc = function(prev, cur) {
                return prev + cur;
            };

            let xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
            let yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

            let ssXX = xSeries.map(function(d) {
                    return Math.pow(d - xBar, 2);
                })
                .reduce(reduceSumFunc);

            let ssYY = ySeries.map(function(d) {
                    return Math.pow(d - yBar, 2);
                })
                .reduce(reduceSumFunc);

            let ssXY = xSeries.map(function(d, i) {
                    return (d - xBar) * (ySeries[i] - yBar);
                })
                .reduce(reduceSumFunc);

            let slope = ssXY / ssXX;
            let intercept = yBar - (xBar * slope);
            let rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

            return [slope, intercept, rSquare];
        }



    };
});
