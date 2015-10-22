angular.module('wxSDK')

.controller('tList', function (
    $scope,
    $http,
    $state,
    $stateParams
){
    $scope.Deploy = {
        currentTab: $stateParams.type || 4
    };

});