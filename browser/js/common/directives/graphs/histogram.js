app.directive('histogram', function (d3Service, $window, DataFactory) {
  return {
    restrict: 'E',
    scope: {
      rows: "=",
      column: "=",
      settings: "="
    },
    link: function (scope, ele, attrs) {
      d3Service.d3().then(function (d3) {
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
            return scope.settings;
        }, function() {
            scope.render();
        }, true);

        scope.$watch(function (scope) {
          return scope.column;
        }, function () {
          scope.render();
        }, true);

        scope.render = function () {

          let anchor = d3.select(ele[0]);
          anchor.selectAll('*').remove();

          let quantitative = scope.column.type === 'number';

          let data = quantitative ? 
                scope.rows.filter(obj => obj[scope.column.name] 
                  && (!!Number(obj[scope.column.name]) || Number(obj[scope.column.name]) === 0)) : 
                  DataFactory.groupByCategory(scope.rows, scope.column.name, 'frequency', 'number');

          let xLabelLength = data.reduce(function (prev, current) {
                  let currentLength = current[scope.column.name].toString().length;
                  return currentLength > prev ? currentLength : prev;
              }, 0);

          let formatColX = scope.column.name.replace(/\_+/g, " "),
              width = scope.settings.width || ele[0].parentNode.offsetWidth,
              height = scope.settings.height || width,
              titleSize = scope.settings.titleSize || height / 20,
              xAxisLabelSize = scope.settings.xAxisLabelSize || height / 30,
              yAxisLabelSize = scope.settings.yAxisLabelSize || height / 30,
              margin = {
                top: titleSize + 20,
                right: 20,
                bottom: ((xLabelLength + 6) * 5) + xAxisLabelSize,
                left: 50
              },
              xAxisLabel = scope.settings.xAxisLabel || formatColX,
              yAxisLabel = scope.settings.yAxisLabel || 'frequency',
              title = scope.settings.title || 'frequency for ' + formatColX;

          let svg = anchor
              .append('svg')
              .style('width', width)
              .style('height', height)
              .style('background-color', '#ffffff')
              .style('border-radius', '10px')
              .append("g");

          let xScale,
              tickType;
          if (quantitative) {
            xScale = d3.scale.linear()
                  .domain([d3.min(data, d => +d[scope.column.name]), d3.max(data, d => +d[scope.column.name])])
                  .range([0, width - margin.left - margin.right]);
            tickType = d3.format('.2f');
          } else {
            xScale = d3.scale.ordinal()
                .domain(data.map(function(d) {
                          return d[scope.column.name]; 
                        }))
                .rangeBands([0, width - margin.left - margin.right], 0.1);
          }

          data = quantitative ? 
            d3.layout.histogram()
              .value(d => +d[scope.column.name])
              .bins(15)
              (data) :
            data;

          let tickVals = data.map(d => d.x);

          let yScale = d3.scale.linear()
                // .domain([0, d3.max(data, d => d.y)])
                .range([height - margin.bottom, margin.top]);

          if (quantitative) {
            yScale = yScale.domain([0, d3.max(data, d => d.y)]);
          } else {
            yScale = yScale.domain([0, d3.max(data, d => d.frequency)]);
          }

          let xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom"),
                        // .tickFormat(tickType)
                        // .tickValues(tickVals),
              yAxis = d3.svg.axis().scale(yScale).orient("left");

          if (quantitative) {
            xAxis = xAxis.tickFormat(tickType)
              .tickValues(tickVals);
          }

          let bar = svg.selectAll('.bar')
                .data(data)
              .enter()
                .append('rect')
                .attr("class", "bar")
                .attr("x", function(d) {
                  if (quantitative) return xScale(d.x);
                  else {
                    return xScale(d[scope.column.name]);
                  }
                })
                .attr("y", function(d) {
                  return quantitative ? yScale(d.y) : yScale(d.frequency);
                })
                .attr('width', function (d) {
                  return quantitative ? (xScale(d.dx + d3.min(data, function (e) {
                    return e.x;
                  })) - 1) : xScale.rangeBand();
                })
                .attr('height', function (d) {
                  return quantitative ? (height - margin.bottom - yScale(d.y)) : (height - margin.bottom - yScale(d.frequency));
                })
                .attr("transform", "translate(" + margin.left + ", 0)");

              svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + ", " + (height - margin.bottom) + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "xlabel")
                    .text(xAxisLabel);

              svg.selectAll(".x text")
                    .attr("transform", "translate(-7,0)rotate(-45)")
                    .style("text-anchor", "end");

              svg.select(".xlabel")
                   .attr("transform", "translate(" + ((width - margin.left - margin.right) / 2) + ", " + (margin.bottom - xAxisLabelSize) + ")")
                   .style("text-anchor", "middle")
                   .style("font-size", xAxisLabelSize);

              svg.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(" + margin.left + ", 0)")
                  .call(yAxis)
                  .append("text")
                  .attr("class", "ylabel")
                  .attr("transform", "rotate(-90)translate(" + ((height + margin.bottom + margin.top) / -2) + ", " + -(margin.left-20) + ")")
                  .text(yAxisLabel);
        };
      });
    }
  };
});























