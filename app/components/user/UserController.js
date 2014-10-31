'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

User.controller('UserController', ['$scope', 'UserService', function($scope, UserService) {

// Config
    $scope.currentUser = {};
    $scope.userList = {};

    $scope.fetchAll = function() {
        UserService.User.query(function(allUser){
            $scope.userList = allUser;
        });
    };

    $scope.deleteUser = function(userId) {
        UserService.User.delete({userId: userId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createUser = function(user) {
        UserService.User.save(user, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.fetchOne = function(userId) {
        UserService.User.get({userId: userId}, function(user) {
            $scope.userList = [user];
        }, function(err) {
            console.log(err);
        });
    };

    $scope.updateUser = function(user) {
        console.log(user);
        UserService.User.update({userId: user.id}, user, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

// Run
    $scope.fetchAll();

}]);