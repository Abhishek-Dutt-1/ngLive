'use strict';

Mainmenu.directive('mainmenuPartial', function() {
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'components/mainmenu/mainmenuPartial.html',
        //controller: 'MainmenuController',
        //controllerAs: 'ctrl'
    };
});

Mainmenu.directive('mainmenuFooterPartial', function() {
    return {
        scope: {},
        templateUrl: 'components/mainmenu/footerPartial.html'
    };
});
