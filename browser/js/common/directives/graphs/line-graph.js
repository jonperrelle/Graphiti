app.directive('lineGraph', function(d3Service, $window) {
    return {
      restrict: 'EA',
      scope: {
        data: "="
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          console.log(scope.data);
          // let margin = {top: 20, right: 20, bottom: 30, left: 50},
          //     height = 500 - margin.top - margin.bottom;


          // let svg = d3.select(ele[0])
          //   .append('svg')
          //   .style('width', '100%')
          //   .append("g")
          //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          // // let formatDate = d3.time.format("%d-%b-%y");

          // let x = d3.time.scale()
          //     .range([0, width]);

          // let y = d3.scale.linear()
          //     .range([height, 0]);

          // let xAxis = d3.svg.axis()
          //     .scale(x)
          //     .orient("bottom");

          // let yAxis = d3.svg.axis()
          //     .scale(y)
          //     .orient("left");

          // let line = d3.svg.line()
          //     .x(function(d) { return x(); })
          //     .y(function(d) { return y(d.close); });
          
          // // Browser onresize event
          // window.onresize = function() {
          //   scope.$apply();
          // };
 

        
 
          // // Watch for resize event
          // scope.$watch(function() {
          //   return angular.element($window)[0].innerWidth;
          // }, function() {
          //   scope.render(scope.data);
          // });
 
          // scope.render = function(data) {
          //   svg.selectAll('*').remove();
 
          //   // If we don't pass any data, return out of the element
          //   if (!data) return;
            
          //   // set the height based on the calculations above
          //   svg.attr('height', height + margin.top + margin.bottom);
          //   //create the rectangles for the bar chart
          //   svg.selectAll('rect')
          //     .data(data).enter()
          //       .append('rect')
          //       .attr('height', barHeight)
          //       .attr('width', 140)
          //       .attr('x', Math.round(margin/2))
          //       .attr('y', function(d,i) {
          //         return i * (barHeight + barPadding);
          //       })
          //       .attr('fill', function(d) { return color(d.score); })
          //       .transition()
          //         .duration(1000)
          //         .attr('width', function(d) {
          //           return xScale(d.score);
          //         });
          //};
        });
      }
    };
});




// d3.tsv("data.tsv", type, function(error, data) {
//   if (error) throw error;

//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain(d3.extent(data, function(d) { return d.close; }));

//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Price ($)");

//   svg.append("path")
//       .datum(data)
//       .attr("class", "line")
//       .attr("d", line);
// });

// function type(d) {
//   d.date = formatDate.parse(d.date);
//   d.close = +d.close;
//   return d;
// }




  








