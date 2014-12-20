'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Frontpage.controller('FrontpageController', ['$scope', 'ApiService', 'NotificationService', function($scope, ApiService, NotificationService) {

// Config
    $scope.temp = function() {
        NotificationService.notify('info', 'FRONTPAGE Message');
    };
// Run

}]);
