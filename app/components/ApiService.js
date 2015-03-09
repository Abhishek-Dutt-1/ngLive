'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.service:ApiService
 * @description
 * # ApiService
 * Service of the ngLiveApp
 */

ngLiveApp.service('ApiService', ['$resource', function($resource) {

    var serverAddress = 'http://localhost:1337';

    this.init = function() {
        return 'From ApiService Init';
    };

    this.User = $resource('http://localhost:1337/user/:userId', null, {
        'update': {method: 'POST'}
    });

    this.Userrole = $resource('http://localhost:1337/userrole/:userroleId', null, {
        'update': {method: 'POST'}
    });

    this.Permission = $resource('http://localhost:1337/permission/:permissionId', null, {
        'update': {method: 'POST'}
    });

    this.Auth = $resource('http://localhost:1337/', null, {
        //'login': {method: 'POST', url: 'http://localhost:1337/login'}
        'login': {method: 'POST', url: 'http://localhost:1337/auth/local'},
        'register': {method: 'POST', url: 'http://localhost:1337/auth/local/register'},
        'getDefaultUsers': {method: 'GET', url: 'http://localhost:1337/auth/getdefaultusers'},
        'verifyEmailToken': {method: 'GET', url: 'http://localhost:1337/verify/:token'}
    });

    this.Post = $resource('http://localhost:1337/post/:postId', null, {
        'update': {method: 'POST'},
        'listAllPosts': {method: 'GET', url: 'http://localhost:1337/post/listallposts/', isArray: true},    // gets all posts but only populates postedby, not comments, used for list view of posts
        'getPostById': {method: 'GET', url: 'http://localhost:1337/post/getpostbyid/:postId', isArray: false},    // gets 1 post by id, but deep populates everyting including users in associated comments, used for detail view
        'addCommentToPost':  {method: 'POST', url: 'http://localhost:1337/post/addcommenttopost/'}
    });

    this.Comment = $resource('http://localhost:1337/comment/:commentId', null, {
        'update': {method: 'POST'},
        'addReplyToComment':  {method: 'POST', url: 'http://localhost:1337/comment/addreplytocomment/'}
    });




}]);
