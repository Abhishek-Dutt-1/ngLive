'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Userrole.controller('UserroleController', ['$scope', 'ApiService', function($scope, ApiService) {

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
        ApiService.Userrole.query(function(allUserroles){
                $scope.userroleList = allUserroles; 
            }, 
            function(err){console.log(err);
        });
 
    };

    $scope.deleteUserrole = function(userroleId) {
        ApiService.Userrole.delete({userroleId: userroleId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createUserrole = function(userrole) {
        if(userrole) {
            ApiService.Userrole.save(userrole, function() {
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
            ApiService.Userrole.get({userroleId: userroleId}, function(userrole) {
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
            ApiService.Userrole.update({userroleId: userrole.id}, userrole, function() {
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
