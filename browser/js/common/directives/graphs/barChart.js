app.directive('barChart', function(d3Service, $window, DataFactory) {
    return {
      restrict: 'EA',
      scope: {
        rows: "=",
        columns: "="
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

            let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] && obj[scope.columns[1].name]).sort((a,b) => a[scope.columns[0].name] - b[scope.columns[0].name]);

            let groupedData = DataFactory.groupByCategory(filteredData, scope.columns[0].name, scope.columns[1].name);
            groupedData = DataFactory.orderByCategory(groupedData, scope.columns[0].name);

            let svg = d3.select(ele[0])
            svg.selectAll('*').remove();

            let margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = ele[0].parentNode.offsetWidth - margin.left - margin.right,
                height = width - margin.top - margin.bottom,
                barSpace = 0.1;

            svg = svg
            .append('svg')
                .style('width', width + margin.left + margin.right)
                .style('height', height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //create the rectangles for the bar chart
            let x = d3.scale.ordinal()
                .rangeRoundBands([margin.left, width + margin.left], barSpace);

            let y = d3.scale.linear()
                .range([height, margin.top]);

            let xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            let yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            x.domain(groupedData.map(function(d) { return d[scope.columns[0].name]; }));

            // y.domain([0, d3.max(groupedData, function(d) { return +d[scope.columns[1].name]; })]);
            y.domain([0, d3.max(groupedData, function(d) { return +d[scope.columns[1].name]; })]);

            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis)
              .append("text")
                .attr("class", "xlabel")
                .text(scope.columns[0].name);

            svg.selectAll(".xaxis text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");
            svg.select(".xlabel")
                .attr("transform", "translate(" + width / 2 + ", 0)");

            // svg.append("g")
            //     .attr("class", "yaxis")
            //     .attr("transform", "translate(" + margin.left + ")")
            //     .call(yAxis)
            //   .append("text")
            //     .attr("transform", "rotate(-90)translate(" + -((height - margin.bottom) / 2) + ", -120)")
            //     .attr("y", 6)
            //     .attr("dy", ".71em")
            //     .style("text-anchor", "end")
            //     .text(scope.columns[1].name);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis)
              .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")

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
                // .attr("transform", "translate(100, 0)");
          };
        });
      }
    };
});