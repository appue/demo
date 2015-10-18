angular.module('wxSDK')
.directive('pageBack', function (
    $window,
    $state,
    $stateParams
) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                $window.history.back();
            });
        }
    };
});