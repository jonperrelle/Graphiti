app.directive('lineGraph', function(d3Service, $window, $state, GraphFilterFactory, graphSettingsFactory) {
    return {
        restrict: 'E',
        scope: {
            rows: "=",
            seriesx: "=",
            seriesy: "=",
            settings: "=",
            rerender: '='
        },
        link: function(scope, ele, attrs) {


            d3Service.d3().then(function(d3) {

                // Browser onresize event
                // window.onresize = function() {
                //     scope.$apply();
                // };

                // Watch for resize event
                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render();
                });

                scope.$watch(function(scope) {
                    return scope.rows; 
                }, function(newVal, oldVal) {
                    if (newVal !== oldVal) scope.render();
                }, true);

                scope.$watch(function(scope) {
                    return scope.settings; 
                }, function(newVal, oldVal) {
                    if (newVal !== oldVal) scope.render();
                }, true);

                scope.$watch(function(scope) {
                    return scope.seriesx;
                }, function() {
                    scope.render();
                }, true);

                // scope.$watch(function(scope) {
                //     return scope.seriesy;
                // }, function() {
                //     scope.render();
                // }, true);

                scope.render = function() {   

                    let anchor = d3.select(ele[0])
                    anchor.selectAll('*').remove();                        

                    graphSettingsFactory.getSavedSettings(scope.settings, ele[0], scope.rows)
                        .then(function (savedSets) {
                            let defaultSettings = graphSettingsFactory.getDefaultSettings();
                            let svg = anchor
                                .append('svg')
                                .style('width', savedSets.width)
                                .style('height', savedSets.height)
                                .style('background-color', '#ffffff')
                                .append("g");

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

                            svg.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + (savedSets.height - defaultSettings.margin.bottom) + ")")
                                .call(xAxis)
                                .append("text")
                                .attr("class", "xlabel")
                                .text(savedSets.xAxisLabel);

                            svg.select(".xlabel")
                                .attr("transform", "translate(" + (savedSets.width - defaultSettings.margin.left - defaultSettings.margin.right) / 2 + ", " + (defaultSettings.margin.bottom - 10) + ")");

                            svg.append("g")
                                .attr("class", "y axis")
                                .attr("transform", "translate(" + defaultSettings.margin.left + ",0)")
                                .call(yAxis)
                                .append("text")
                                .attr("class", "ylabel")
                                .attr("transform", "rotate(-90)translate(" + -((savedSets.height + defaultSettings.margin.bottom + defaultSettings.margin.top) / 2) + ", " + -(defaultSettings.margin.left - 20) + ")")
                                .text(savedSets.yAxisLabel);

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

                            svg.append("text")
                                .attr("x", (savedSets.width / 2))             
                                .attr("y", defaultSettings.margin.top/2)
                                .attr("text-anchor", "middle")    
                                .text(savedSets.title);
                            
                    });
                };
            });
        }
    };
});
