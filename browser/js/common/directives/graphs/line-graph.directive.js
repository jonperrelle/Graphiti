app.directive('lineGraph', function(d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
            rows: "=",
            columns: "="
        },
        link: function(scope, ele, attrs) {

            d3Service.d3().then(function(d3) {
                let margin = { top: 20, right: 20, bottom: 30, left: 50 },
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom,
                    dateFormat;

                let svg = d3.select(ele[0])
                        .append('svg')
                        .style('width', '100%')
                        .style('height', "1000px")
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };

                // Watch for resize event
                // scope.$watch(function() {
                //     return angular.element($window)[0].innerWidth;
                // }, function() {
                //     scope.render(filteredData);
                // });

                // scope.$watch(function (scope) {
                //     return scope.columns[0].name;
                //   }, function () {
                //     scope.render(filteredData);
                //   });

                //   scope.$watch(function (scope) {
                //     return scope.columns[1].name;
                //   }, function () {
                //     scope.render(filteredData);
                //   });

                let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] && obj[scope.columns[1].name]).sort((a,b) => a[scope.columns[0].name] - b[scope.columns[0].name]);

                scope.render = function(predata) {
                    svg.selectAll('*').remove();

                    //check if the data column header may contain date info ??
                    let x; 
                    if (scope.columns[0].type === 'date') {
                        //if so validate the format of the date

                        //run date checking function
                        let commonDateFormats = ["%Y", "%Y-%y", "%x", "%xT%X"];

                        dateFormat = commonDateFormats.filter(f => d3.time.format(f).parse(filteredData[0][scope.columns[0].name]))[0];
                        let formatDate = d3.time.format(dateFormat); //d3.time.format("%Y-%y");
                        var data = [];
                        predata.forEach(function(element){
                            let obj = {};
                            obj[scope.columns[0].name] = formatDate.parse(element[scope.columns[0].name]);
                            obj[scope.columns[1].name] = element[scope.columns[1].name]
                            data.push(obj);
                        })
                        x = d3.time.scale().range([0, width]);
                    } else if (scope.columns[0].type === 'number'){
                        x = d3.scale.linear().range([0, width]);
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
                            return x( d[scope.columns[0].name ] );
                        })
                        .y(function(d) {
                            return y(+d[scope.columns[1].name]);
                        });

                    // If we don't pass any data, return out of the element
                    if (!data) return;
                    // set the height based on the calculations above
                    svg.attr('height', height + margin.top + margin.bottom);

                    x.domain(d3.extent(data, function(d) { return d[scope.columns[0].name]; 
                    }));
                    y.domain([0, d3.max(data, function(d) {
                        return +d[scope.columns[1].name];
                    })]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(scope.columns[1].name);

                    svg.append("path")
                        .datum(data)
                        .attr("class", "line")
                        .attr("d", line);
                };
                scope.render(filteredData);
            });
        }
    };
});
