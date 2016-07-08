app.directive('histogram', function (d3Service, $window, DataFactory) {
  return {
    restrict: 'E',
    scope: {
      rows: "=",
      columns: "=",
      settings: "="
    },
    link: function (scope, ele, attrs) {
      scope.column = scope.columns[0];
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
                d3.layout.histogram()
                  .value(d => +d[scope.column.name])
                  .bins(15)
                  (scope.rows.filter(obj => obj[scope.column.name] 
                    && (!!Number(obj[scope.column.name]) || Number(obj[scope.column.name]) === 0))) : 
                DataFactory.groupByCategory(scope.rows, scope.column.name, 'frequency', 'number'),
              total = scope.rows.length;

          let xLabelLength = !quantitative ? data.reduce(function (prev, current) {
                  let currentLength = current[scope.column.name].toString().length;
                  return currentLength > prev ? currentLength : prev;
              }, 0) :
              8;

          let formatColX = scope.column.name.replace(/\_+/g, " "),
              graphColor = scope.settings.color || '10',
              width = scope.settings.width || ele[0].parentNode.offsetWidth,
              height = scope.settings.height || 500,
              titleSize = scope.settings.titleSize || height / 25,
              xAxisLabelSize = scope.settings.xAxisLabelSize || height / 30,
              yAxisLabelSize = scope.settings.yAxisLabelSize || height / 30,
              margin = {
                top: titleSize + 20,
                right: 20,
                bottom: ((xLabelLength + 6) * 5) + xAxisLabelSize,
                left: 60
              },
              xAxisLabel = scope.settings.xAxisLabel || formatColX,
              yAxisLabel = scope.settings.yAxisLabel || scope.settings.display === 'percentage' ? 
                'percentage' :
                'total',
              title = scope.settings.title || 'frequency for ' + formatColX;

          let color,
          setColor = function (colorScale) {
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
                  case '20a':
                      color = d3.scale.category20();
                      break; 
                  default: 
                      color = colorScale;
              }
          };

          setColor(graphColor);

          let svg = anchor
              .append('svg')
              .style('width', width)
              .style('height', height)
              .style('background-color', '#ffffff')
              .append("g");

          let xScale,
              tickType;
          if (quantitative) {
            xScale = d3.scale.linear()
                  .domain([d3.min(data, d => d.x), d3.max(data, d => d.x + d.dx)])
                  .range([0, width - margin.left - margin.right]);
            if (data[0][0][scope.column.name] % 1) {
              tickType = d3.format('.2f');
            } else {
              tickType = d3.format('f');
            }
          } else {
            xScale = d3.scale.ordinal()
                .domain(data.map(function(d) {
                          return d[scope.column.name]; 
                        }))
                .rangeBands([0, width - margin.left - margin.right], 0.1);
          }

          let tickVals = data.map(d => d.x);

          let yScale = d3.scale.linear()
                .range([height - margin.bottom, margin.top]);

          if (quantitative) {
            yScale.domain([0, d3.max(data, d => d.y)]);
          } else {
            yScale.domain([0, d3.max(data, d => d.frequency)]);
          }

          let xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom"),
              yAxis = d3.svg.axis().scale(yScale).orient("left");

          if (scope.settings.display === 'percentage') {
            yAxis.tickFormat(function (num) {
              return (+num * 100 / total).toFixed(2);
            });
          }

          if (quantitative) {
            xAxis.tickFormat(tickType)
              .tickValues(tickVals);
          }

          let bar = svg.selectAll('.bar')
                .data(data)
              .enter()
                .append('rect')
                .attr("class", "bar")
                .attr("x", function(d) {
                  if (quantitative) {
                    return xScale(d.x);
                  }
                  else {
                    return xScale(d[scope.column.name]);
                  }
                })
                .attr("y", function(d) {
                  return quantitative ? yScale(d.y) : yScale(d.frequency);
                })
                .attr('width', function (d) {
                  return quantitative ? (xScale(d.dx + d3.min(data, function (d) {
                    return d.x;
                  })) - 1) : xScale.rangeBand();
                })
                .attr('height', function (d) {
                  return quantitative ? (height - margin.bottom - yScale(d.y)) : (height - margin.bottom - yScale(d.frequency));
                })
                .attr("fill", function(d, i) {
                        if(typeof color === 'function') return color(i);
                        else return color;
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
                    .attr("transform", "translate(" + margin.left + ",0)")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "ylabel")
                    .attr("transform", "rotate(-90)translate(" + -((height - margin.bottom) / 2) + ", " + -(margin.left - yAxisLabelSize) + ")")
                    .text(yAxisLabel)
                    .style("text-anchor", "middle")
                    .style("font-size", yAxisLabelSize);

              svg.append("text")
                  .attr("x", (width / 2))             
                  .attr("y", (margin.top / 2))
                  .attr("text-anchor", "middle") 
                  .style("font-size", titleSize)
                  .text(title);
        };
      });
    }
  };
});
