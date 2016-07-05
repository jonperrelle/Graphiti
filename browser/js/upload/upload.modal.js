app.controller('uploadModalInstanceCtrl', function($scope, $uibModal, $uibModalInstance) {

    $scope.submit = function() {
        $uibModalInstance.close($scope.file);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('embedModalInstanceCtrl', function($scope, $uibModal, $uibModalInstance) {

    svgAsDataUri(document.querySelector('.graph-container svg'), {}, function(uri) {
            $scope.svgImg = '<img src=' + uri + '>';
       });


    $scope.onSuccess = function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

        e.clearSelection();
        $uibModalInstance.close($scope.file);
    };

    $scope.onError = function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

});