app.directive('barChart', function(d3Service, $window, DataFactory) {
    return {
      restrict: 'EA',
      scope: {
        data: "=",
        category: "=",
        metric: "="
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
            return scope.category;
          }, function () {
            scope.render();
          });

          scope.$watch(function (scope) {
            return scope.metric;
          }, function () {
            scope.render();
          });
 
          scope.render = function() {
            if (!scope.category || !scope.metric) return;

            let groupedData = DataFactory.groupByCategory(scope.data, scope.category, scope.metric);

            groupedData = DataFactory.orderByCategory(groupedData, scope.category);

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

            x.domain(groupedData.map(function(d) { return d[scope.category]; }));

            y.domain([0, d3.max(groupedData, function(d) { return +d[scope.metric]; })]);

            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(100," + height + ")")
                .call(xAxis)
              .append("text")
                .attr("class", "xlabel")
                .text(scope.category);

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
                .text(scope.metric);

            svg.selectAll(".bar")
                .data(groupedData)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d[scope.category]); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                  return y(+d[scope.metric]);
                })
                .attr("height", function(d) {
                  return height - y(+d[scope.metric]);
                })
                .attr("transform", "translate(100, 0)");
          };
        });
      }
    };
});