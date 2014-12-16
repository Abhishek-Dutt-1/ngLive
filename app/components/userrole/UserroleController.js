'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Userrole.controller('UserroleController', ['$scope', 'UserroleService', function($scope, UserroleService) {

// Config
    $scope.currentUser = {};
    $scope.userroleList = [];

    /* Userrole CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.userList = UserService.User.query(function(){}, 
            function(err){console.log(err);
        });
        */
        UserroleService.Userrole.query(function(allUserroles){
                $scope.userroleList = allUserroles; 
            }, 
            function(err){console.log(err);
        });
 
    };

    $scope.deleteUserrole = function(userroleId) {
        UserroleService.Userrole.delete({userroleId: userroleId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createUserrole = function(userrole) {
        if(userrole) {
            UserroleService.Userrole.save(userrole, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.log("No User Input");
        }
    };

    $scope.fetchOne = function(userroleId) {
        if($.isNumeric(userroleId)) {
            UserroleService.Userrole.get({userroleId: userroleId}, function(userrole) {
                $scope.userroleList = [userrole];
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("Invalid UserId");
        }
    };

    $scope.updateUserrole = function(userrole) {
        if(userrole) {
            UserroleService.Userrole.update({userroleId: userrole.id}, userrole, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("No User Input");
        }
    };
    /* End Userrole CRUD */

// Run
    // Get all users
    $scope.fetchAll();
}]);
