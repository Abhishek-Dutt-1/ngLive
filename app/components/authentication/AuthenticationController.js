'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Authentication.controller('AuthenticationController', ['$scope', 'ApiService', 'NotificationService', function($scope, ApiService, NotificationService) {

// Config
    $scope.registerNewUser = function(newUser) {

        if($scope.registerForm.$valid) {
            ApiService.User.save(newUser, function(msg) {
                NotificationService.notify('success', 'Success Message');
                console.log(msg);
            }, function(err) {
                NotificationService.notify('error', 'Error Message');
                console.log(err);
            });
        } else {
            NotificationService.notify('warning', 'Something wrong with the form');
        }
    }
// Run


}]);
