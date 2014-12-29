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
                PermissionService.isAllowed( $scope.currentUser, [{group: 'UI', permission: 'Show Admin Menu'}], function(allowed) {
                    $scope.showAdminButtons = allowed;
                });
                // Show/Hide logout button
                if($scope.currentUser.userroles[0].name == 'Anonymous') {
                    $scope.isCurrentUserLoggedIn = false;
                } else {
                    $scope.isCurrentUserLoggedIn = true;
                }
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
