'use strict';

/**
 * @ngdoc overview
 * @name ngLiveApp
 * @description
 * # ngLiveApp
 *
 * Main module of the application.
 */
var ngLiveApp = angular.module('ngLiveApp', ['ngRoute', 'ngResource', 'Notification', 'Frontpage', 'Mainmenu', 'Authentication', 'User', 'Userrole', 'Permission']);

ngLiveApp.config(['$routeProvider', function($routeProvider) {

   $routeProvider.
       when('/', {
           templateUrl: 'components/frontpage/frontpageView.html',
           controller: 'FrontpageController'
       }).
       when('/login', {
           templateUrl: 'components/authentication/authenticationView.html',
           controller: 'AuthenticationController'
       }).
       when('/logout', {
           templateUrl: 'components/authentication/authenticationView.html',
           controller: 'AuthenticationController'
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
