angular.module('wxSDK')

.controller('tDetail', function (
    $scope,
    $http,
    $state,

    widget
){
    $scope.DataList = {
        ListMenu: [
            {
                Id: 1,
                Title: "概述"
            },
            {
                Id: 2,
                Title: "采购包明细"
            }
        ]
    };

    $scope.Deploy = {
        showMenu: false,
        showMore: false,
        currentTitle: "概述",
        showFilter: false,
        currentId: 1
    };


    widget.ajaxRequest({
        scope: $scope,
        url: 'submit2',
        data: {},
        success: function (res) {
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
        }
    });

    

    $scope.changeShow = function () {
        if ($scope.last && $scope.last != this.k+1) {
            $scope.DataList.detail.line[$scope.last-1].show = false;
        }
        $scope.last = this.k + 1;
        $scope.DataList.detail.line[this.k].show = !$scope.DataList.detail.line[this.k].show;
    };


    $scope.changeTab = function () {

    };

    $scope.changeMenu = function (id) {
        $scope.Deploy.currentTab = id;
        $scope.Deploy.showMore = false;
        $scope.Deploy.showFilter = true;
    };
});