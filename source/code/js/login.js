angular.module('wxSDK')
.controller('tLogin', function (
    $scope,
    $state,
    widget
){
    $scope.currentName = "账号绑定";

    $scope.tInput = {};

    $scope.setLogin = function () {
        if (!$scope.tInput.UserName) {
            widget.msgToast('请输入用户名');
            return;
        }
        if (!$scope.tInput.Password) {
            widget.msgToast('请输入密码');
            return;
        }

        widget.ajaxRequest({
            scope: $scope,
            url: '',
            data: {

            },
            success: function (res) {
                
            }
        });
    };
});