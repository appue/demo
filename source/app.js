angular.module('wxSDK', ['ui.router'])
.run(function() {
    FastClick.attach(document.body);
})
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    //用户登录
    .state('login', {
        url: '/login.htm',
        templateUrl: 'tmp/login.html',
        controller: 'tLogin'
    })

    //代办事宜
    .state('list', {
        url: '/list-{type}-{id}.htm',
        templateUrl: 'tmp/list.html',
        controller: 'tList'
    })

    //详细信息
    .state('detail', {
        url: '/detail-{id}.htm',
        templateUrl: 'tmp/detail.html',
        controller: 'tDetail'
    });
});
