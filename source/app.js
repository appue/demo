angular.module('wxSDK', ['ui.router'])
.run(function(
    $rootScope
) {
    FastClick.attach(document.body);
    $rootScope.apiSocket = 'api/';
})
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    //用户登录
    .state('login', {
        url: '/login.htm',
        templateUrl: 'code/tp/login.html',
        controller: 'tLogin'
    })

    //代办事宜
    .state('list', {
        url: '/list/{type}/{id}.htm',
        templateUrl: 'code/tp/list.html',
        controller: 'tList'
    })

    //详细信息
    .state('detail', {
        url: '/detail/{id}.htm',
        templateUrl: 'code/tp/detail.html',
        controller: 'tDetail'
    });

    $urlRouterProvider.otherwise('/login.htm');
});
