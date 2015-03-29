'use strict';

Authentication.service('AuthenticationService', ['$http', 'ApiService', function($http, ApiService) { 

    this.currentUserLoggedIn = false;
	var ANONYMOUS_USER = { firstname: 'Guest User', lastname: '', userroles: [{name: 'Anonymous'}] };
    this.currentUser = ANONYMOUS_USER;
 
    // Init: Fetch default user objects
    (function(_this) {
        ApiService.Auth.getDefaultUsers({}, function(defaultUser) {
            //_this.currentUser = defaultUser.unregisteredUser;
            console.log(defaultUser);
            ANONYMOUS_USER = defaultUser;
            //ANONYMOUS_USER = defaultUser.unregisteredUser;
            _this.logOutUser();
        });
    })(this);

    this.logInUser = function(user) {
        this.currentUserLoggedIn = true;
        this.currentUser = user;
        if(user.token) {
            // Add header to all $http requests now onwards
            $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
        };
    // use this temp soln -- depricated
        //this.getUserroleByUserId(user.id);
    };

    this.logOutUser = function() {
        if(this.currentUser.token) {
            // Clear Token from $http headers
            delete $http.defaults.headers.common.Authorization;
        };
        this.currentUserLoggedIn = false;
        this.currentUser = ANONYMOUS_USER;

    };

    this.isCurrentUserLoggedIn = function() {
        return this.currentUserLoggedIn;
    };

    this.getCurrentUser = function() {
		return this.currentUser;
    };

    // Until user returned by login does not contains userroles
    // user this temp solution to attach them later
    // -- Nevermind
    /*
    this.getUserroleByUserId = function(user_id) {
        var _this = this;
        ApiService.User.get({userId: user_id}, function(userObj) {
            console.log(userObj);
            _this.currentUserLoggedIn = true;
            _this.currentUser = userObj;
        });
    };
    */

}]);
