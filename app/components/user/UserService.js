'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.service:ApiService
 * @description
 * # ApiService
 * Service of the ngLiveApp
 */

User.service('UserService', ['$resource', function($resource) {

    this.init = function() {
        return 'From UserService Init';
    };

    this.User = $resource('http://localhost:1337/user/:userId', null, {
        'update': {method: 'POST'}
    });

}]);
