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
                NotificationService.createNotification( {type: 'success', text: 'Success Message'} );
                console.log(msg);
            }, function(err) {
                NotificationService.createNotification( {type: 'error', text: 'Error Message'} );
                console.log(err);
            });
        } else {
            var id = NotificationService.createNotification( {type: 'warning', text: 'Something wrong with the form'} );
        }

    }
// Run


}]);
