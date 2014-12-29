'use strict';

Authentication.service('AuthenticationService', ['ApiService', function(ApiService) {

    this.currentUserLoggedIn = false;
	var ANONYMOUS_USER = { firstName: 'Guest User', lastName: '', userroles: [{name: 'Anonymous'}] };
    this.currentUser = ANONYMOUS_USER;
 
    this.logInUser = function(user) {
    /* untill userroles are not returned
        this.currentUserLoggedIn = true;
        this.currentUser = user;
        console.log(user);
    */
    // use this temp soln
        this.getUserroleByUserId(user.id);
    };

    this.logOutUser = function() {
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
    this.getUserroleByUserId = function(user_id) {
        var _this = this;
        ApiService.User.get({userId: user_id}, function(userObj) {
            console.log(userObj);
            _this.currentUserLoggedIn = true;
            _this.currentUser = userObj;
        });
    };

}]);
