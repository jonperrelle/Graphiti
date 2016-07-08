app.directive('barChart', function(d3Service, DataFactory, SVGFactory) {
    return {
        restrict: 'E',
        scope: {
            rows: "=",
            columns: "=",
            settings: "="
        },
        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {
                //Re-render the graph when user changes settings, data, or window size
                SVGFactory.watchForChanges(scope);

                scope.render = function() {
                    if (!scope.columns) return;

                    let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] 
                        && obj[scope.columns[1].name]
                        && (!!Number(obj[scope.columns[1].name]) || Number(obj[scope.columns[1].name]) === 0));
                    let groupType = scope.settings.groupType || 'total';
                    let orderType = scope.settings.orderType || 'sort'; 
                    let groupedData = DataFactory.groupByCategory(filteredData, scope.columns[0].name, scope.columns[1].name, groupType);
                    groupedData = DataFactory.orderByCategory(groupedData, scope.columns[0].name, scope.columns[0].type, orderType);
                    
                    let tooMuchData = groupedData.length > 50; //this can be replaced. 
                    let anchor = d3.select(ele[0]);
                    anchor.selectAll('*').remove();

                    let xLabelLength = groupedData.reduce(function (prev, current) {
                            let currentLength = current[scope.columns[0].name].toString().length;
                            return currentLength > prev ? currentLength : prev;
                        }, 0),
                        yLabelLength = groupedData.reduce(function (prev, current) {
                            let currentLength = Math.floor(current[scope.columns[1].name]).toString().length;
                            return currentLength > prev ? currentLength : prev;
                        }, 0);

                    let formatColX = scope.columns[0].name.replace(/\_+/g, " "),
                        formatColY = scope.columns[1].name.replace(/\_+/g, " "),
                        graphColor = scope.settings.color || '10',
                        height = scope.settings.height || 500,
                        titleSize = scope.settings.titleSize || height / 35,
                        xAxisLabelSize = scope.settings.xAxisLabelSize || height / 30,
                        yAxisLabelSize = scope.settings.yAxisLabelSize || height / 30,
                        margin = {
                        top: titleSize + 20,
                        right: 20,
                        bottom: ((xLabelLength + 6) * 5) + xAxisLabelSize,
                        left: ((yLabelLength + 6) * 7) + yAxisLabelSize
                        },
                        width = scope.settings.width || (tooMuchData ? margin.left + margin.right + groupedData.length * 15 : ele[0].parentNode.offsetWidth),
                        xAxisLabel = scope.settings.xAxisLabel || formatColX,
                        yAxisLabel = scope.settings.yAxisLabel || formatColY,
                        title = scope.settings.title || (formatColX + ' vs. ' + formatColY).toUpperCase(),
                        barSpace = 0.1;

                    let svg = anchor
                        .append('svg')
                        .style('width', width)
                        .style('height', height)
                        .style('background-color', '#ffffff')
                        .append("g");

                    //create the rectangles for the bar chart
                    let x = d3.scale.ordinal()
                        .rangeBands([0, width - margin.left - margin.right], barSpace);

                    let y = d3.scale.linear()
                        .range([height - margin.bottom, margin.top]);

                    let xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    let yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    let color = SVGFactory.setColor(graphColor);

                    let minY = (typeof scope.settings.minY === 'number') ? scope.settings.minY : 0,
                    maxY = (typeof scope.settings.maxY === 'number') ? scope.settings.maxY : d3.max(groupedData, function(d) {
                            return +d[scope.columns[1].name]; });

                    x.domain(groupedData.map(function(d) {
                        return d[scope.columns[0].name]; }));

                    y.domain([minY, maxY]);

                    SVGFactory.appendXAxis(svg, margin, width, height, xAxis, xAxisLabel, xAxisLabelSize);

                    SVGFactory.appendYAxis(svg, margin, height, yAxis, yAxisLabel, yAxisLabelSize);

                    svg.selectAll(".bar")
                        .data(groupedData)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d) {
                            return x(d[scope.columns[0].name]); })
                        .attr("width", tooMuchData ? 10 : x.rangeBand())
                        .attr("y", function(d) {
                            return y(+d[scope.columns[1].name]);
                        })
                        .attr("height", function(d) {
                            return height - margin.bottom - y(+d[scope.columns[1].name]);
                        })
                        .attr("fill", function(d, i) {
                                if(typeof color === 'function') return color(i);
                                else return color;
                        })
                        .attr("transform", "translate(" + margin.left + ", 0)");

                    SVGFactory.appendTitle(svg, margin, width, title, titleSize);
                };
            });
        }
    };
});
