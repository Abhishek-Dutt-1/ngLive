'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngLiveApp
 */
angular.module('ngLiveApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
