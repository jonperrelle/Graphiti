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

     scope.$watch(function() {
          return scope.rows; 
      }, function(newVal, oldVal) {
          if (newVal !== oldVal) scope.render();
      }, true);

      scope.$watch(function() {
          return scope.settings; 
      }, function(newVal, oldVal) {
          if (newVal !== oldVal) scope.render();
      }, true);
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

  SVGFactory.appendTitle = function (svg, margin, width, title, titleSize) {
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", titleSize)
      .text(title);
  };

  SVGFactory.appendSVG = function (anchor, width, height) {
    return anchor.append('svg')
            .style('width', width)
            .style('height', height)
            .style('background-color', '#ffffff');
  };

  return SVGFactory;
});
