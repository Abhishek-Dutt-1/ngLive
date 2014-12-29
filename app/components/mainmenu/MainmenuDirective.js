'use strict';

Mainmenu.directive('mainmenuPartial', ['AuthenticationService', function(AuthenticationService) {
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'components/mainmenu/mainmenuPartial.html',
        controller: function($scope, $element, $attrs, $location) {
			// Watch for Authentication
			$scope.$watch(function(scope) { 
					return AuthenticationService.getCurrentUser();
				}, function(newVal, oldVal) {
					$scope.currentUser = newVal;
					console.log(oldVal);
					console.log(newVal);
			});
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
