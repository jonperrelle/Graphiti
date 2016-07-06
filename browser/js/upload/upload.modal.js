app.controller('uploadModalInstanceCtrl', function($scope, $uibModal, $uibModalInstance, $localStorage) {

    $scope.submit = function() {
        $uibModalInstance.close($scope.file);
        $localStorage.column1 = null;
        $localStorage.column2 = null;
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});