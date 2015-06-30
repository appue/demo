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
        url: '/list.htm',
        templateUrl: 'tmp/list.html',
        controller: 'tList'
    })
    
    .state('intro', {
        url: '/intro-{id}.htm',
        templateUrl: 'tmp/intro.html',
        controller: 'tIndex'
    })

    .state('detail', {
        url: '/detail-{id}.htm',
        templateUrl: 'tmp/detail.html',
        controller: 'tDetail'
    });
});
