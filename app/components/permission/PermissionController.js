'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Permission.controller('PermissionController', ['$scope', '$q', 'ApiService', function($scope, $q, ApiService) {

// Config
    $scope.permissionList = [];
    $scope.userroleList = [];
    $scope.permissionCheckboxes = {};

    /* Permission CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.userList = UserService.User.query(function(){}, 
            function(err){console.log(err);
        });
        */
        // return the promise
        return ApiService.Permission.query(function(allPermissions){
                $scope.permissionList = allPermissions; 
            }, 
            function(err){console.log(err);
        });
    };

    $scope.deletePermission = function(permissionId) {
        ApiService.Permission.delete({permissionId: permissionId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createPermission = function(permission) {
        if(permission) {
            ApiService.Permission.save(permission, function() {
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
            ApiService.Permission.get({permissionId: permissionId}, function(permission) {
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
            ApiService.Permission.update({permissionId: permission.id}, permission, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("No User Input");
        }
    };
    /* End Permission CRUD */

    /* Userroles */
    $scope.fetchAllUserroles = function() {
        return ApiService.Userrole.query(function(allUserroles){
            $scope.userroleList = allUserroles;
        }, function(err) {
            console.log(err);
        });
    };
    /* End Userroles */

    // Revoke permission to a Userrole
    $scope.revokePermissionFromUserrole = function(permissionId, userroleId) {
        // Get the permission
        var permission = $scope.permissionList.filter( function(permission) { return permission.id == permissionId; } );
        permission = permission[0];

        // Get remainging roles after deleting userrole
        var roles = permission.userroles.filter(function(userrole){ return userrole.id != userroleId; }) 
         // Get an array of these roles ids
        var rolesIds = [];
        roles.forEach( function(role) {
            rolesIds.push(role.id);
        });
         // Update on the server
        ApiService.Permission.update({permissionId: permissionId}, {userroles: rolesIds}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    // Add permissions to Userrole
    $scope.allowPermissionToUserrole = function(permissionId, userroleId) {
        // Get the permission
        var permission = $scope.permissionList.filter( function(permission) { return permission.id == permissionId; } );
        permission = permission[0];
        // Check if the permission already has the Userrole
        if( !(permission.userroles.some(function(role) { return role.id == userroleId; })) ) {
            var newRoleArray = $scope.userroleList.filter(function(role) { return role.id == userroleId; });
            // Add to permissions existing roles
            permission.userroles.push(newRoleArray[0]);
            // Update on the server
            ApiService.Permission.update({permissionId: permissionId}, {userroles: permission.userroles}, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        }
    };

    /* Give or remove PermissionId to UserroleId */
    $scope.togglePermission = function(permissionId, userroleId, allowPermission) {
        if(allowPermission) {
            $scope.allowPermissionToUserrole(permissionId, userroleId);
        } else {
            $scope.revokePermissionFromUserrole(permissionId, userroleId);
        }
    };

    // Set initial checkboxs state
    $scope.setCheckboxState = function() {
        $scope.permissionList.forEach( function(permission) {
            $scope.userroleList.forEach( function(userrole) {
                permission.userroles.forEach( function(permissionsUserroles) {
                    if( permissionsUserroles.id == userrole.id ) {
                        $scope.permissionCheckboxes[permission.id + '_' + userrole.id] = true;
                    }
                });
            });
        });
    };

// Run
/*
    // Get all Permissions
    $scope.fetchAll().$promise.then( function(tmp) {
        // Get all Userroles
        return $scope.fetchAllUserroles();
    }).then( function(tmp2) { 
        tmp2.$promise.then( function(tmp3) {
            $scope.setCheckboxState() 
        });
    });
*/
   var promiseArray = [ $scope.fetchAll().$promise, $scope.fetchAllUserroles().$promise ];
    $q.all( promiseArray ).then( function(noop) { 
        $scope.setCheckboxState();
    }, function(noop) { 
        console.log("Err");
    });

}]);
