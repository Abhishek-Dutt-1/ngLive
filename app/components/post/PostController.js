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
    $scope.newComment = {};  // Object for storing newComment form data

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
            var deleted = false;
            $scope.clickedPost.comments = $scope.clickedPost.comments.filter(function(comment) { return msg.id != comment.id; }); 
            $scope.clickedPost.comments.forEach(function(comment, ind, arr) {
                comment.childComments = comment.childComments.filter( function(childComment) { return msg.id != childComment.id; } ); 
            });
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


    // NOT USED ANYMORE !!!
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

        // Get the psot along with associations
        ApiService.Post.getPostById({postId: postId}, function(post) {

            $scope.clickedPost = $scope.attachPermissions(post)
            $scope.clickedPost.voteWidget = {state: 'OK'};
            // Check if the current user has voted on this post
            $scope.clickedPost.currentUserVotedUp = false;
            $scope.clickedPost.currentUserVotedDown = false;
            if($scope.clickedPost.votes.length) {
                console.log("Testing votes");
                $scope.clickedPost.votes.forEach(function(vote) {
                    if(vote.voteType == 1 && vote.voteValue == 1) $scope.clickedPost.currentUserVotedUp = true;
                    if(vote.voteType == 1 && vote.voteValue == -1) $scope.clickedPost.currentUserVotedDown = true;
                });
            }

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

            console.log($scope.clickedPost);

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
    $scope.toggleCommentForm = function() {
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

                // Reload the psot
                $scope.loadClickedPost($scope.clickedPost.id);
                $scope.newComment = {};
                $scope.showCommentForm = false;
                $scope.newCommentFormProcessing = false;
 

/* No need/ Sails does this automatically
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
*/
 
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

        // Check Voting Permissions
        posts.forEach( function(post) {
            var perms = [];
            post.showEdit = false;
            // A elevated permission user can delete the post any ways
            perms.push({group: 'vote', permission: 'can vote on any post'});
            // check if it's the current users own post
            if(post.postedby.id == AuthenticationService.getCurrentUser().id) {
                // user can delete own posts if allowed
                perms.push({group: 'vote', permission: 'can vote on own post'});
            } else {
                // if the post does not belong to current user
            }
            PermissionService.isAllowedANY(AuthenticationService.getCurrentUser(), perms, function(isAllowed) {
                // is current user allowed to vote
                post.canVote = isAllowed;
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

    //User voted UP a post
    $scope.toggleVoteUp = function(post) {
        // check voting permissions
        if(!post.canVote) return;

        if($scope.clickedPost.currentUserVotedUp !== true) {

            console.log(post);
            post.voteWidget.state ="loading";
            console.log("Voted UP");
            post.voteWidget.state = "Done";
            post.currentUserVote = "UP";

            console.log(post);
            post.voteWidget.state ="loading";
            console.log("Voted UP");
            //post.voteWidget.state = "Done";
            //post.currentUserVote = "DOWN";
            var vote = {
                votedOn: post.id,
                votedBy: AuthenticationService.getCurrentUser().id,     // Overwritten by backend
                voteType: 1,
                voteValue: 1,
            };
            console.log(vote);

            ApiService.Vote.addVoteToPost(vote, function(msg) {
                //msg is the votedOn post
                console.log(msg);
                // Update Current displayed post
                post.votesUp = msg.votesUp;
                // <------------ THIS SHOULD BE THE ACTUAL USERS VOTE OBJECT, BECAUSE VOTE ID WOULD BE REQURIED TO CANCEL THE VOTE
                // Not really, when cancelling a vote, user's vote can be looked up by the backend and removed there itself
                post.currentUserVotedUp = true;                      
                post.voteWidget.state = "Done";

                // Voting Up automatically cancels a Down vote
                if($scope.clickedPost.currentUserVotedDown == true) {
                    $scope.toggleVoteDown(post);
                }

                NotificationService.createNotification( {type: 'success', text: msg.title} );
            }, function(err) {
                console.log(err);
                NotificationService.createNotification( {type: 'danger', text: err.data} );
            });

        } else {
            console.log(post);
            post.voteWidget.state ="loading";
            console.log("Voted UP Cancel");
            post.voteWidget.state = "Done";
            post.currentUserVote = false;

            console.log(post);
            post.voteWidget.state = "loading";
            console.log("Voted UP Cancel");
            var vote = {
                votedOn: post.id,
                votedBy: AuthenticationService.getCurrentUser().id,
                voteType: 1,
                voteValue: 1,  // Vote value is required if user has given both upvote and downvote, then cancel only the required vote
            };

            ApiService.Vote.cancelUsersVote(vote, function(msg) {
                console.log(msg);
                // Update Current displayed post
                post.votesUp = msg.votesUp;
                // <------------ THIS SHOULD BE THE ACTUAL USERS VOTE OBJECT, BECAUSE VOTE ID WOULD BE REQURIED TO CANCEL THE VOTE
                // Not really, when cancelling a vote, user's vote can be looked up by the backend and removed there itself
                //post.currentUserVote = "DOWN";
                post.currentUserVotedUp = false;                      
                post.voteWidget.state = "Done";
                NotificationService.createNotification( {type: 'success', text: msg.title} );
            }, function(err) {
                console.log(err);
                NotificationService.createNotification( {type: 'danger', text: err.data} );
            });

            //post.voteWidget.state = "Done";
            //post.currentUserVote = false; 
 
        }
    };

    //User voted DOWN a post
    $scope.toggleVoteDown = function(post) {
        // check voting permissions
        if(!post.canVote) return;
 
        // Here we should check for permission if a user is allowed to 
        // vote multiple times, for simplicity we assume its not
        if($scope.clickedPost.currentUserVotedDown !== true) {

            console.log(post);
            post.voteWidget.state ="loading";
            console.log("Voted DOWN");
            //post.voteWidget.state = "Done";
            //post.currentUserVote = "DOWN";
            var vote = {
                votedOn: post.id,
                votedBy: AuthenticationService.getCurrentUser().id,     // Overwritten by backend
                voteType: 1,
                voteValue: -1,
            };
            console.log(vote);

            ApiService.Vote.addVoteToPost(vote, function(msg) {
                console.log(msg);
                // Update Current displayed post
                post.votesDown = msg.votesDown;
                // <------------ THIS SHOULD BE THE ACTUAL USERS VOTE OBJECT, BECAUSE VOTE ID WOULD BE REQURIED TO CANCEL THE VOTE
                // Not really, when cancelling a vote, user's vote can be looked up by the backend and removed there itself
                post.currentUserVotedDown = true;                      
                post.voteWidget.state = "Done";

                // Voting Up automatically cancels a Down vote
                if($scope.clickedPost.currentUserVotedUp == true) {
                    $scope.toggleVoteUp(post);
                }

                NotificationService.createNotification( {type: 'success', text: msg.title} );
            }, function(err) {
                console.log(err);
                NotificationService.createNotification( {type: 'danger', text: err.data} );
            });

        } else {
            console.log(post);
            post.voteWidget.state = "loading";
            console.log("Voted DOWN Cancel");
            var vote = {
                votedOn: post.id,
                votedBy: AuthenticationService.getCurrentUser().id,
                voteType: 1,
                voteValue: -1,  // Vote value is required if user has given both upvote and downvote, then cancel only the required vote
            };

            ApiService.Vote.cancelUsersVote(vote, function(msg) {
                console.log(msg);
                // Update Current displayed post
                post.votesDown = msg.votesDown;
                // <------------ THIS SHOULD BE THE ACTUAL USERS VOTE OBJECT, BECAUSE VOTE ID WOULD BE REQURIED TO CANCEL THE VOTE
                // Not really, when cancelling a vote, user's vote can be looked up by the backend and removed there itself
                //post.currentUserVote = "DOWN";
                post.currentUserVotedDown = false;                      
                post.voteWidget.state = "Done";
                NotificationService.createNotification( {type: 'success', text: msg.title} );
            }, function(err) {
                console.log(err);
                NotificationService.createNotification( {type: 'danger', text: err.data} );
            });

            //post.voteWidget.state = "Done";
            //post.currentUserVote = false; 
        }
    };

// Run
    // Get all users
    //$scope.fetchAll();
    if($routeParams.postId) {
        $scope.fetchOne($routeParams.postId);
    } else {
        $scope.fetchAll();
    }

}]);
