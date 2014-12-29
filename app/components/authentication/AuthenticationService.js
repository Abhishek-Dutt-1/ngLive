'use strict';

Authentication.service('AuthenticationService', [ function() {

    this.currentUserLoggedIn = false;
	var ANONYMOUS_USER = {firstName: 'Anon', lastName: 'Anon'};
    this.currentUser = ANONYMOUS_USER;
 
    this.logInUser = function(user) {
        this.currentUserLoggedIn = true;
        this.currentUser = user;
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
		/*
        if (this.isCurrentUserLoggedIn() === true) {
            return this.currentUser;
        }
        else return false;
		*/
    };

}]);
