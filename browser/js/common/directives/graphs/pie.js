app.directive('pieChart', function(d3Service, DataFactory, SVGFactory) {

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
                        let anchor = d3.select(ele[0]);
                        anchor.selectAll('*').remove();

                        let formatColX = scope.columns[0].name.replace(/\_+/g, " "),
                            formatColY = scope.columns[1].name.replace(/\_+/g, " "),
                            graphColor = scope.settings.color || '20a',
                            margin = { top: 30, right: 20, bottom: 30, left: 40 },
                            width = scope.settings.width || ele[0].parentNode.offsetWidth,
                            height = scope.settings.height || 500,
                            titleSize = scope.settings.titleSize || height / 35,
                            radius = scope.settings.radius || height / 3,
                            title = scope.settings.title || (formatColX + ' vs. ' + formatColY).toUpperCase(),
                            displayType = scope.settings.displayType || 'number';

                        let filteredData = scope.rows.filter(obj => Number(obj[scope.columns[1].name]) > 0);
                        
                        let groupType = scope.settings.groupType || 'total';

                        let groupedData = DataFactory.groupByCategory(filteredData, scope.columns[0].name, scope.columns[1].name, groupType);
                        groupedData = DataFactory.orderByCategory(groupedData, scope.columns[0].name);

                        let groupedTotal = 0;
                        groupedData.forEach( a => groupedTotal += a[scope.columns[1].name]);
                        //uses build in d3 method to create color scale

                        let color = SVGFactory.setColor(graphColor);

                        let svg = anchor
                            .append('svg')
                            .attr('width', width)
                            .attr('height', height)
                            .style('background-color', '#ffffff')
                            .data([groupedData])
                            .append("g")
                            // .attr("transform", "translate(" + (width / 1.75) + "," + (radius *1.5) + ")");
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
                            .attr("class", "slice")
                            .attr("transform", "translate(" + (width / 1.75) + "," + (radius *1.5) + ")");

                        arcs.append("path")
                            .attr("fill", function(d, i) {
                                return color(i);
                            })
                            .attr("d", arc);

                        SVGFactory.appendTitle(svg, margin, width, title, titleSize);

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
                                    return "translate(" + (width / 1.75) + "," + ((radius * 1.5) + (i * 20 + 10)) + ")";
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
                            .text(function(d, i) { 
                                return groupedData[i][scope.columns[0].name] + " - " + legendDisplay(displayType, +groupedData[i][scope.columns[1].name]);
                            });
                    };
                    
            });
        }
    };
});
