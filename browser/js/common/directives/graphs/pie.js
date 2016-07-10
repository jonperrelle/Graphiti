app.directive('pieChart', function(d3Service, $window, DataFactory, graphSettingsFactory) {

    return {
        restrict: 'E',
        scope: {
            rows: "=",
            seriesx: "=",
            seriesy: "=",
            settings: "="
        },

        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {
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
                        let anchor = d3.select(ele[0]);
                        anchor.selectAll('*').remove();

                        graphSettingsFactory.getSavedSettings(scope.settings, ele[0], scope.rows)
                            .then(function (savedSets) {
                                //let defaultSettings = graphSettingsFactory.getDefaultSettings();
                                    let svg = anchor
                                        .append('svg')
                                        .attr('width', savedSets.width)
                                        .attr('height', savedSets.height)
                                        .style('background-color', '#ffffff')




                        let groupedData = DataFactory.groupByCategory(scope.rows, scope.seriesx, scope.seriesy, savedSets.groupType);
                        console.log(groupedData);       

                        let groupedTotal = 0;
                        groupedData.forEach( a => groupedTotal += a[scope.seriesx[1].name]);
                        //uses build in d3 method to create color scale
                        let color;
                        let setColor = colorScale => {
                            switch (colorScale) {
                                case '10':
                                    color = d3.scale.category10();
                                    break;
                                case '20b':
                                    color = d3.scale.category20b();
                                    break;
                                case '20c':
                                    color = d3.scale.category20c();
                                    break;
                                default:
                                    color = d3.scale.category20();
                            }
                        };
                        
                        setColor(scope.settings.color);

                        
                            
                        svg.data([groupedData])
                            .append("g")
                            .attr("transform", "translate(" + (width / 1.75) + "," + (radius *1.5) + ")");
                        let pie = d3.layout.pie().value(function(d) {
                            return +d[scope.columns[1].name];
                        });

                        // declare an arc generator function
                        let arc = d3.svg.arc().outerRadius(radius);
                     
                        // select paths, use arc generator to draw
                        let arcs = svg.selectAll("g.slice")
                            .data(pie)
                            .enter()
                            .append("g")
                            .attr("class", "slice");

                        arcs.append("path")
                            .attr("fill", function(d, i) {
                                return color(i);
                            })
                            .attr("d", arc);

                        arcs.forEach(function () {

                        });

                        svg.append("text")
                            .attr("x", 0)             
                            .attr("y", (radius * -1.5) + savedSets.margin.top/2)
                            .attr("text-anchor", "middle")    
                            .style("font-size", savedSets.titleSize) 
                            .text(title);

                        //add the text
                        // arcs.append("text").attr("transform", function(d) {
                        //     d.innerRadius = radius+100;
                        //     d.outerRadius = radius+100;
                        //     return "translate(" + arc.centroid(d) + ")";
                        // }).attr("text-anchor", "middle").text(function(d, i) {
                        //     return groupedData[i][scope.columns[1].name];
                        // });

                        let legendDisplay = (type, data) => {
                            if (type === 'percentage') return ((data/groupedTotal) * 100).toFixed(2) + "%";
                            else return data;
                        };


                        let legend = svg.selectAll(".legend")
                            .data(color.domain())
                            .enter().append("g")
                                .attr("class", "legend")
                                .attr("transform", function(d, i) { 
                                    return "translate(" + 0 + "," + i * 20 + ")" 
                                });

                        // draw legend colored rectangles
                        legend.append("rect")
                            .attr("x", -width/2 - margin.left/2)
                            .attr("y", (radius * -1.5) + margin.top/2)
                            .attr("width", width/100)
                            .attr("height", height/100)
                            .style("fill", color);

                        // draw legend text
                        legend.append("text")
                            .attr("x", -width/2)
                            .attr("y", (radius * -1.5) + margin.top/2 + height/100)
                            .style("font-size", savedSets.xAxisTitleSize) 
                            .text(function(d, i) { 
                                return groupedData[i][scope.columns[0].name] + " - " + legendDisplay(displayType, +groupedData[i][scope.columns[1].name]);
                            });

                    });
                };
                    
            });
        }
    };
});
