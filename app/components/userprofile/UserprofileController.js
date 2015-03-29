'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Userprofile.controller('UserprofileController', ['$scope', 'AuthenticationService', 'ApiService', function($scope, AuthenticationService, ApiService) {

// Config
    $scope.userProfile = AuthenticationService.getCurrentUser();
    $scope.options = {};
    $scope.options.list = ["India", "Usa"];

    $scope.updateProfileElement = function(field) {
        var updateObj = {};
        updateObj[field] = $scope.userProfile[field];
        console.log(field);
        console.log(updateObj);

        if($scope.userProfile.id !== undefined) {
            ApiService.User.update({userId: $scope.userProfile.id}, updateObj, function(updatedUser) {
                console.log("Inside save");
                console.log(updatedUser);
            }, function(err) {
                console.log(err);
            });
        } else {
            console.log('No User Id');
        }
    };

// Run


}]);
