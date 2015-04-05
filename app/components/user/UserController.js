'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

User.controller('UserController', ['$scope', 'ApiService', function($scope, ApiService) {

// Config
    $scope.currentUser = {};
    $scope.userList = [];
    $scope.userroleList = [];
    // This gives a different ng-model name to each select inside ng-repeat
    $scope.userroleSelectModelList = [];

    /* User CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.userList = ApiService.User.query(function(){}, 
            function(err){console.log(err);
        });
        */
        ApiService.User.query(function(allUsers){
                $scope.userList = allUsers; 
            }, 
            function(err){console.log(err);
        });
 
    };

    $scope.deleteUser = function(userId) {
        ApiService.User.delete({userId: userId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createUser = function(user) {
        if(user) {
            ApiService.User.save(user, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.log("No User Input");
        }
    };

    $scope.fetchOne = function(userId) {
        if($.isNumeric(userId)) {
            ApiService.User.get({userId: userId}, function(user) {
                $scope.userList = [user];
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("Invalid UserId");
        }
    };

    $scope.updateUser = function(user) {
        if(user) {
            ApiService.User.update({userId: user.id}, user, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("No User Input");
        }
    };
    /* End User CRUD */

    /* Userrole CRUD */
    $scope.fetchAllUserroles = function() {
        ApiService.Userrole.query(function(allUserroles){
            $scope.userroleList = allUserroles;
            }, function(err) {
            console.log(err);
        });
    };
    /* End Userrole CRUD */


    /* User -> Userrole */
    $scope.removeUserroleFromUser = function(userroleid, userid) {
        // Get the user
        var user = $scope.userList.filter( function(user) { return user.id == userid; } );
        user = user[0];

        // Get remainging roles after deleting userrole
        var roles = user.userroles.filter(function(userrole){ return userrole.id != userroleid; }) 
        // Get an array of these roles ids
        var rolesIds = [];
        roles.forEach( function(role) {
            rolesIds.push(role.id);
        });
        //console.log(rolesIds);
        // Update on the server
        ApiService.User.update({userId: userid}, {userroles: rolesIds}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.addUserroleToUser = function(userroleid, userid) {
         // Get the user
        var user = $scope.userList.filter( function(user) { return user.id == userid; } );
        user = user[0];
        // Check if the user already has the role
        if( !(user.userroles.some(function(role) { return role.id == userroleid; })) ) {
            // Get the new userrole obj // <-- this is alternate (compared to removeing above) since an 
            // String can be passed directly instead of object (with .id prop) and 
            // sails will assume it to be the id
            var newRoleArray = $scope.userroleList.filter(function(role) {return role.id == userroleid; });
            // Add to users existing roles
            user.userroles.push(newRoleArray[0]);
            // Update on the server
            ApiService.User.update({userId: userid}, {userroles: user.userroles }, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });

        };
        
    };
    /* End User -> Userrole */

// Run
    // Get all users
    $scope.fetchAll();
    // Get all Userroles
    $scope.fetchAllUserroles();

}]);
