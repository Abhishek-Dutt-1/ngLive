'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.service:ApiService
 * @description
 * # ApiService
 * Service of the ngLiveApp
 */

Userrole.service('UserroleService', ['$resource', function($resource) {

    this.init = function() {
        return 'From UserroleService Init';
    };

    this.Userrole = $resource('http://localhost:1337/userrole/:userroleId', null, {
        'update': {method: 'POST'}
    });

}]);
