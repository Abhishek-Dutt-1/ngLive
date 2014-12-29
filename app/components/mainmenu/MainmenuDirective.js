'use strict';

Mainmenu.directive('mainmenuPartial', [ 'AuthenticationService', function(AuthenticationService) {
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'components/mainmenu/mainmenuPartial.html',
//        controller: 'MainmenuController',
        controller: function($scope, $element, $attrs, $location) {

            $scope.$watch(AuthenticationService.currentUserLoggedIn, loadUser);

            function loadUser() {
                $scope.currentUser = AuthenticationService.getCurrentUser();
            };

           $scope.isActive = function(route) {
                return route === $location.path(); 
            };
        },
        /*
        link: function($scope) {
            $scope.currentUser = AuthenticationService.currentUser;
        },
        */
    };
}]);

Mainmenu.directive('mainmenuFooterPartial', function() {
    return {
        scope: {},
        templateUrl: 'components/mainmenu/footerPartial.html'
    };
});
