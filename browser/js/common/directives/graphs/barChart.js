app.directive('barChart', function(d3Service, $window) {
    return {
      restrict: 'EA',
      scope: {
        data: "=",
        cols: "="
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          let margin = {top: 20, right: 20, bottom: 30, left: 50},
              width = 960 -margin.left - margin.right,
              height = 1000 - margin.top - margin.bottom,
              dataColumns = scope.cols.split(",");
          
          let filteredData = scope.data.filter( obj => obj[dataColumns[0]] && obj[dataColumns[1]]).sort(function(a,b){return a[dataColumns[0]] - b[dataColumns[0]]});

          console.log(filteredData);

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
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(filteredData);
          });
 
          scope.render = function(data) {
            svg.selectAll('*').remove();
 
            // If we don't pass any data, return out of the element
            if (!data) return;
            // set the height based on the calculations above
            svg.attr('height', height + margin.top + margin.bottom);
            //create the rectangles for the bar chart

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                // .ticks(10, "%");

            x.domain(filteredData.map(function(d) { return d.year_discovered; }));


            y.domain([0, d3.max(filteredData, function(d) { return +d.cumulative_production; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(100, 0)")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");

            svg.selectAll(".bar")
                .data(filteredData)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.year_discovered); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.cumulative_production); })
                .attr("height", function(d) { return height - y(d.cumulative_production); });
                //height - y(d.cumulative_production);
          };
        });
      }
    };
});