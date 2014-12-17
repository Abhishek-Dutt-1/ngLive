'use strict';

/**
 * @ngdoc overview
 * @name ngLiveApp
 * @description
 * # ngLiveApp
 *
 * Main module of the application.
 */
var ngLiveApp = angular.module('ngLiveApp', ['ngRoute', 'Frontpage', 'Mainmenu', 'User', 'Userrole', 'Permission']);

ngLiveApp.config(['$routeProvider', function($routeProvider) {

   $routeProvider.
       when('/', {
           templateUrl: 'components/frontpage/frontpageView.html',
           controller: 'FrontpageController'
       }).
       when('/login', {
           templateUrl: 'components/mainmenu/loginView.html',
       }).
       when('/admin/user', {
           templateUrl: 'components/user/userView.html',
           controller: 'UserController'
       }).
       when('/admin/userrole', {
           templateUrl: 'components/userrole/userroleView.html',
           controller: 'UserroleController'
       }).
       when('/admin/permission', {
           templateUrl: 'components/permission/permissionView.html',
           controller: 'PermissionController'
       }).
       otherwise({
           redirectTo: '/'
       });
}]);
