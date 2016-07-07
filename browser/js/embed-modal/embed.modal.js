app.controller('embedModalInstanceCtrl', function($scope, $uibModal,$timeout, $uibModalInstance) {

    svgAsDataUri(document.querySelector('.graph-container svg'), {}, function(uri) {
            $scope.svgImg = '<img src=' + uri + '>';
       });

    $scope.btnMsg = "Copy to clipboard";

    $scope.copied = function() {
        $scope.btnMsg = "Copied!";
        $timeout(function(){$uibModalInstance.close()},2500);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});