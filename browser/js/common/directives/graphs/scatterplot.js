app.directive('scatterplotGraph', function(d3Service, $window, GraphFilterFactory, graphSettingsFactory) {
    let directive = {};

    directive.restrict = 'E';
    directive.scope = {
        rows: '=',
        seriesx: '=',
        seriesy: '=',
        settings: '='
    };
    directive.link = linkFn;

    return directive;


    function linkFn(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
            
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


            scope.render = function() {

                let anchor = d3.select(ele[0])
                anchor.selectAll('*').remove();

                graphSettingsFactory.getSavedSettings(scope.settings, ele[0], scope.rows)
                    .then(function (savedSets) {
                            let svg = anchor
                                .append('svg')
                                .attr('width', savedSets.width)
                                .attr('height', savedSets.height)
                                .style('background-color', '#ffffff')
                                // .call(zoom);

                            let xValue = function(d) {
                                    return d[0]
                                }, // data -> value
                                xScale = d3.scale.linear()
                                .range([savedSets.margin.left, savedSets.width - savedSets.margin.right]), // value -> display
                                xMap = function(d) {
                                    
                                    return xScale(xValue(d))
                                }, // data -> display
                                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                            let yValue = function(d) {
                                    return d[1]
                                }, // data -> value
                                yScale = d3.scale.linear().range([savedSets.height - savedSets.margin.bottom, savedSets.margin.top]), // value -> display
                                yMap = function(d) {
                                    return yScale(yValue(d))
                                }, // data -> display
                                yAxis = d3.svg.axis().scale(yScale).orient("left");

                            let filteredValues = GraphFilterFactory.setBounds(savedSets, scope.rows);
                            let cValue = function(d) {
                                    return d
                            };
                            
                            // add the tooltip area to the webpage
                            let tooltip = d3.select("body").append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

                            xScale.domain([savedSets.minX, savedSets.maxX]);
                            yScale.domain([savedSets.minY, savedSets.maxY]);

                            // x-axis
                            svg.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + (savedSets.height - savedSets.margin.bottom) + ")")
                                .call(xAxis)
                                .append("text")
                                .attr("class", "xlabel")
                                .style("font-size", savedSets.xAxisTitleSize)
                                .text(savedSets.xAxisLabel);

                            // svg.selectAll(".x text")
                            //     .attr("transform", "translate(-10, 0)rotate(-45)")
                            //     .style("text-anchor", "end");

                            svg.select(".xlabel")
                                    .attr("transform", "translate(" + (savedSets.width - savedSets.margin.left - savedSets.margin.right) / 2 + ", " + (savedSets.margin.bottom - 10) + ")");

                            // y-axis
                            svg.append("g")
                                .attr("class", "y axis")
                                .attr("transform", "translate(" + savedSets.margin.left + ",0)")
                                .call(yAxis)
                                .append("text")
                                .attr("class", "ylabel")
                                .attr("transform", "rotate(-90)translate(" + -((savedSets.height + savedSets.margin.bottom + savedSets.margin.top) / 2) + ", " + -(savedSets.margin.left - 20) + ")")
                                .style("font-size", savedSets.yAxisTitleSize)
                                .text(savedSets.yAxisLabel);

                            // draw 
                            
                           // let yData = svg.selectAll("yData")
                           //      .data(filteredValues)
                           //      .enter().append("g")
                           //      .attr("class", "yData");  

                            let dotRadius = savedSets.height/100;

                            filteredValues.forEach( (obj, idx) => {
                                let dots = svg.selectAll(".dot" + idx)
                                    .data(obj.values)
                                    .enter().append("circle")
                                    .attr("class", "dot")
                                    .attr("r", dotRadius)
                                    .attr("cx", d =>  {
                                        
                                        return xMap(d)})
                                    .attr("cy", d => yMap(d))
                                    .attr("fill", function(d) {

                                        if(typeof savedSets.color === 'function') return savedSets.color(idx);
                                        else return savedSets.color;
                                    })
                                    .on("mouseover", function(d) {
                                        tooltip.transition()
                                            .duration(200)
                                            .style("opacity", .9);
                                        tooltip.html(obj.name + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                                            .style("left", (d3.event.pageX + 5) + "px")
                                            .style("top", (d3.event.pageY - 28) + "px");
                                    })
                                    .on("mouseout", function(d) {
                                        tooltip.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                    });
                            });

                            svg.append("text")
                                .attr("x", (savedSets.width / 2))             
                                .attr("y", (savedSets.margin.top/1.5))
                                .attr("text-anchor", "middle") 
                                .style("font-size", savedSets.titleSize)   
                                .text(savedSets.title);
                    })

              
               
            };
        });
    };
});
