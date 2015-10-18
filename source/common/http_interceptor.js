/**
 * $http interceptor
 *
 * 1. 如果 $http 发起 request 的 URL domain 部分是以 $server 开头, 则会被自动替换为当前环境的 domain
 *
 * 例: $http.get('$server/...')
 * 可能会被替换成: $http.get('http://www.51mart.com.cn/Service/api/...')
 *
 * 2. response...
 *
 */

angular.module('wxSDK')

.config(function ($provide, $httpProvider) {

    $provide.factory('httpInterceptor', function ($q) {

        var httpInterceptor = {

            request: function (config) {

                var raw = config.url;

                return config || $q.when(config);
            },

            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            response: function (response) {

                // if (response.data && response.data.ResponseStatus) {

                //     if (response.data.ResponseStatus.Ack !== 'Success') {

                //         return $q.reject(response);
                //     }
                // }

                return response || $q.when(response);
            },

            responseError: function (rejection) {
                return $q.reject(rejection);
            }
        };

        return httpInterceptor;
    });

    $httpProvider.interceptors.push('httpInterceptor');
});