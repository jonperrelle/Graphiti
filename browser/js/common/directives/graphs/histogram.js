app.directive('histogram', function (d3Service, DataFactory, SVGFactory) {
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
        //Re-render the graph when user changes settings, data, or window size
        SVGFactory.watchForChanges(scope);

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
              7;

          let formatColX = scope.column.name.replace(/\_+/g, " "),
              graphColor = scope.settings.color || '10',
              width = scope.settings.width || ele[0].parentNode.offsetWidth,
              height = scope.settings.height || 500,
              titleSize = scope.settings.titleSize || height / 35,
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

          let color = SVGFactory.setColor(graphColor);

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

              SVGFactory.appendXAxis(svg, margin, width, height, xAxis, xAxisLabel, xAxisLabelSize);

              SVGFactory.appendYAxis(svg, margin, height, yAxis, yAxisLabel, yAxisLabelSize);

              SVGFactory.appendTitle(svg, margin, width, title, titleSize);
        };
      });
    }
  };
});
