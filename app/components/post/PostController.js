'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Post.controller('PostController', ['$scope', 'ApiService', 'NotificationService', function($scope, ApiService, NotificationService) {

// Config
    $scope.postList = [];
    $scope.newPostFormProcessing = false;

    /* Post CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.userList = ApiService.User.query(function(){}, 
            function(err){console.log(err);
        });
        */
        ApiService.Post.query(function(allPosts){
                $scope.postList = allPosts; 
            }, 
            function(err){console.log(err);
        });
 
    };

    $scope.deletePost = function(postId) {
        ApiService.Post.delete({postId: postId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createPost = function(newPost) {
        $scope.newPostFormProcessing = true;
        if($scope.newPostForm.$valid) {
            console.log("Form Valid");
            ApiService.Post.save(newPost, function(msg) {
                console.log(msg);
                $scope.fetchAll();
                $scope.newPostFormProcessing = false;
                NotificationService.createNotification( {type: 'success', text: msg.title} );
            }, function(err) {
                console.log(err);
                $scope.newPostFormProcessing = false;
                NotificationService.createNotification( {type: 'danger', text: err.data} );
            });
        } else {
            $scope.newPostFormProcessing = false;
            console.log("Form Not Valid");
        }
    };

    $scope.fetchOne = function(postId) {
        if($.isNumeric(postId)) {
            ApiService.Post.get({postId: postId}, function(post) {
                $scope.postList = [post];
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("Invalid PostId");
        }
    };

    $scope.updatePost = function(post) {
        if(post) {
            ApiService.Post.update({postId: post.id}, post, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("No User Input");
        }
    };
    /* End Post CRUD */


// Run
    // Get all users
    $scope.fetchAll();
 
}]);
