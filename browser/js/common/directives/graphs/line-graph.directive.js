app.directive('lineGraph', function(d3Service, $window, $state) {
    return {
        restrict: 'E',
        scope: {
            rows: "=",
            seriesx: "=",
            seriesy: "=",
            settings: "=",
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

                scope.$watch(function(scope) {
                    return scope.settings;
                }, function() {
                    scope.render();
                }, true);

                scope.$watch(function(scope) {
                    return scope.seriesx;
                }, function() {
                    scope.render();
                }, true);

                scope.$watch(function(scope) {
                    return scope.seriesy;
                }, function() {
                    scope.render();
                }, true);

                scope.render = function() {
                    let formatDate, dateFormat;
                    if (scope.seriesx[0].type === 'date') {
                        let commonDateFormats = ["%Y", "%Y-%y", "%x", "%m-%d-%Y", "%m.%d.%Y", "%m/%d/%y", "%m-%d-%y", "%m.%d.%y", "%Y/%m/%d", "%Y-%m-%d", "%Y.%m.%d", "%xT%X", "%m-%d-%YT%X", "%m.%d.%YT%X", "%m/%d/%yT%X", "%m-%d-%yT%X", "%m.%d.%yT%X", "%Y-%m-%dT%X", "%Y/%m/%dT%X", "%Y.%m.%dT%X", "%c"];
                        dateFormat = commonDateFormats.filter(f => d3.time.format(f).parse(scope.rows[0][scope.seriesx[0].name]))[0];
                        formatDate = d3.time.format(dateFormat); //d3.time.format("%Y-%y");
                    }

                    let dataObj = {};

                    scope.seriesy.forEach(s => {
                        dataObj[s.name] = [];
                    });
                    
                    scope.rows.forEach(row => {
                        for (let k in row) {
                            if (dataObj[k]) {
                                if (row[scope.seriesx[0].name] && row[k] && (!!Number(row[scope.seriesx[0].name]) || Number(row[scope.seriesx[0].name]) === 0 || scope.seriesx[0].type === 'date')
                                        && (!!Number(row[k]) || Number(row[k]) === 0)) {
                                        if(formatDate)  dataObj[k].push([formatDate.parse(row[scope.seriesx[0].name]), +row[k]]);
                                        else dataObj[k].push([+row[scope.seriesx[0].name], +row[k]]);
                                }
                            };
                        }
                    });

                    if(scope.seriesx[0].type == 'number'){
                        for (let k in dataObj) {
                            dataObj[k] = dataObj[k].sort((a, b) => a[0] - b[0]);
                        }
                    } else {
                        for (let k in dataObj) {
                            dataObj[k] = dataObj[k].sort((a, b) => a[0].getTime() - b[0].getTime());
                        }
                    }

                    let anchor = d3.select(ele[0])
                    anchor.selectAll('*').remove();

                    let xLabelLength = dataObj[scope.seriesy[0].name].reduce(function (prev, current) {
                            let currentLength = current[0].toString().length;
                            return currentLength > prev ? currentLength : prev;
                        }, 0),
                    yLabelLength = 0;
                    // yLabelLength = filteredData.reduce(function (prev, current) {
                    //     let currentLength = Math.floor(current[scope.columns[1].name]).toString().length;
                    //     return currentLength > prev ? currentLength : prev;
                    // }, 0);
                    for (let k in dataObj){
                        dataObj[k].forEach(function(elem){
                            let currentLength = elem[1].toString().length;
                            if(currentLength > yLabelLength) yLabelLength = currentLength;
                        })
                    }

                    let formatColX = scope.seriesx[0].name.replace(/\_+/g, " "),
                        formatColY = "y-axis", //scope.columns[1].name.replace(/\_+/g, " ")
                        margin = { 
                            top: 30,
                            right: 20,
                            bottom: (xLabelLength + 6) * 5,
                            left: (yLabelLength + 6) * 7,
                        },
                        width = scope.settings.width || ele[0].parentNode.offsetWidth,
                        height = scope.settings.height || 500,
                        xAxisLabel = scope.settings.xAxisLabel || formatColX,
                        yAxisLabel = scope.settings.yAxisLabel || formatColY,
                        title = scope.settings.title || (formatColX + " .vs " + formatColY).toUpperCase(),
                        svg = anchor
                        .append('svg')
                        .style('width', width)
                        .style('height', height)
                        .style('background-color', '#ffffff')
                        .append("g");

                    //check if the data column header may contain date info ??
                    let x;                        // dateFormat,
                        // data;


                        // for(let k in dataObj){
                        //     dataObj[k].forEach(function(dataSet){

                        //     })
                        // }

                    //     data = [];
                    //     filteredData.forEach(function(element) {
                    //         let obj = {};
                    //         obj[scope.seriesx[0].name] = formatDate.parse(element[scope.columns[0].name]);
                    //         obj[scope.columns[1].name] = element[scope.columns[1].name];
                    //         data.push(obj);
                    //     });

                    //     data = data.sort((a, b) => a[scope.columns[0].name].getTime() - b[scope.columns[0].name].getTime());
                        
                    //     x = d3.time.scale().range([margin.left, width - margin.right]);
                    // } else if (scope.columns[0].type === 'number') {
                    //     x = d3.scale.linear().range([margin.left, width - margin.right]);
                    //     data = [];
                    //     filteredData.forEach(function(element) {
                    //         let obj = {};
                    //         obj[scope.columns[0].name] = +(element[scope.columns[0].name]);
                    //         obj[scope.columns[1].name] = element[scope.columns[1].name];
                    //         data.push(obj);
                    //     });
                    // } else {
                    //     return;
                    // }

                    let y = d3.scale.linear()
                        .range([height - margin.bottom, margin.top]);

                    let xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    let yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    let line = d3.svg.line()
                        .x(function(d) {
                            return x(d[scope.columns[0].name]);
                        })
                        .y(function(d) {
                            return y(+d[scope.columns[1].name]);
                        });

                    // If we don't pass any data, return out of the element
                    if (!data) return;

                    //Need a better way to adjust minX and maxX if based on date


                    let color = scope.settings.color || "steelblue",
                        minX = (typeof scope.settings.minX === 'number') ? scope.settings.minX : d3.min(data, function(d) {
                            return d[scope.columns[0].name];
                        }),
                        maxX = (typeof scope.settings.maxX === 'number') ? scope.settings.maxX : d3.max(data, function(d) {
                            return d[scope.columns[0].name];
                        }),
                        minY = (typeof scope.settings.minY === 'number') ? scope.settings.minY : d3.min(data, function(d) {
                            return +d[scope.columns[1].name];
                        }),
                        maxY = (typeof scope.settings.maxY === 'number') ? scope.settings.maxY : d3.max(data, function(d) {
                            return +d[scope.columns[1].name];
                        });

                    x.domain([minX, maxX]);
                    y.domain([minY, maxY]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("class", "xlabel")
                        .text(xAxisLabel);

                    svg.select(".xlabel")
                        .attr("transform", "translate(" + (width - margin.left - margin.right) / 2 + ", " + (margin.bottom - 10) + ")");

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + margin.left + ",0)")
                        .call(yAxis)
                        .append("text")
                        .attr("class", "ylabel")
                        .attr("transform", "rotate(-90)translate(" + -((height + margin.bottom + margin.top) / 2) + ", " + -(margin.left - 20) + ")")
                        .text(yAxisLabel);

                    svg.append("path")
                        .datum(data)
                        .attr("d", line)
                        .attr('fill', 'none')
                        .attr("stroke", color)
                        .attr("stroke-width", 2);

                    svg.append("text")
                        .attr("x", (width / 2))             
                        .attr("y", margin.top/2)
                        .attr("text-anchor", "middle")    
                        .text(title);
                };
            });
        }
    };
});
