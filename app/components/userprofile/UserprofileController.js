'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Userprofile.controller('UserprofileController', ['$scope', 'AuthenticationService', function($scope, AuthenticationService) {

// Config
    $scope.userProfile = AuthenticationService.getCurrentUser();
// Run

}]);
