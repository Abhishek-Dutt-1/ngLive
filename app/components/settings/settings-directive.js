'use strict';

Settings.directive('settingsLocation', ['ApiService', 'lodash', 'SettingsService', function(ApiService, lodash, SettingsService) {
    return {

        scope: {},

        restrict: 'AE',

        templateUrl: 'components/settings/locationSettingsPartial.html',

        controller: function($scope, $element, $attrs, $location) {
            
            $scope.allLocations = [];

            // TODO: Currently it loads this in the beggining
            // This should only load when the button is pressed
            SettingsService.fetchUniqueLocations(function(allLocations) {
                $scope.allLocations = allLocations;
            });

            $scope.currentGeoSelection = {global: false, continents: [], countries: [], states: [], cities: []};

            $scope.changeSelection = function(selection, type) {
                if(type == 'global') {
                    $scope.currentGeoSelection.global = !$scope.currentGeoSelection.global;
                };
                if(type === 'continent') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.continents.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.continents.splice(pos, 1);
                    } else {
                        // Adding a continent
                        $scope.currentGeoSelection.continents.push(selection);

                        var matchingCountries = lodash.chain($scope.allLocations).filter({continent: selection}).pluck('countries').value()[0]; // pluck returns an array
                        lodash.forEach(matchingCountries, function(country) {
                            // Remove all Countries that belong to this continent
                            if($scope.currentGeoSelection.countries.indexOf(country.country) > -1) {
                                $scope.currentGeoSelection.countries.splice( $scope.currentGeoSelection.countries.indexOf(country.country) , 1);
                            };
                            country.states.forEach(function(state) {
                                // Remove all States that belong to this continent
                                if($scope.currentGeoSelection.states.indexOf(state.state) > -1) {
                                    $scope.currentGeoSelection.states.splice( $scope.currentGeoSelection.states.indexOf(state.state) , 1);
                                };
                                state.cities.forEach(function(city) {
                                    // Remove all Cities that belong to this continent
                                    if($scope.currentGeoSelection.cities.indexOf(city) > -1) {
                                        $scope.currentGeoSelection.cities.splice( $scope.currentGeoSelection.cities.indexOf(city) , 1);
                                    };
                                });
                            });
                        });
                    }
                };
                // 
                if(type === 'country') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.countries.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.countries.splice(pos, 1);
                    } else {
                        // Add a country
                        $scope.currentGeoSelection.countries.push(selection);

                        // First find which continent the selected country belongs to
                        var selectionContinent = '';
                        $scope.allLocations.forEach(function(continent) {
                            continent.countries.forEach(function(country) {
                                if(country.country == selection) {
                                    selectionContinent = continent.continent;
                                };
                            });
                        });

                        var matchingCountries = lodash.chain($scope.allLocations).filter({continent: selectionContinent}).pluck('countries').value()[0]; // pluck returns an array
                        var matchingStates = lodash.chain(matchingCountries).filter({country: selection}).pluck('states').value()[0];

                        // Remove selected countrie's continent also if present
                        if($scope.currentGeoSelection.continents.indexOf(selectionContinent) > -1) {
                            $scope.currentGeoSelection.continents.splice( $scope.currentGeoSelection.continents.indexOf(selectionContinent) , 1);
                        };
                        lodash.forEach(matchingStates, function(state) {
                            // Remove all States that belong to this Country
                            if($scope.currentGeoSelection.states.indexOf(state.state) > -1) {
                                $scope.currentGeoSelection.states.splice( $scope.currentGeoSelection.states.indexOf(state.state) , 1);
                            };
                            state.cities.forEach(function(city) {
                                // Remove all Cities that belong to this State
                                if($scope.currentGeoSelection.cities.indexOf(city) > -1) {
                                    $scope.currentGeoSelection.cities.splice( $scope.currentGeoSelection.cities.indexOf(city) , 1);
                                };
                            });
                        });
                    }
                };
                // 
                if(type === 'state') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.states.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.states.splice(pos, 1);
                    } else {
                        // Add a state
                        $scope.currentGeoSelection.states.push(selection);

                        // First find which Continent and Country the selected state belongs to
                        var selectionContinent = '';
                        var selectionCountry = '';
                        $scope.allLocations.forEach(function(continent) {
                            continent.countries.forEach(function(country) {
                                country.states.forEach(function(state) {
                                    if(state.state == selection) {
                                        selectionContinent = continent.continent;
                                        selectionCountry = country.country;
                                    };
                                });
                            });
                        });
 
                        var matchingCountries = lodash.chain($scope.allLocations).filter({continent: selectionContinent}).pluck('countries').value()[0]; // pluck returns an array
                        var matchingStates = lodash.chain(matchingCountries).filter({country: selectionCountry}).pluck('states').value()[0];
                        var matchingCities = lodash.chain(matchingStates).filter({state: selection}).pluck('cities').value()[0];

                        // Remove selected states's continent also if present
                        if($scope.currentGeoSelection.continents.indexOf(selectionContinent) > -1) {
                            $scope.currentGeoSelection.continents.splice( $scope.currentGeoSelection.continents.indexOf(selectionContinent) , 1);
                        };
                        // Remove selected states's country also if present
                        if($scope.currentGeoSelection.countries.indexOf(selectionCountry) > -1) {
                            $scope.currentGeoSelection.countries.splice( $scope.currentGeoSelection.countries.indexOf(selectionCountry) , 1);
                        };
 
                        lodash.forEach(matchingCities, function(city) {
                            // Remove all Cities that belong to this State
                            if($scope.currentGeoSelection.cities.indexOf(city) > -1) {
                                $scope.currentGeoSelection.cities.splice( $scope.currentGeoSelection.cities.indexOf(city) , 1);
                            };

                        });
                    }
                };
                // 
                if(type === 'city') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.cities.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.cities.splice(pos, 1);
                    } else {
                        // Add the selected City
                        $scope.currentGeoSelection.cities.push(selection);

                        // First find which Continent, Country and State the selected state belongs to
                        var selectionContinent = '';
                        var selectionCountry = '';
                        var selectionState = '';
                        $scope.allLocations.forEach(function(continent) {
                            continent.countries.forEach(function(country) {
                                country.states.forEach(function(state) {
                                    state.cities.forEach(function(city) {
                                        if(city === selection) {
                                            selectionContinent = continent.continent;
                                            selectionCountry = country.country;
                                            selectionState = state.state;
                                        };
                                    });
                                });
                            });
                        });
 
                        var matchingCountries = lodash.chain($scope.allLocations).filter({continent: selectionContinent}).pluck('countries').value()[0]; // pluck returns an array
                        var matchingStates = lodash.chain(matchingCountries).filter({country: selectionCountry}).pluck('states').value()[0];
                        var matchingCities = lodash.chain(matchingStates).filter({state: selectionState}).pluck('cities').value()[0];

                        // Remove selected city's continent also if present
                        if($scope.currentGeoSelection.continents.indexOf(selectionContinent) > -1) {
                            $scope.currentGeoSelection.continents.splice( $scope.currentGeoSelection.continents.indexOf(selectionContinent) , 1);
                        };
                        // Remove selected city's country also if present
                        if($scope.currentGeoSelection.countries.indexOf(selectionCountry) > -1) {
                            $scope.currentGeoSelection.countries.splice( $scope.currentGeoSelection.countries.indexOf(selectionCountry) , 1);
                        };
                        // Remove selected city's state also if present
                        if($scope.currentGeoSelection.states.indexOf(selectionState) > -1) {
                            $scope.currentGeoSelection.states.splice( $scope.currentGeoSelection.states.indexOf(selectionState) , 1);
                        };
 
                    }
                };
 
            };


/*
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
*/

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
