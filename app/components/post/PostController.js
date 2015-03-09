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
    $scope.showCommentForm = false;
    $scope.newCommentFormProcessing = false;
    $scope.commentedonId;       // id of the commented on post
    $scope.replyingTo = { type: undefined, obj: {id: undefined} };     // since same form will be used for replyign to posts and comments, keep track what is being replyied to

    /* Post CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.userList = ApiService.User.query(function(){}, 
            function(err){console.log(err);
        });
        */
        ApiService.Post.listAllPosts(function(allPosts) {

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
       ApiService.Post.delete({postId: postId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.deleteComment = function(commentId) {
       ApiService.Comment.delete({commentId: commentId}, function(msg) {
            // comment succeessfully deleted
            // remove it from the frontend ui
            $scope.clickedPost.comments = $scope.clickedPost.comments.filter(function(comment) { return msg.id != comment.id; }); 
            //$scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };


// Create a Link post
    $scope.createPostLink = function(newPost) {
        $scope.newPostFormProcessing = true;
        if($scope.newPostLinkForm.$valid) {
            newPost.type = "link";
            newPost.postedby = AuthenticationService.getCurrentUser().id;
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
        $scope.newPostFormProcessing = true;
        if($scope.newPostTextForm.$valid) {
            newPost.type = "text";
            newPost.postedby = AuthenticationService.getCurrentUser().id;
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


    // not used anymore
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
        // Reset comment form
        $scope.showCommentForm = false;
        $scope.replyingTo = { type: undefined, obj: {id: undefined} };       
//        ApiService.Post.get({postId: postId}, function(post) {
        ApiService.Post.getPostById({postId: postId}, function(post) {

            $scope.clickedPost = $scope.attachPermissions(post)

            // Attach permissions to comments
            $scope.clickedPost.comments.forEach(function(comment, ind, arr) {
                arr[ind] = $scope.attachPermissionsToComments(comment);
            });

            // Attach permissions to childComments of the comments
            $scope.clickedPost.comments.forEach(function(comment, ind, arr) {
                //console.log( $scope.attachPermissionsToComments(comment.childComments) );
                arr[ind].childComments = $scope.attachPermissionsToComments(comment.childComments);
                //console.log(comment.childComments);
            });

        }, function(err) {
            console.log(err);
        });
    };

    // Show comment form 
    $scope.displayCommentForm = function(post, postType) {
        $scope.showCommentForm = true; //!$scope.showCommentForm;        
        $scope.replyingTo = {type: postType, obj: post};
    };
    // show hide comment form
    $scope.toggleCommentForm = function( ) {
        $scope.showCommentForm = !$scope.showCommentForm;
    };

    // save the actual new comment
    $scope.createComment = function(newComment) {
        if(!$scope.replyingTo.obj.id) {
            return;
        };

        $scope.newCommentFormProcessing = true;
        if($scope.newCommentForm.$valid) {
            newComment.postedby = AuthenticationService.getCurrentUser().id;

            // Comment could be reply to POST
            if($scope.replyingTo.type == 'post') {
                newComment.commentedon = $scope.replyingTo.obj.id; 
            };
            // OR could be reply to existing COMMENT
            if($scope.replyingTo.type == 'comment') {
                newComment.parentComment = $scope.replyingTo.obj.id; 
            };

           ApiService.Comment.save(newComment, function(msg) {

                // first create the new comment
                // get its id
                // update original posts/comment with this id
                
                if($scope.replyingTo.type == 'post') {
                    ApiService.Post.addCommentToPost({postid: newComment.commentedon, commentid: msg.id}, function(msg2) {
                        console.log(msg2);
                        // Load whole post
                        $scope.loadClickedPost(msg2.savedPost.id);
                        NotificationService.createNotification( {type: 'success', text: "Comment added"} );
                        $scope.newCommentFormProcessing = false;
                    }, function(err2) {
                        console.log(err2);
                    });
                };

                if($scope.replyingTo.type == 'comment') {
                    ApiService.Comment.addReplyToComment({parentcommentid: newComment.parentComment, commentid: msg.id, commentedon: $scope.clickedPost.id}, function(msg2) {
                        $scope.loadClickedPost($scope.clickedPost.id);
                        //$scope.clickedPost = $scope.attachPermissions(msg2.savedPost);
                        NotificationService.createNotification( {type: 'success', text: "Comment added"} );
                        $scope.newCommentFormProcessing = false;
                    }, function(err2) {
                        console.log(err2);
                    });
                };
 
            }, function(err) {
                console.log(err);
                $scope.newCommentFormProcessing = false;
                NotificationService.createNotification( {type: 'danger', text: err.data} );
            });
        } else {
            $scope.newCommentFormProcessing = false;
            console.log("Comment Form Not Valid");
        }
 
    };

    // Attach delete, edit permission flag variables (For Post)
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

        posts.forEach( function(post) {
            var perms = [];
            post.showReply = false;
            // A elevated permission user can delete the post any ways
            perms.push({group: 'comment', permission: 'can create comment'});
            // check if it's the current users own post
            /*
            if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                // user can delete own posts if allowed
                perms.push({group: 'post', permission: 'can edit own post'});
            } else {
                // if the post does not belong to current user
            }
            */
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                post.showReply = isAllowed;
            });
        });
 
        return isArray? posts : posts[0];
    };

    // Attach delete, edit permission flag variables (For Comments)
    $scope.attachPermissionsToComments = function(comments) {

        var isArray = true;
        if(!Array.isArray(comments)) {
            isArray = false;
            comments = [comments]; 
        };

        comments.forEach( function(comment) {
            var perms = [];
            comment.showDelete = false;
            // A elevated permission user can delete the comment any ways
            perms.push({group: 'comment', permission: 'can delete any comment'});
            // check if it's the current users own comment
            if(comment.postedby.id == AuthenticationService.getCurrentUser().id) {
                // user can delete own comments if allowed
                perms.push({group: 'comment', permission: 'can delete own comment'});
            } else {
                // if the comment does not belong to current user
            }
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                comment.showDelete = isAllowed;
            });
        });

        comments.forEach( function(comment) {
            var perms = [];
            comment.showReply = false;
            // A elevated permission user can delete the comment any ways
            perms.push({group: 'comment', permission: 'can create comment'});
            // check if it's the current users own comment
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                comment.showReply = isAllowed;
            });
        });
 
        return isArray? comments : comments[0];
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
