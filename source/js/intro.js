angular.module('wxSDK')
.controller('tIndex', function (
    $scope,
    $http,
    $state
){
    $scope.DataList = {};
    
    var config = {
        method: 'GET',
        url: 'api/general1.json'
    }

    $http(config).success(function(res){
        angular.extend($scope.DataList, res.data);

        angular.forEach($scope.DataList.subitems.item, function (v, k) {
            v.zh = v.zh.replace(":", "");
        });

        $scope.DataList.SubTitle = [
            {
                title: "采购包明细"
            }
        ];
        
        $scope.currentName = "概述";
    }).error(function(){
        
    });

    $scope.changePage = function (val) {
        $scope.isShow = false;
        $state.go('detail', {id: 1});
    };
});