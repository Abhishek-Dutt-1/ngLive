'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Images.controller('ImagesController', ['$scope', 'ApiService', function($scope, ApiService) {

// Config
    $scope.imgurAuthUrl = '';

    // Init:: 
    $scope.fetchAuthUrl = function(services) {

        ApiService.Images.fetchAuthUrl({services: services}, function(data) {
            $scope.imgurAuthUrl = data.authUrl;
        }, function(err) {
            console.log("ERROR");
            console.log(err);
        });
    };

    /** 
     * Fetch all albums belongign to 
     * the official app imgur account
     */
    $scope.fetchAllAlbums = function() {
        ApiService.Images.fetchAllAlbums(function(data) {
            console.log(data);
            $scope.imgur.albums = data.data;

        }, function(err) {
            console.log("ERROR");
            console.log(err);
        });
    };

    /**
     * Create a new album
     */
    $scope.createNewAlbum = function(newAlbum) {
        if(!newAlbum) {
            console.log("NO ALBUM GIVEN");
            console.log(newAlbum);
            return;
        }
        console.log(newAlbum);
        ApiService.Images.createNewAlbum(newAlbum, function(data) {
            console.log(data);
        }, function(err) {
            console.log("ERROR");
            console.log(err);
        });
    };

    /*
    $scope.authorizeImgur = function() {
        console.log("Auth Imgur");
    };
    */

// Run
    $scope.fetchAuthUrl();
    //$scope.fetchAllAlbums();
}]);
