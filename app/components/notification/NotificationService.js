'use strict';

Notification.service('NotificationService', [ function() {

    this.messageQueue = [];

    this.createNotification = function(message) {
        // get a new unused message Id
        var newId = this.messageQueue.reduce( function(pv, cv, ind, arr) {
            return pv >= cv.id ? pv : cv.id;
        }, -1);
        newId++;

        message.id = newId;
        this.messageQueue.push( message );
        return message.id;
    };

    this.readNotification = function(id) {
        var message = this.messageQueue.filter( function(el) { return el.id == id; } );
        if(message.length <= 1) {
            message = message[0];
        } else {
            throw new Error('Duplicate Message Ids Found');
        }
        return message;
    };

    this.updateNotification = function(id, message) {
        var i = 0;
        for( i = this.messageQueue.length-1; i >= 0; i--) {
            if (this.messageQueue[i].id == id) {
                message.id = id;
                this.messageQueue[i] = message;
            }
        };
    };

    this.deleteNotification = function(id) {
        var i = 0;
        for( i = this.messageQueue.length-1; i >= 0; i--) {
            if (this.messageQueue[i].id == id) this.messageQueue.splice(i,1);
        };
    };

}]);
