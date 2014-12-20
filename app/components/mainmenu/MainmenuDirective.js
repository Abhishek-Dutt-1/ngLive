'use strict';

Mainmenu.directive('mainmenuPartial', function() {
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'components/mainmenu/mainmenuPartial.html',
//        controller: 'MainmenuController',
        controller: function($scope, $element, $attrs, $location) {
           $scope.isActive = function(route) {
                return route === $location.path(); 
            };
        },
    };
});

Mainmenu.directive('mainmenuFooterPartial', function() {
    return {
        scope: {},
        templateUrl: 'components/mainmenu/footerPartial.html'
    };
});
