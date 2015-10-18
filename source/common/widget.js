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
         * 数据缓存 所有缓存都在数据池里操作
         * @param key
         * @param data 如果data不存在，则为取缓存，如果存在，则重写key的值
         */
        cacheData: function (key, data) {

            if (!angular.isString(key)) {
                return false;
            }

            var tmpCache = dataPool.get(key);

            if (data) {
                dataPool.put(key, data); //缓存数据
            } else {
                return tmpCache ? tmpCache : false;
            }
        },

        /**
         * 安全的使用angular apply方法，以保证不会因为产生循环调用而抛出“$digest already in progress”
         * @param scope
         * @param fn
         */
        safeApply: function (scope, fn) {
            if (!scope || !fn) {
                return;
            }
            if (scope.$$phase || (scope.$root && scope.$root.$$phase)) {
                fn();
            } else {
                scope.$apply(fn);
            }
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

        },

        /**
         * 设置登录信息
         * UserInfo {
         *     UserId:    用户ID
         *     Auth:      Auth
         * }
         */
        setLogin: function (data) {
            var self = this;
                    
            cachePool.push('UserInfo', {
                UserId: data.UserId,
                Auth:   data.Auth
            }, 1); // 缓存1天

            $rootScope.UserInfo = cachePool.pull('UserInfo');
        },

        /**
         * 注销用户登录信息
         */
        cleanLogin: function () {
            cachePool.remove("UserInfo");
            
            $rootScope.UserInfo = { UserId: 0 };
        },

        /**
         * 检查手机号
         */
        checkPhone: function (phone) {
            var self = this,
                status = false;

            if (!phone) {
                self.msgToast('请输入手机号码');

                status = true;
            }

            if (!/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(phone)) {
                self.msgToast('手机号码格式不合法');

                status = true;
            }

            return status;
        },

        /**
         * 获取工作列表
         */
        getJobList: function () {
            var q = $q.defer();

            $http({
                method: 'GET',
                url: 'data/getJobList.json',
                timeout: 15000
            })
            .success(function (data) {
                q.resolve(data);
            })
            .error(function (err) {
                q.reject(err);
            });

            return q.promise;
        },

        /**
         * 根据ID拿工作名称
         */
        getJobName: function (id) {
            var self = this;

            var JobName = self.getJobList().then(function (res) {
                    var name;

                    angular.forEach(res.JobList, function (v, k) {
                        if (v.Id == id) {
                            name = v.Name;
                        }
                    });

                    return name;
                }, function (err) {
                    return null;
                });

            return JobName;
        },

        /**
         * 获取城市列表
         * CityList
         */
        getCityList: function () {
            var q = $q.defer();

            $http({
                method: 'GET',
                url: 'data/getCityList.json',
                timeout: 15000
            })
            .success(function (data) {
                q.resolve(data);
                $rootScope.CityList = data;
            })
            .error(function (err) {
                q.reject(err);
            });

            return q.promise;
        },

        /**
         * 根据CityId 获取CityName
         */
        getCityName: function (id) {
            var self = this,
                CityName;

            if ($rootScope.CityList) {
                angular.forEach($rootScope.CityList, function (v, k) {
                    angular.forEach(v.sub, function (n, i) {
                        if (n.id == id) {
                            CityName = v.name +" "+ n.name;
                            return;
                        }
                    });
                    if (CityName) return;                    
                });
            } else {
                CityName = self.getCityList().then(function (res) {
                    var name;

                    angular.forEach(res, function (v, k) {
                        angular.forEach(v.sub, function (n, i) {
                            if (n.id == id) {
                                name = v.name +" "+ n.name;
                                return;
                            }
                        });
                        if (name) return;                    
                    });

                    return name;
                }, function (err) {
                    return null;
                });
            }

            return CityName;
        }


    };


    /**
     * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var paramObj = function (obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += paramObj(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += paramObj(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    return tPackage;
});
