'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.service:ApiService
 * @description
 * # ApiService
 * Service of the ngLiveApp
 */

Permission.service('PermissionService', ['$resource', function($resource) {

    this.init = function() {
        return 'From PermissionService Init';
    };

    this.Permission = $resource('http://localhost:1337/permission/:permissionId', null, {
        'update': {method: 'POST'}
    });

}]);
