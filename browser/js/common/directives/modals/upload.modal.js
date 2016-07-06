app.directive('uploadModal', function ($uibModal, $state, UploadFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/modals/upload.modal.html',

        link: function (scope, element) { 
            scope.openFileUpload = function () {
                let modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'upload.modal.html',
                    controller: 'uploadModalInstanceCtrl',
                    scope: scope,
                    windowClass: 'upload-modal'
            });

            modalInstance.result.then(function (file) {
                UploadFactory.uploadFile(file)
                .then(function(uploadedDS) {
                    scope.file = null;
                    $state.go('datasetDetails', {datasetId: uploadedDS.fileName, dataset: uploadedDS.dataset, rows: uploadedDS.data});
                })
            });   
        };

        }

    };

});

