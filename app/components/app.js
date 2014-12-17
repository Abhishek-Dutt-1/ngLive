'use strict';

/**
 * @ngdoc overview
 * @name ngLiveApp
 * @description
 * # ngLiveApp
 *
 * Main module of the application.
 */
//var ngLiveApp = angular.module('ngLiveApp', ['User']);
var ngLiveApp = angular.module('ngLiveApp', ['ngRoute', 'User', 'Userrole', 'Permission']);

ngLiveApp.config(['$routeProvider', function($routeProvider) {

   $routeProvider.
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
