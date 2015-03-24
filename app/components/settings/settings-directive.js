'use strict';

Settings.directive('settingsLocation', ['PermissionService', function(AuthenticationService, PermissionService) {
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'components/settings/locationSettingsPartial.html',
        controller: function($scope, $element, $attrs, $location) {
            $scope.currentGeoSelection = {global: false, continents: [], countries: [], states: []};
            $scope.geo = {};
            $scope.geo.continents = ['Asia', 'Europe', 'North America', 'South America', 'Africa'];

            $scope.loadCountries = function(continent) {
                if(continent == 'Asia') {
                    $scope.geo.countries = [{name: 'India', code: 'IN'}, {name: 'Russia', code: 'RU'}, {name: 'China', code: 'CN'}, {name: 'Malaysia', code: 'MY'}, {name: 'Thailand', code: 'TH'}];
                } else {
                    $scope.geo.countries = [];
                }
                $scope.changeSelection(continent, "continent");
            };

            $scope.loadStates = function(country) {
                if(country.code == 'IN') {
                    $scope.geo.states = [
                                            {name: 'Andhra Pradesh', code: 'AP'},
                                            {name: 'Arunachal Pradesh', code: 'AR'},
                                            {name: 'Assam', code: 'AS'},
                                            {name: 'Bihar', code: 'BR'},
                                            {name: 'Chhattisgarh', code: 'CT'},
                                            {name: 'Goa', code: 'GA'},
                                            {name: 'Gujarat', code: 'GJ'},
                                            {name: 'Haryana', code: 'HR'},
                                            {name: 'Himachal Pradesh', code: 'HP'},
                                            {name: 'Jammu and Kashmir', code: 'JK'},
                                            {name: 'Jharkhand', code: 'JH'},
                                            {name: 'Karnataka', code: 'KA'},
                                            {name: 'Kerala', code: 'KL'},
                                            {name: 'Maharashtra', code: 'MH'},
                                            {name: 'Manipur', code: 'MN'},
                                            {name: 'Meghalaya', code: 'ML'},
                                            {name: 'Mizoram', code: 'MZ'},
                                            {name: 'Nagaland', code: 'NL'},
                                            {name: 'Odisha', code: 'OR'},
                                            {name: 'Punjab', code: 'PB'},
                                            {name: 'Rajasthan', code: 'RJ'},
                                            {name: 'Sikkim', code: 'SK'},
                                            {name: 'Tamil Nadu', code: 'TN'},
                                            {name: 'Telangana', code: 'TG'},
                                            {name: 'Tripura', code: 'TR'},
                                            {name: 'Uttarakhand', code: 'UT'},
                                            {name: 'Uttar Pradesh', code: 'UP'},
                                            {name: 'West Bengal', code: 'WB'},
                                            {name: 'Andaman and Nicobar Islands', code: 'AN'},
                                            {name: 'Chandigarh', code: 'CH'},
                                            {name: 'Dadra and Nagar Haveli', code: 'DN'},
                                            {name: 'Daman and Diu', code: 'DD'},
                                            {name: 'Delhi', code: 'DL'},
                                            {name: 'Lakshadweep', code: 'LD'},
                                            {name: 'Puducherry', code: 'PY'},
                                        ];


                } else {
                    $scope.geo.states = [];
                }
                $scope.changeSelection(country, "country");
            };

            $scope.loadCities = function(state) {
                // Populate Cities here
                //$scope.geo.states = $scope.geo.states.filter(function(state) { return state.code == state.code; });

                $scope.changeSelection(state, "state");
            };

            $scope.changeSelection = function(selection, type) {
                if(type == 'global') {
                    $scope.currentGeoSelection.global = !$scope.currentGeoSelection.global;
                };
                if(type == 'continent') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.continents.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.continents.splice(pos, 1);
                    } else {
                        $scope.currentGeoSelection.continents.push(selection);
                    }
                };
                // 
                if(type == 'country') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.countries.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.countries.splice(pos, 1);
                    } else {
                        $scope.currentGeoSelection.countries.push(selection);
                    }
                };
                // 
                if(type == 'state') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.states.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.states.splice(pos, 1);
                    } else {
                        $scope.currentGeoSelection.states.push(selection);
                    }
                };



            };

            /*
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
                PermissionService.isAllowed( $scope.currentUser, [{group: 'post', permission: 'can create post'}], function(allowed) {
                    $scope.canCreatePost = allowed;
                });
                // Show/Hide logout button
                $scope.isCurrentUserLoggedIn = AuthenticationService.isCurrentUserLoggedIn();
			});

            // UI ELEMENTS
			// Highlights current button in the menu based on current path
			$scope.isActive = function(route) {
                return route === $location.path();
            };
            */
        },
    };
}]);
