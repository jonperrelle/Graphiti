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
                    // xLabelLength = scope.rows.reduce(function (prev, current) {
                    //     let currentLength = current[scope.seriesx[0].name].toString().length;
                    //     return currentLength > prev ? currentLength : prev;
                    // }, 0);
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
                    let yLabelLength = 0,
                    xLabelLength = 3;                    // yLabelLength = filteredData.reduce(function (prev, current) {
                    //     let currentLength = Math.floor(current[scope.columns[1].name]).toString().length;
                    //     return currentLength > prev ? currentLength : prev;
                    // }, 0);
                    for (let k in dataObj){
                        dataObj[k].forEach(function(elem){
                            let currentLength = elem[1].toString().length;
                            if(currentLength > yLabelLength) yLabelLength = currentLength;
                        });
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
                        color = scope.settings.color || d3.scale.category10(),
                        svg = anchor
                        .append('svg')
                        .style('width', width)
                        .style('height', height)
                        .style('background-color', '#ffffff')
                        .append("g");

                    //check if the data column header may contain date info ??
                    let x; 
                        // dateFormat,
                        // data;
                    if(scope.seriesx[0].type == 'number') x = d3.scale.linear().range([margin.left, width - margin.right]);
                    else x = d3.time.scale().range([margin.left, width - margin.right]);  

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
                            return x(d[0]);
                        })
                        .y(function(d) {
                            return y(d[1]);
                        });

                    let minX,
                    maxX,
                    minY,
                    maxY,
                    values = d3.values(dataObj);
                    values.forEach(function (arr) {
                        let tempMin = d3.min(arr, function(d) {return d[0]});
                        let tempMax = d3.max(arr, function(d) {return d[0]});
                        if(tempMin < minX || typeof minX === 'undefined') minX = tempMin;
                        if(tempMax > maxX || typeof maxX === 'undefined') maxX = tempMax;
                    });
                    values.forEach(function (arr) {
                        let tempMin = d3.min(arr, function(d) {return d[1]});
                        let tempMax = d3.max(arr, function(d) {return d[1]});
                        if(tempMin < minY || typeof minY === 'undefined') minY = tempMin;
                        if(tempMax > maxY || typeof maxY === 'undefined') maxY = tempMax;
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


                    let yData = svg.selectAll("yData")
                        .data(values)
                        .enter().append("g")
                        .attr("class", "yData"); 

                    yData.append("path")
                        .attr("d", function(d){
                                return line(d)
                            })
                        .attr('fill', 'none')
                        .attr("stroke", function(d, i) {
                                if(typeof color === 'function') return color(i)
                                else return color;
                        })//color.domain())
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
