'use strict';

Notification.service('NotificationService', [ function() {

    this.messageQueue = [];

    this.init = function() {
        console.log("From Service");
    };

    this.notify = function(type, message) {
        this.messageQueue.push( {type:type, message: message } );
        console.log(this.messageQueue);
    };

    this.deleteMessage = function(id) {
        this.messageQueue.splice(id,1);
    };
     
}]);
