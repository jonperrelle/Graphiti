app.controller('embedModalInstanceCtrl', function($scope, $uibModal, $uibModalInstance) {

    svgAsDataUri(document.querySelector('.graph-container svg'), {}, function(uri) {
            $scope.svgImg = '<img src=' + uri + '>';
       });

    $scope.btnMsg = "Copy to clipboard";

    $scope.copied = function() {
        $scope.btnMsg = "Copied!";
        setTimeout($uibModalInstance.close(),2000);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});