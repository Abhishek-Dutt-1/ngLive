'use strict';

/**
 * @ngdoc overview
 * @name ngLiveApp
 * @description
 * # ngLiveApp
 *
 * Main module of the application.
 */
angular
  .module('ngLiveApp', ['ngRoute', 'ui.sortable', 'LocalStorageModule'])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
