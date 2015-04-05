'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:BoardController
 * @description
 * # BoardController
 * Controller of the ngLiveApp
 */

Board.controller('BoardController', ['$scope', 'ApiService', function($scope, ApiService) {

// Config
    $scope.currentBoard = {};
    $scope.boardList = [];
    //$scope.boardroleList = [];
    // This gives a different ng-model name to each select inside ng-repeat
    //$scope.boardroleSelectModelList = [];

    /* Board CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.boardList = ApiService.Board.query(function(){}, 
            function(err){console.log(err);
        });
        */
        ApiService.Board.query(function(allBoards){
                $scope.boardList = allBoards; 
                console.log(allBoards);
            }, 
            function(err){
                console.log(err);
        });
 
    };

    $scope.deleteBoard = function(boardId) {
        ApiService.Board.delete({boardId: boardId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createBoard = function(board) {
        if(board) {
            ApiService.Board.save(board, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.log("No Board Input");
        }
    };

    $scope.fetchOne = function(boardId) {
        if($.isNumeric(boardId)) {
            ApiService.Board.get({boardId: boardId}, function(board) {
                $scope.boardList = [board];
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("Invalid BoardId");
        }
    };

    $scope.updateBoard = function(board) {
        if(board) {
            ApiService.Board.update({boardId: board.id}, board, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("No Board Input");
        }
    };
    /* End Board CRUD */


// Run
    // Get all boards
    $scope.fetchAll();

}]);
