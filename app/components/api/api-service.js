'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.service:ApiService
 * @description
 * # ApiService
 * Service of the ngLiveApp
 */

Api.service('ApiService', ['$resource', function($resource) {

    var serverAddress = 'http://localhost:1337';

    var init = function() {
        return 'From ApiService Init';
    };

    this.User = $resource(serverAddress+'/user/:userId', null, {
        'update': {method: 'POST'}
    });

    this.Board = $resource(serverAddress+'/board/:boardId', null, {
        'update': {method: 'POST'}
    });

    this.Userrole = $resource(serverAddress+'/userrole/:userroleId', null, {
        'update': {method: 'POST'}
    });

    this.Permission = $resource(serverAddress+'/permission/:permissionId', null, {
        'update': {method: 'POST'}
    });

    this.Cities = $resource(serverAddress+'/cities/:citiesId', null, {
        'update'              : {method: 'POST'},
        'fetchUniqueLocations': {method: 'GET', url: serverAddress+'/cities/fetchuniquelocations/', isArray: true},
        'fetchUniqueCountries': {method: 'GET', url: serverAddress+'/cities/fetchuniquecountries/', isArray: true}
    });

    this.Auth = $resource(serverAddress+'/', null, {
        //'login': {method: 'POST', url: serverAddress+'/login'}
        'login'           : {method: 'POST', url: serverAddress+'/auth/local'},
        'register'        : {method: 'POST', url: serverAddress+'/auth/local/register'},
        'getDefaultUsers' : {method: 'GET', url: serverAddress+'/auth/getdefaultusers'},
        'verifyEmailToken': {method: 'GET', url: serverAddress+'/verify/:token'}
    });

    this.Post = $resource(serverAddress+'/post/:postId', null, {
        'update'           : {method: 'POST'},
        // gets all posts but only populates postedby, not comments, used for list view of posts
        'listAllPosts'     : {method: 'POST', url: serverAddress+'/post/listallposts/', isArray: true},
        // gets 1 post by id, but deep populates everyting including users in associated comments, used for detail view
        'getPostById'      : {method: 'GET', url: serverAddress+'/post/getpostbyid/:postId', isArray: false},
        'addCommentToPost' :  {method: 'POST', url: serverAddress+'/post/addcommenttopost/'},
        'savePostWithBoard': {method: 'POST', url: serverAddress+'/post/savepostwithboard/'},
    });

    this.Comment = $resource(serverAddress+'/comment/:commentId', null, {
        'update'           : {method: 'POST'},
        'addReplyToComment':  {method: 'POST', url: serverAddress+'/comment/addreplytocomment/'}
    });

    this.Vote = $resource(serverAddress+'/vote/:voteId', null, {
        'update'         : {method: 'POST'},
        'addVoteToPost'  :  {method: 'POST', url: serverAddress+'/vote/addvotetopost/'},
        'cancelUsersVote':  {method: 'POST', url: serverAddress+'/vote/cancelUsersVote/'}
    });

    this.Images = $resource(serverAddress+'/images/:imagesUrl', null, {
        'fetchAuthUrl'  : {method: 'POST', url: serverAddress+'/images/fetchAuthUrl/'},
        'fetchAllAlbums': {method: 'GET', url: serverAddress+'/images/fetchAllAlbums/'},
        'createNewAlbum': {method: 'POST', url: serverAddress+'/images/createNewAlbum/'},
    });


}]);
