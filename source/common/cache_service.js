'use strict';

angular.module('wxSDK')
.factory('cachePool', function () {

    var fetchItem = function (key) {
        if (!key) {
            return null;
        }

        var itemStr = localStorage.getItem('tjoysadm' + key),
            item;

        try {
            item = JSON.parse(itemStr);
        } catch (e) {}

        if (!item) {
            return null;
        }

        return item;
    };

    var ONE_DAY = 24 * 3600 * 1000;

    var storageData = {

        /**
         * 设置本地存储的值
         * @param key 本地存储name
         * @param data 本地存储对象
         * @param expires 过期时间(可选)(天为单位)
         */
        push: function (key, data, expires) {
            if (!key || !data) {
                return;
            }

            var item = fetchItem(key) || {};

            item.value = data || undefined; //暂时先取value键值，不做自定义处理

            item.expired = expires ? (Date.now() + ONE_DAY * expires) : undefined;

            localStorage.setItem('tjoysadm' + key, JSON.stringify(item));
        },

        /**
         * 获取本地存储的值
         * @param key 本地存储name
         * expired如果存在，则判断是否过期，不存在就是永久值
         */
        pull: function (key) {
            var item = fetchItem(key),
                data;

            if (!item || item.expired && item.expired <= Date.now()) {
                return null;
            } else {
                data = item['value'];
            }

            return data;
        },

        /**
         * 删除本地存储的值
         * @params:
         *     key: 本地存储name
         *     dataKey: 具体某个属性
         */
        remove: function (key, dataKey) {
            if (!key) {
                return;
            }

            var item = fetchItem(key);

            if (!item) {
                localStorage.removeItem('tjoysadm' + key);
                return;
            }

            if (dataKey && item[dataKey]) {
                item[dataKey] = undefined;
                localStorage.setItem('tjoysadm' + key, JSON.stringify(item));
            } else {
                localStorage.removeItem('tjoysadm' + key);
            }

        },

        /**
         * 修改本地存储的值
         * @params:
         *     key: 本地存储name
         *     dataKey: 需要修改的属性对象 如： { a:1 }
         */
        modify: function (key, dataKey) {
            if (!key) {
                return;
            }

            var items = fetchItem(key),
                i;

            if (!items) {
                localStorage.removeItem('tjoysadm' + key);
                return;
            }

            if (dataKey) {
                for (i in items.value) {
                    if (dataKey[i]) {
                        items.value[i] = dataKey[i];
                    }
                }

                localStorage.setItem('tjoysadm' + key, JSON.stringify(items));
            }
        }

    };

    return storageData;
});