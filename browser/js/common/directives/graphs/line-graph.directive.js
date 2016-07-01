app.directive('lineGraph', function(d3Service, $window) {
    return {
        restrict: 'E',
        scope: {
            rows: "=",
            columns: "=",
            settings: "="
        },
        link: function(scope, ele, attrs) {

            d3Service.d3().then(function(d3) {
                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };

                // Watch for resize event
                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render();
                });

                scope.$watch(function (scope) {
                    return scope.columns[0].name;
                  }, function () {
                    scope.render();
                  });

                  scope.$watch(function (scope) {
                    return scope.columns[1].name;
                  }, function () {
                    scope.render();
                  });

                scope.render = function() {
                    let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] && obj[scope.columns[1].name]).sort((a,b) => a[scope.columns[0].name] - b[scope.columns[0].name]);

                    let anchor = d3.select(ele[0])
                    anchor.selectAll('*').remove();

                    let margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = (scope.settings.width || ele[0].parentNode.offsetWidth) - margin.left - margin.right,
                    height = (scope.settings.height || width) - margin.top - margin.bottom,
                    xAxisLabel = scope.settings.xAxisLabel || scope.columns[0].name,
                    yAxisLabel = scope.settings.yAxisLabel || scope.columns[1].name,
                    svg = anchor
                    .append('svg')
                        .style('width', width + margin.left + margin.right)
                        .style('height', height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    //check if the data column header may contain date info ??
                    let x,
                        dateFormat,
                        data;
                    if (scope.columns[0].type === 'date') {
                        //if so validate the format of the date

                        //run date checking function
                        let commonDateFormats = ["%Y", "%Y-%y", "%x", "%xT%X", "%Y-%m-%dT%H:%M:%S"];

                        dateFormat = commonDateFormats.filter(f => d3.time.format(f).parse(filteredData[0][scope.columns[0].name]))[0];
                        let formatDate = d3.time.format(dateFormat); //d3.time.format("%Y-%y");
                        data = [];
                        filteredData.forEach(function(element){
                            let obj = {};
                            obj[xAxisLabel] = formatDate.parse(element[xAxisLabel]);
                            obj[yAxisLabel] = element[yAxisLabel]
                            data.push(obj);
                        });
                        x = d3.time.scale().range([0, width]);
                    } else if (scope.columns[0].type === 'number'){
                        x = d3.scale.linear().range([0, width]);
                        data = [];
                        filteredData.forEach(function(element){
                            let obj = {};
                            obj[xAxisLabel] = +(element[xAxisLabel]);
                            obj[yAxisLabel] = element[yAxisLabel];
                            data.push(obj);
                        });
                    } else {
                        return; 
                    }

                    let y = d3.scale.linear()
                        .range([height, 0]);

                    let xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    let yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    let line = d3.svg.line()
                        .x(function(d) {
                            return x( d[xAxisLabel] );
                        })
                        .y(function(d) {
                            return y(+d[yAxisLabel]);
                        });

                    // If we don't pass any data, return out of the element
                    if (!data) return; 

                    let color = scope.settings.color || "steelblue",
                        minX = scope.settings.minX || d3.min(data, function(d) { return d[xAxisLabel]; }),
                        maxX = scope.settings.minX || d3.max(data, function(d) { return d[xAxisLabel]; }),
                        minY = scope.settings.minY || d3.min(data, function(d) { return +d[yAxisLabel]; }),
                        maxY = scope.settings.maxY || d3.max(data, function(d) { return +d[yAxisLabel]; });

                    // x.domain(d3.extent(data, function(d) { return d[xAxisLabel]; 
                    // }));
                    // y.domain([0, d3.max(data, function(d) {
                    //     return +d[yAxisLabel];
                    // })]);

                    x.domain([minX, maxX]);
                    y.domain([minY, maxY]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(xAxisLabel);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(yAxisLabel);

                    svg.append("path")
                        .datum(data)
                        .attr("class", "line")
                        .attr("d", line);
                };
            });
        }
    };
});
