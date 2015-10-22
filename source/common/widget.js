angular.module('wxSDK')

.factory('widget', function(
    $q,
    $http,
    $state,
    $compile,
    $timeout,
    $location,
    $rootScope,
    $cacheFactory,

    cachePool
) {

    var toastTimer = null,
        dataPool = $cacheFactory('dataPool');

    var tPackage = {
        /**
         * toast提示层
         * @param msg, time
         */
        msgToast: function (msg, time) {
            var toastDom = angular.element(document.querySelector('.mod_msg'));

            if (!toastDom.length) {
                var toastTpl = $compile('<div class="mod_msg" ng-click="notification=null" ng-show="notification"><span>{{notification}}</span></div>');
                angular.element(document.getElementsByTagName('body')[0]).append(toastTpl($rootScope));
            }

            $timeout(function() {
                $rootScope.notification = msg;
            }, 0);

            $timeout.cancel(toastTimer);

            toastTimer = $timeout(function() {
                $rootScope.notification = '';
            }, time || 2000);

        },
        
        /**
         * ajax请求
         */
        ajaxRequest: function (params) {
            var self = this;

            if (!params) return;

            var $scope = params.scope || '',
                postOpt = params.data || {},
                obj = {
                    Header: {
                        UserId: '',
                        Auth: ''
                    }
                };
                // UserInfo = cachePool.pull('UserInfo');

            if ($rootScope.UserInfo && $rootScope.UserInfo.UserId) {
                obj.Header.UserId = $rootScope.UserInfo.UserId;
                obj.Header.Auth = $rootScope.UserInfo.Auth;
            }

            postOpt = angular.extend({}, postOpt, obj);
            //--数据改造加用户信息end

            var options = {
                    success: function() {}, //--成功回调
                    error: function() {} //--错误回调
                },
                ajaxConfig = { //-----------------ajax请求配置
                    // method: 'POST',
                    // url: self.config().apiSocket + params.url || '',

                    method: 'GET',
                    url: $rootScope.apiSocket + params.url + '.json' || '',

                    data: postOpt,
                    timeout: 15000
                };

            for (var i in params) options[i] = params[i];

            $rootScope.isLoading = true;

            $http(ajaxConfig).success(function(data) {
                if (typeof options.success === 'function') {
                    options.success(data);
                }
                $rootScope.isLoading = false;
            }).error(function(data) {
                $rootScope.isLoading = false;
                self.msgToast('网络错误，请稍后再试！');
				options.error(data);
            });

        }
    };

    return tPackage;
});
