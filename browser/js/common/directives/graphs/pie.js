app.directive('pieChart', function(d3Service, $window, DataFactory, graphSettingsFactory) {

    return {
        restrict: 'E',
        scope: {
            rows: "=",
            columns: "=",
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
                                let defaultSettings = graphSettingsFactory.getDefaultSettings();
                                let svg = anchor
                                        .append('svg')
                                        .attr('width', savedSets.width)
                                        .attr('height', savedSets.height)
                                        .style('background-color', '#ffffff')
                                        .append('g')
                                        .attr("transform", "translate(" + savedSets.width / 2 + "," + savedSets.height / 2 + ")");

                                let groupedValues = DataFactory.groupByCategory(scope.rows, scope.seriesx, scope.seriesy, savedSets.groupType);

                                let groupedTotal = 0;
                                groupedValues[0].values.forEach( a => groupedTotal += a[1]);
                                
                                 
                                let pie = d3.layout.pie().value(function(d) {
                                    console.log(d);
                                    return d[1];
                                });

                                let arc = d3.svg.arc().outerRadius(savedSets.radius);

                                let pieChart = svg.selectAll(".arc")
                                    .data(pie(groupedValues[0].values))
                                    .enter().append("g")
                                    .attr("class", "arc");

                                 
                                pieChart.append("path")
                                      .attr("d", arc)
                                      .style("fill", function(d, i) { return savedSets.color(i); })

                                pieChart.append("text")
                                    .attr("x", 0)             
                                    .attr("y", (savedSets.radius * -1.5) + defaultSettings.margin.top/2)
                                    .attr("text-anchor", "middle")    
                                    .text(savedSets.title);

                    

                                let legendDisplay = (type, data) => {
                                    if (type === 'percentage') return ((data/groupedTotal) * 100).toFixed(2) + "%";
                                    else return data;
                                };


                                let legend = svg.selectAll(".legend")
                                    .data(savedSets.color.domain())
                                    .enter().append("g")
                                        .attr("class", "legend")
                                        .attr("transform", function(d, i) { 
                                            return "translate(" + 0 + "," + i * 20 + ")" 
                                        });

                                // draw legend colored rectangles
                                legend.append("rect")
                                    .attr("x", -savedSets.width - defaultSettings.margin.left/2)
                                    .attr("y", (savedSets.radius * -1.5) + defaultSettings.margin.top/2)
                                    .attr("width", savedSets.width/100)
                                    .attr("height", savedSets.height/100)
                                    .style("fill", savedSets.color);

                                // draw legend text
                                legend.append("text")
                                    .attr("x", -savedSets.width/2)
                                    .attr("y", (savedSets.radius * -1.5) + defaultSettings.margin.top/2 + savedSets.height/100)
                                    .text(function(d, i) { 
                                        return 'text';
                                        // return groupedData[i][scope.columns[0].name] + " - " + legendDisplay(savedSets.displayType, +groupedData[i][scope.columns[1].name]);
                                    });
                    });
                };
                    
            });
        }
    };
});
