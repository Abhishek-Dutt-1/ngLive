'use strict';
/**
 * @ngdoc overview
 * @name ngLiveApp
 * @description
 * # ngLiveApp
 *
 * Main module of the application.
 */
var ngLiveApp = angular.module('ngLiveApp', ['ngRoute', 'ngResource', 'ngLodash', 'Api', 'Widget', 'Settings', 'Notification', 'Frontpage', 'Mainmenu', 'Authentication', 'Board', 'User', 'Userrole', 'Permission', 'Cities', 'Userprofile', 'Post', 'Vote', 'Images']);

ngLiveApp.config(['$routeProvider', function($routeProvider) {

   $routeProvider.
       when('/', {
           templateUrl: 'components/frontpage/frontpageView.html',
           controller: 'FrontpageController'
       }).
       when('/post/new', {
           templateUrl: 'components/post/createPostView.html',
           controller: 'PostController'
       }).
       when('/post/all', {
           templateUrl: 'components/post/allPostView.html',
           controller: 'PostController'
       }).
       // Remove the one above after following 2 are done
       when('/b/', {
           // Default route
           templateUrl: 'components/post/allPostView.html',
           controller: 'PostController'
       }).
       when('/b/:board', {
           templateUrl: 'components/post/allPostView.html',
           controller: 'PostController'
       }).
       // End board route
       when('/post/:postId', {
           templateUrl: 'components/post/postView.html',
           controller: 'PostController'
       }).
        when('/profile', {
           templateUrl: 'components/userprofile/userprofileView.html',
           controller: 'UserprofileController'
       }).
       when('/login', {
           templateUrl: 'components/authentication/authenticationView.html',
           controller: 'AuthenticationController'
       }).
       when('/logout', {
           templateUrl: 'components/authentication/authenticationView.html',
           controller: 'AuthenticationController'
       }).
       when('/verify/:token', {
        // veryfy registeration email token
           templateUrl: 'components/authentication/verifyEmailView.html',
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
       when('/admin/board', {
           templateUrl: 'components/board/board-view.html',
           controller: 'BoardController'
       }).
       when('/admin/permission', {
           templateUrl: 'components/permission/permissionView.html',
           controller: 'PermissionController'
       }).
       when('/admin/cities', {
           templateUrl: 'components/cities/citiesView.html',
           controller: 'CitiesController'
       }).
       when('/admin/images', {
           templateUrl: 'components/images/imagesView.html',
           controller: 'ImagesController'
       }).
       otherwise({
           redirectTo: '/'
       });
}]);
