app.directive('barChart', function(d3Service, $window, DataFactory) {
    return {
      restrict: 'EA',
      scope: {
        rows: "=",
        columns: "="
        // data: "=",
        // category: "=",
        // metric: "="
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          let margin = {top: 20, right: 20, bottom: 100, left: 50},
              width = 960 - margin.left - margin.right,
              height = 1000 - margin.top - margin.bottom,
              svg;
          
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
            if (!scope.columns) return;

            let groupedData = DataFactory.groupByCategory(scope.rows, scope.columns[0].name, scope.columns[1].name);
            groupedData = DataFactory.orderByCategory(groupedData, scope.columns[0].name);

            svg = svg || d3.select(ele[0])
            .append('svg')
            .style('width', '100%')
            .style('height', "1100px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.selectAll('*').remove();
 
            // set the height based on the calculations above
            svg.attr('height', height + margin.top + margin.bottom);

            //create the rectangles for the bar chart
            let x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1);

            let y = d3.scale.linear()
                .range([height, 0]);

            let xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            let yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            x.domain(groupedData.map(function(d) { return d[scope.columns[0].name]; }));

            y.domain([0, d3.max(groupedData, function(d) { return +d[scope.columns[1].name]; })]);

            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(100," + height + ")")
                .call(xAxis)
              .append("text")
                .attr("class", "xlabel")
                .text(scope.columns[0].name);

            svg.selectAll(".xaxis text")
                .attr("transform", "rotate(-45)translate(-10, 0)")
                .style("text-anchor", "end");
            svg.select(".xlabel")
                .attr("transform", "translate(" + width / 2 + ", 120)");

            svg.append("g")
                .attr("class", "yaxis")
                .attr("transform", "translate(100, 0)")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)translate(" + -((height - margin.bottom) / 2) + ", -120)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(scope.columns[1].name);

            svg.selectAll(".bar")
                .data(groupedData)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d[scope.columns[0].name]); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                  return y(+d[scope.columns[1].name]);
                })
                .attr("height", function(d) {
                  return height - y(+d[scope.columns[1].name]);
                })
                .attr("transform", "translate(100, 0)");
          };
        });
      }
    };
});