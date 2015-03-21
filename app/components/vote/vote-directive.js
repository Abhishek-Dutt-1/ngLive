'use strict';

Vote.directive('voteWidget', [function() {
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
