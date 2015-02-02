'use strict';

Mainmenu.directive('mainmenuPartial', ['AuthenticationService', 'PermissionService', function(AuthenticationService, PermissionService) {
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'components/mainmenu/mainmenuPartial.html',
        controller: function($scope, $element, $attrs, $location) {
            $scope.isCurrentUserLoggedIn = false;
            $scope.showAdminButtons = false;

			// Watch for Authentication
			$scope.$watch(function(scope) { 
                return AuthenticationService.getCurrentUser();
            }, function(newVal, oldVal) {
                $scope.currentUser = newVal;
               // Check permission if user has permission to see admin buttons
                PermissionService.isAllowed( $scope.currentUser, [{group: 'ui', permission: 'show admin menu'}], function(allowed) {
                    $scope.showAdminButtons = allowed;
                });
                // Show/Hide logout button
                $scope.isCurrentUserLoggedIn = AuthenticationService.isCurrentUserLoggedIn();
			});

            // UI ELEMENTS
			// Highlights current button in the menu based on current path
			$scope.isActive = function(route) {
                return route === $location.path();
            };

        },
    };
}]);

Mainmenu.directive('mainmenuFooterPartial', function() {
    return {
        scope: {},
        templateUrl: 'components/mainmenu/footerPartial.html'
    };
});
