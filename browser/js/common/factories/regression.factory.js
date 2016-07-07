app.factory('RegressionFactory', function($http) {

    let RegressionFactory = {regression};

    return RegressionFactory;

    function regression(xSeries, ySeries) {

        let leastSquaresCoeff = leastSquares(xSeries, ySeries);

        // apply the reults of the least squares regression
        let x1 = Math.min.apply(null, xSeries);
        let x2 = Math.max.apply(null, xSeries)

        let y1 = leastSquaresCoeff[0] * x1 + leastSquaresCoeff[1];
        let y2 = leastSquaresCoeff[0] * x2 + leastSquaresCoeff[1];

        let trendData = [
            [x1, y1, x2, y2]
        ];

        return trendData;
    }

    function reduceSumFunc (prev, cur) {
        return prev + cur;
    };

    function leastSquares(xSeries, ySeries) {

        let xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
        let yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

        let ssXX = xSeries.map(function(d) {
                return Math.pow(d - xBar, 2);
            })
            .reduce(reduceSumFunc);

        let ssYY = ySeries.map(function(d) {
                return Math.pow(d - yBar, 2);
            })
            .reduce(reduceSumFunc);

        let ssXY = xSeries.map(function(d, i) {
                return (d - xBar) * (ySeries[i] - yBar);
            })
            .reduce(reduceSumFunc);

        let slope = ssXY / ssXX;
        let intercept = yBar - (xBar * slope);
        let rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

        return [slope, intercept, rSquare];
    }

});
