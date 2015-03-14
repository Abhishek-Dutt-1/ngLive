'use strict';

Mainmenu.directive('voteWidget', ['AuthenticationService', 'PermissionService', function(AuthenticationService, PermissionService) {
    return {
        scope: {
            post: '=post',
            toggleVoteUp: '&toggleVoteUp',
            toggleVoteDown: '&toggleVoteDown',
            //state: '=state'
        },
        restrict: 'AE',
        templateUrl: 'components/vote/vote-partial.html',
    };
}]);

Mainmenu.directive('voteWidgetTest', function() {
    return {
        scope: {},
        templateUrl: 'components/mainmenu/footerPartial.html'
    };
});
