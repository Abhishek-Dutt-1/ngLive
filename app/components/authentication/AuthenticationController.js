'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Authentication.controller('AuthenticationController', ['$scope', 'ApiService', 'NotificationService', 'AuthenticationService', function($scope, ApiService, NotificationService, AuthenticationService) {

// Config
    $scope.registerFormProcessing = false;
    $scope.loginFormProcessing = false;

    $scope.registerNewUser = function(newUser) {

        $scope.registerFormProcessing = true;
        if($scope.registerForm.$valid) {
            ApiService.User.save(newUser, function(msg) {
                NotificationService.createNotification( {type: 'success', text: 'Success Message'} );
                $scope.registerFormProcessing = false;
                console.log(msg);
            }, function(err) {
                NotificationService.createNotification( {type: 'danger', text: 'Error Message'} );
                $scope.registerFormProcessing = false;
                console.log(err);
            });
        } else {
            var id = NotificationService.createNotification( {type: 'warning', text: 'Something wrong with the form'} );
            $scope.registerFormProcessing = false;
        }

    };

    $scope.loginUser = function(newUser) {

        $scope.loginFormProcessing = true;
        if($scope.loginForm.$valid) {
            ApiService.Auth.login(newUser, function(msg) {
                NotificationService.createNotification( {type: 'success', text: 'Success Message'} );
                $scope.loginFormProcessing = false;
                console.log(msg);
                AuthenticationService.logInUser(msg.user);
                $scope.currentUser = msg.user;
            }, function(err) {
                NotificationService.createNotification( {type: 'danger', text: 'Error Message'} );
                $scope.loginFormProcessing = false;
                console.log(err);
            });
        } else {
            var id = NotificationService.createNotification( {type: 'warning', text: 'Something wrong with the form'} );
            $scope.loginFormProcessing = false;
        }
    };

// Run


}]);
