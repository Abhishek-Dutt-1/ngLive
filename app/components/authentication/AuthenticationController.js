'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Authentication.controller('AuthenticationController', ['$scope', '$location', '$routeParams', 'ApiService', 'NotificationService', 'AuthenticationService', function($scope, $location, $routeParams, ApiService, NotificationService, AuthenticationService) {

// Config
    $scope.registerFormProcessing = false;
    $scope.loginFormProcessing = false;
    $scope.locationList = [];

    $scope.registerNewUser = function(newUser) {
        console.log(newUser);
        $scope.registerFormProcessing = true;
        if($scope.registerForm.$valid) {
//            ApiService.User.save(newUser, function(msg) {
            ApiService.Auth.register(newUser, function(msg) {
                //NotificationService.createNotification( {type: 'success', text: 'Success Message'} );
                NotificationService.createNotification( {type: 'success', text: msg.data} );
                $scope.registerFormProcessing = false;
                console.log(msg);
            }, function(err) {
                //NotificationService.createNotification( {type: 'danger', text: 'Error Message'} );
                NotificationService.createNotification( {type: 'danger', text: err.data} );
                $scope.registerFormProcessing = false;
                console.log(err);
            });
        } else {
            NotificationService.createNotification( {type: 'warning', text: 'Something wrong with the form'} );
            $scope.registerFormProcessing = false;
        }

    };

    $scope.loginUser = function(newUser) {
        $scope.loginFormProcessing = true;
        if($scope.loginForm.$valid) {
            console.log(newUser);
            ApiService.Auth.login(newUser, function(msg) {
                NotificationService.createNotification( {status: msg.status, type: 'success', text: 'Success Message'} );
                $scope.loginFormProcessing = false;
                console.log(msg);
                AuthenticationService.logInUser(msg.user);
                $location.path('/');
            }, function(err) {
                //NotificationService.createNotification( {type: 'danger', text: 'Error Message'} );
                NotificationService.createNotification( {status: err.status, text: err.data} );
                $scope.loginFormProcessing = false;
                console.log(err);
            });
        } else {
            NotificationService.createNotification( {type: 'warning', text: 'Something wrong with the form'} );
            $scope.loginFormProcessing = false;
        }
    };

    $scope.logOutUser = function() {
        AuthenticationService.logOutUser();
        NotificationService.createNotification( {type: 'success', text: 'Logout Success Message'} );
    };

    // Fetch list of countries to populate register user country select
    $scope.fetchLocations = function() {
        ApiService.Cities.fetchUniqueCountries({}, function(allLocations) {
            $scope.locationList = allLocations;
        });
       
    };

//////////////////// Run


    if(AuthenticationService.isCurrentUserLoggedIn()) {
        // If user logged in
        if($location.path() == '/login') {
            $location.path('/').replace();
        }
        if($location.path() == '/logout') {
            $scope.logOutUser();
            $location.path('/').replace();
        }
    } else {
        // User is not logged In
        // Fetch list of all Countries and Cities
        $scope.fetchLocations();

    }

    // Logged in or not, user might be trying to verify email token
    if($routeParams.token) {
        ApiService.Auth.verifyEmailToken({token: $routeParams.token}, function(msg) {
            NotificationService.createNotification( {type: 'success', text: msg.data} );
            console.log(msg);
        }, function(err) {
            NotificationService.createNotification( {type: 'danger', text: err.data} );
            console.log(err);
        });
    };

}]);
