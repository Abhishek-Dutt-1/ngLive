'use strict';

Notification.directive('notification', ['NotificationService', function(NotificationService) {
    return {

        restrict: 'AE',

        scope: {},

        controller: function($scope) {
            $scope.close = function(id) {
                NotificationService.deleteMessage(id);
            }
        },

        link: function($scope) {
            $scope.messageQueue = NotificationService.messageQueue;
        },

        //template: '<div ng-repeat="(id, message) in messageQueue">' +
        //            '<div class="alert alert-{{message.type}}">{{id}} + {{$index}} + {{message}}' +
        //                '<button type="button" class="close" ng-click="close(id)">&times;</button>' + 
        //            '</div></div>'
        template: '<div ng-repeat="message in messageQueue">' +
                    '<div class="alert alert-{{message.type}}">{{message}}' +
                        '<button type="button" class="close" ng-click="close(message.id)">&times;</button>' + 
                    '</div></div>'

    };
 }]);
