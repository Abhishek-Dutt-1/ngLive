'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Post.controller('PostController', ['$scope', '$location', '$routeParams', 'ApiService', 'AuthenticationService', 'NotificationService', 'PermissionService', function($scope, $location, $routeParams, ApiService, AuthenticationService, NotificationService, PermissionService) {

// Config
    $scope.postList = [];
    $scope.newPostFormProcessing = false;
    $scope.showLinkForm = true; // show link form by default in Create New Post from
    $scope.clickedPost;

    /* Post CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.userList = ApiService.User.query(function(){}, 
            function(err){console.log(err);
        });
        */
        ApiService.Post.query(function(allPosts) {

                //$scope.postList = allPosts; 
                $scope.postList = $scope.attachPermissions(allPosts);
                /*
                $scope.postList.forEach( function(post) {
                    var perms = [];
                    post.showDelete = false;
                    // A elevated permission user can delete the post any ways
                    perms.push({group: 'post', permission: 'can delete any post'});
                    // check if it's the current users own post
                    if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                        // user can delete own posts if allowed
                        perms.push({group: 'post', permission: 'can delete own post'});
                    } else {
                        // if the post does not belong to current user
                    }
                    PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                        post.showDelete = isAllowed;
                    });
                });
                */
         
            }, 
            function(err){console.log(err);
        });
 
    };

    $scope.deletePost = function(postId) {
        /*
        console.log("DELETING");
        var perms = [];
        $scope.postList.forEach( function(post) {
            if(post.id == postId) {
                console.log(post);
                // A elevated permission user can delete the post any ways
                perms.push({group: 'post', permission: 'can delete any post'});
                // check if it's the current users own post
                if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                    // user can delete own posts if allowed
                    perms.push({group: 'post', permission: 'can delete own post'});
                } else {
                    // if the post does not belong to current user
                }
                console.log(perms);
                PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(xx) {
                    console.log("At least Any");
                    console.log(xx);
                });
            };
        });
        console.log(AuthenticationService.getCurrentUser());
        */
        /*
        PermissionService.isAllowed(AuthenticationService.getCurrentUser(), [{group: 'ui', permission: 'is allowed to delete own posts'}], function(xx) {
            console.log(xx);
        });
        */
        //return;
        ApiService.Post.delete({postId: postId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

// Create a Link post
    $scope.createPostLink = function(newPost) {
        newPost.type = "link";
        newPost.postedby = AuthenticationService.getCurrentUser().id;
        $scope.newPostFormProcessing = true;
        if($scope.newPostLinkForm.$valid) {
            console.log("Link Form Valid");
            ApiService.Post.save(newPost, function(msg) {
                console.log(msg);
                //$scope.fetchAll();
                $scope.newPostFormProcessing = false;
                NotificationService.createNotification( {type: 'success', text: msg.title} );
                $location.path('post/' + msg.id);
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

// Create a Text post
    $scope.createPostText = function(newPost) {
        newPost.type = "text";
        newPost.postedby = AuthenticationService.getCurrentUser().id;
        $scope.newPostFormProcessing = true;
        if($scope.newPostTextForm.$valid) {
            console.log("Link Form Valid");
            ApiService.Post.save(newPost, function(msg) {
                //$scope.fetchAll();
                $scope.newPostFormProcessing = false;
                NotificationService.createNotification( {type: 'success', text: msg.title} );
                $location.path('post/' + msg.id);
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
        ApiService.Post.get({postId: postId}, function(post) {

            $scope.postList = $scope.attachPermissions([post]);
            //$scope.postList = [post];
        }, function(err) {
            console.log(err);
        });
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

    /*
     * Loads given post id in the right pane
     */
    $scope.loadClickedPost = function(postId) {
        ApiService.Post.get({postId: postId}, function(post) {
            $scope.clickedPost = $scope.attachPermissions(post)
            //$scope.clickedPost = post;
        }, function(err) {
            console.log(err);
        });
    };

    // Attach delete, edit permission flag variables
    $scope.attachPermissions = function(posts) {

        var isArray = true;
        if(!Array.isArray(posts)) {
            isArray = false;
            posts = [posts]; 
        };

        posts.forEach( function(post) {
            var perms = [];
            post.showDelete = false;
            // A elevated permission user can delete the post any ways
            perms.push({group: 'post', permission: 'can delete any post'});
            // check if it's the current users own post
            if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                // user can delete own posts if allowed
                perms.push({group: 'post', permission: 'can delete own post'});
            } else {
                // if the post does not belong to current user
            }
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                post.showDelete = isAllowed;
            });
        });

        posts.forEach( function(post) {
            var perms = [];
            post.showEdit = false;
            // A elevated permission user can delete the post any ways
            perms.push({group: 'post', permission: 'can edit any post'});
            // check if it's the current users own post
            if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                // user can delete own posts if allowed
                perms.push({group: 'post', permission: 'can edit own post'});
            } else {
                // if the post does not belong to current user
            }
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                post.showEdit = isAllowed;
            });
        });
        
        return isArray? posts : posts[0];
/*
        $scope.postList.forEach( function(post) {
            var perms = [];
            post.showDelete = false;
            // A elevated permission user can delete the post any ways
            perms.push({group: 'post', permission: 'can delete any post'});
            // check if it's the current users own post
            if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                // user can delete own posts if allowed
                perms.push({group: 'post', permission: 'can delete own post'});
            } else {
                // if the post does not belong to current user
            }
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                post.showDelete = isAllowed;
            });
        });

        $scope.postList.forEach( function(post) {
            var perms = [];
            post.showEdit = false;
            // A elevated permission user can delete the post any ways
            perms.push({group: 'post', permission: 'can edit any post'});
            // check if it's the current users own post
            if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                // user can delete own posts if allowed
                perms.push({group: 'post', permission: 'can edit own post'});
            } else {
                // if the post does not belong to current user
            }
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                post.showEdit = isAllowed;
            });
        });
*/
    };
 

// Run
    // Get all users
    //$scope.fetchAll();
    if($routeParams.postId) {
        $scope.fetchOne($routeParams.postId);
    } else {
        $scope.fetchAll();
    }

    console.log(AuthenticationService.getCurrentUser()); 


}]);
