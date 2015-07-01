angular.module('wxSDK')
.controller('tDetail', function (
    $scope,
    $http,
    $state
){
    $scope.DataList = {};

    $scope.goBack = function () {
        $state.go('intro', {id: 1});
    };
    
    var config = {
        method: 'GET',
        url: 'api/submit2.json'
    }

    $http(config).success(function(res){
        angular.extend($scope.DataList, res.data);

        angular.forEach($scope.DataList.detail.line, function (v, k) {
            v.info = [];
            angular.forEach(v.item, function (i, j) {
                if (j > 0) {
                    if (i.hide) {
                        v.show = false;
                    }
                    v.info.push(i);
                }
            });
        });


        $scope.DataList.SubTitle = [
            {
                title: "概述"
            }
        ];
        
        $scope.currentName = "采购包明细";
    }).error(function(){

    });

    $scope.changePage = function (key) {
        $scope.isShow = false;
        $state.go('intro', {id: 1});
    };

    $scope.changeShow = function () {
        if ($scope.last && $scope.last != this.k+1) {
            $scope.DataList.detail.line[$scope.last-1].show = false;
        }
        $scope.last = this.k + 1;
        $scope.DataList.detail.line[this.k].show = !$scope.DataList.detail.line[this.k].show;
    };
});