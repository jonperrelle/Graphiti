app.directive('embedModal', function($uibModal) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/modals/embed.modal.html',

        link: function(scope, element) {

            
            
            scope.embed = function() {

                let modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'embed.modal.html',
                    controller: 'embedModalInstanceCtrl',
                    scope: scope,
                    windowClass: 'embed-modal'
                });
            };

        }

    };

});
