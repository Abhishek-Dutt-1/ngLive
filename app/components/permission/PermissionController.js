'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Permission.controller('PermissionController', ['$scope', 'PermissionService', function($scope, PermissionService) {

// Config
    $scope.permissionList = [];

    /* User CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.userList = UserService.User.query(function(){}, 
            function(err){console.log(err);
        });
        */
        PermissionService.Permission.query(function(allPermissions){
                $scope.permissionList = allPermissions; 
            }, 
            function(err){console.log(err);
        });
    };

    $scope.deletePermission = function(permissionId) {
        PermissionService.Permission.delete({permissionId: permissionId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createPermission = function(permission) {
        if(permission) {
            PermissionService.Permission.save(permission, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.log("No User Input");
        }
    };

    $scope.fetchOne = function(permissionId) {
        if($.isNumeric(permissionId)) {
            PermissionService.Permission.get({permissionId: permissionId}, function(permission) {
                $scope.permissionList = [permission];
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("Invalid UserId");
        }
    };

    $scope.updatePermission = function(permission) {
        if(permission) {
            PermissionService.Permission.update({permissionId: permission.id}, permission, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("No User Input");
        }
    };
    /* End User CRUD */

// Run
    // Get all users
    $scope.fetchAll();

}]);
