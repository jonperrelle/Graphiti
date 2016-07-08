app.factory('SVGFactory', function ($window) {
  let SVGFactory = {};

  SVGFactory.watchForChanges = function (scope) {
    window.onresize = function() {
      scope.$parent.$parent.$digest();
    };

    scope.$watch(function() {
      return angular.element($window)[0].innerWidth;
    }, function() {
      scope.render();
    });

    scope.$watch(function () {
      return scope.settings;
    }, function() {
      scope.render();
    }, true);

    scope.$watch(function () {
      return scope.columns;
    }, function () {  
      scope.render();
    }, true);
  };

  SVGFactory.setColor = function (colorScale) {
    switch (colorScale) {
      case '10':
        return d3.scale.category10();
      case '20a':
        return d3.scale.category20();
      case '20b':
        return d3.scale.category20b();
      case '20c':
        return d3.scale.category20c();
      default: 
        return colorScale;
    }
  };

  SVGFactory.appendXAxis = function (svg, margin, width, height, xAxis, xAxisLabel, xAxisLabelSize) {
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
  };

  SVGFactory.appendYAxis = function (svg, margin, height, yAxis, yAxisLabel, yAxisLabelSize) {
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
  };

  return SVGFactory;
});
