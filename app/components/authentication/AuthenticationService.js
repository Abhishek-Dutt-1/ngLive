'use strict';

Authentication.service('AuthenticationService', [ function() {

    this.currentUserLoggedIn = false;
    this.currentUser = {};
 
    this.logInUser = function(user) {
        this.currentUserLoggedIn = true;
        this.currentUser = user;
    };

    this.logOutUser = function() {
        this.currentUserLoggedIn = false;
        this.currentUser = {};
    };

    this.isCurrentUserLoggedIn = function() {
        return this.currentUserLoggedIn;
    };

    this.getCurrentUser = function() {
        if (this.isCurrentUserLoggedIn() === true) {
            return this.currentUser;
        }
        else return false;
    };

}]);
