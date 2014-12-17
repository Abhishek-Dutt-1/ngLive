'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.service:ApiService
 * @description
 * # ApiService
 * Service of the ngLiveApp
 */

ngLiveApp.service('ApiService', ['$resource', function($resource) {

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


}]);