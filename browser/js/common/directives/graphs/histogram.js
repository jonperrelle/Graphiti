app.directive('histogram', function (d3Service, DataFactory, SVGFactory, graphSettingsFactory) {
  return {
    restrict: 'E',
    scope: {
      rows: "=",
      seriesx: '=',
      settings: "="
    },
    link: function (scope, ele, attrs) {
      scope.column = scope.seriesx[0];
      d3Service.d3().then(function (d3) {
        //Re-render the graph when user changes settings, data, or window size
        SVGFactory.watchForChanges(scope);

        scope.render = function () {
          let anchor = d3.select(ele[0]);
          anchor.selectAll('*').remove();

         

          graphSettingsFactory.getSavedSettings(scope.settings, ele[0], scope.rows, 'histogram')
              .then(function (savedSets) {

              let data = scope.rows,
              xCol = scope.seriesx[0],
              defaultSettings = graphSettingsFactory.getDefaultSettings(),
              svg = SVGFactory.appendSVG(anchor, savedSets.width, savedSets.height),
              quantitative = xCol.type === 'number',
              total = 0;

              data.forEach( obj => {
                total += obj.frequency;
              });

          // let xLabelLength = !quantitative ? data.reduce(function (prev, current) {
          //         let currentLength = current[scope.column.name].toString().length;
          //         return currentLength > prev ? currentLength : prev;
          //     }, 0) :
          //     7;

              if (savedSets.yAxisLabel === 'Y Axis') savedSets.yAxisLabel = 'total';
              if (savedSets.title === 'X AXIS vs. Y AXIS') savedSets.title = 'frequency for ' + savedSets.xAxisLabel;
              

              let xScale,
                  tickType;
              if (quantitative) {
                xScale = d3.scale.linear()
                      .domain([d3.min(data, d => d.x), d3.max(data, d => d.x + d.dx)])
                      .range([0, savedSets.width - defaultSettings.margin.left - defaultSettings.margin.right]);
                if (data[0][0][xCol.name] % 1) {
                  tickType = d3.format('.2f');
                } else {
                  tickType = d3.format('f');
                }
              } else {
                xScale = d3.scale.ordinal()
                  .domain(data.map(function(d) {
                            return d[xCol.name]; 
                          }))
                  .rangeBands([0, savedSets.width - defaultSettings.margin.left - defaultSettings.margin.right], 0.1);
              }

              let tickVals = data.map(d => d.x);

              let yScale = d3.scale.linear()
                    .range([savedSets.height - defaultSettings.margin.bottom, defaultSettings.margin.top]);

              if (quantitative) {
                yScale.domain([0, d3.max(data, d => d.y)]);
              } else {
                yScale.domain([0, d3.max(data, d => d.frequency)]);
              }

              let xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom"),
                  yAxis = d3.svg.axis().scale(yScale).orient("left");

              if (savedSets.display === 'percentage') {
                yAxis.tickFormat(function (num) {
                  return (+num * 100 / total).toFixed(2);
                });
              }
              else  {
                yAxis.tickFormat(function (num) {
                  return num;
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
                        return xScale(d[xCol.name]);
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
                      return quantitative ? (savedSets.height - defaultSettings.margin.bottom - yScale(d.y)) : (savedSets.height - defaultSettings.margin.bottom - yScale(d.frequency));
                    })
                    .attr("fill", function(d, i) {
                            if(typeof savedSets.color === 'function') return savedSets.color(i);
                            else return savedSets.color;
                    })
                    .attr("transform", "translate(" +defaultSettings.margin.left + ", 0)");

                  SVGFactory.appendXAxis(svg, defaultSettings.margin, savedSets.width, savedSets.height, xAxis, savedSets.xAxisLabel, savedSets.xAxisLabelSize);

                  SVGFactory.appendYAxis(svg, defaultSettings.margin, savedSets.height, yAxis, savedSets.yAxisLabel, savedSets.yAxisLabelSize);

                  SVGFactory.appendTitle(svg, defaultSettings.margin, savedSets.width, savedSets.title, savedSets.titleSize);
          });
        }
      });
    }
  };
});
