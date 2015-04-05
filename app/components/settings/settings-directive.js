'use strict';

Settings.directive('settingsLocation', ['ApiService', 'lodash', 'SettingsService', 'AuthenticationService', function(ApiService, lodash, SettingsService, AuthenticationService) {

    return {

        scope: {},

        restrict: 'AE',

        templateUrl: 'components/settings/locationSettingsPartial.html',

        controller: function($scope, $element, $attrs, $location) {
            
            $scope.allLocations = [];
            $scope.currentGeoSelection = {}; //{planetSetting: [], continentSetting: [], countrySetting: [], stateSetting: [], citySetting: []};

            /** 
             * Initialize new fetched array elelments as selelcted
             * This should be above fetchUniqueLocations
             * Initialize allLocations with user's selection 
             * This is run every time when users changes tabs, or logs in
             */  
            $scope.initializeAllLocationsSelected = function() {
                console.log("Inside init");
               $scope.allLocations.forEach( function(planet) {
                    if ( $scope.currentGeoSelection.planetSetting.indexOf(planet.planet) > -1 ) {
                        planet.selected = true;
                    } else {
                        planet.selected = false;
                    }
                    planet.continents.forEach( function(continent) {
                        if ( $scope.currentGeoSelection.continentSetting.indexOf(continent.continent) > -1 ) {
                            continent.selected = true;
                        } else {
                            continent.selected = false;
                        }
                        continent.countries.forEach( function(country) {
                            if ( $scope.currentGeoSelection.countrySetting.indexOf(country.country) > -1 ) {
                                country.selected = true;
                            } else {
                                country.selected = false;
                            }
                            country.states.forEach( function(state) {
                                if ( $scope.currentGeoSelection.stateSetting.indexOf(state.state) > -1 ) {
                                    state.selected = true;
                                } else {
                                    state.selected = false;
                                }
                                state.cities.forEach( function(city) {
                                    if ( $scope.currentGeoSelection.citySetting.indexOf(city.city) > -1 ) {
                                        city.selected = true;
                                    } else {
                                        city.selected = false;
                                    }
                                });
                            });
                        });
                    });
               });
                return;
            };

            // TODO: Currently it loads this in the beggining
            // This should only load when the button is pressed
            SettingsService.fetchUniqueLocations( function(err, allLocations) {
                if(err) console.log(err);
                //var _scope = $scope;
                $scope.allLocations = allLocations;
                $scope.currentGeoSelection = SettingsService.fetchUserGeoLocationSettings();
                $scope.initializeAllLocationsSelected();
                //SettingsService.fetchUserGeoLocationSettings( function(geoSelection, err) {
                //    if(err) console.log(err);
                //    $scope.currentGeoSelection = geoSelection;
                //    console.log(geoSelection);
                    /**
                     * Initialize allLocations with user's selection 
                     * This is run every time when users changes tabs, or logs in
                     */  
                //    _scope.initializeAllLocationsSelected();
                //});
            });

            // This is just to update Geo selection's selected flag, when user logs in
            // UPDATE: This is not needed any mode due to _scope above
            /*
            $scope.$watch(function(scope) { 
                return AuthenticationService.getCurrentUser();
            }, function(newVal, oldVal) {
                console.log("USER LOGGED IN");
                $scope.initializeAllLocationsSelected();
            });
            */
 
            // Generally toggels, but can set using 3rd argument
            $scope.toggleSelected = function(selection, type, value) {

                $scope.allLocations.forEach(function(planet) {
                    if(type === 'planet') {
                        if (planet.planet === selection) {
                            //if(planet.selected) {     // THis is to check first time, selected should be undefined first time
                                planet.selected = !planet.selected;
                            //} else {
                            //    planet.selected = true;
                            //}
                            if(value !== undefined) {
                                planet.selected = value;
                            }
                        }
                    } else {
                        planet.continents.forEach(function(continent) {
                            if(type === 'continent') {
                                if (continent.continent === selection) {
                                    //if(continent.selected) {
                                        continent.selected = !continent.selected;
                                    //} else {
                                    //    continent.selected = true;
                                    //}
                                    if(value !== undefined) {
                                        continent.selected = value;
                                    }
                                }
                            } else {
                                continent.countries.forEach(function(country) {
                                    if(type === 'country') {
                                        if (country.country === selection) {
                                            //if(country.selected) {
                                                country.selected = !country.selected;
                                            //} else {
                                            //    country.selected = true;
                                            //}
                                            if(value !== undefined) {
                                                continent.selected = value;
                                            }
                                        }
                                    } else {
                                        country.states.forEach(function(state) {
                                            if(type === 'state') {
                                                if (state.state === selection) {
                                                    //if(state.selected) {
                                                        state.selected = !state.selected;
                                                    //} else {
                                                    //    state.selected = true;
                                                    //}
                                                    if(value !== undefined) {
                                                        state.selected = value;
                                                    }
                                                }
                                            } else {
                                                state.cities.forEach(function(city) {
                                                    if(type === 'city') {
                                                        if (city.city === selection) {
                                                            ////if(city.selected) {
                                                                city.selected = !city.selected;
                                                            //} else {
                                                            //    city.selected = true;
                                                            //}
                                                            if(value !== undefined) {
                                                                city.selected = value;
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }); 
                    }
                });
            };


            $scope.changeSelection = function(selection, type) {

                // TODO:: Find a better way to do this
                $scope.toggleSelected(selection, type);

                if(type == 'planet') {
                    var pos = $scope.currentGeoSelection.planetSetting.indexOf(selection);

                    if(pos > -1) {
                        $scope.currentGeoSelection.planetSetting.splice(pos, 1);
                    } else {
                        // Adding a Planet
                        $scope.currentGeoSelection.planetSetting.push(selection);

                        var matchingContinents = lodash.chain($scope.allLocations).filter({planet: selection}).pluck('continents').value()[0]; // pluck returns an array

                        lodash.forEach(matchingContinents, function(continent) {
                            // Remove all Continents that belong to this planet
                            if($scope.currentGeoSelection.continentSetting.indexOf(continent.continent) > -1) {
                                $scope.currentGeoSelection.continentSetting.splice( $scope.currentGeoSelection.continentSetting.indexOf(continent.continent) , 1);
                                continent.selected = false;
                            };
                            continent.countries.forEach(function(country) {
                                // Remove all Countries that belong to this continent
                                if($scope.currentGeoSelection.countrySetting.indexOf(country.country) > -1) {
                                    $scope.currentGeoSelection.countrySetting.splice( $scope.currentGeoSelection.countrySetting.indexOf(country.country) , 1);
                                    country.selected = false;
                                };
                                country.states.forEach(function(state) {
                                    // Remove all States that belong to this continent
                                    if($scope.currentGeoSelection.stateSetting.indexOf(state.state) > -1) {
                                        $scope.currentGeoSelection.stateSetting.splice( $scope.currentGeoSelection.stateSetting.indexOf(state.state) , 1);
                                        state.selected = false;
                                    };
                                    state.cities.forEach(function(city) {
                                        // Remove all Cities that belong to this continent
                                        if($scope.currentGeoSelection.citySetting.indexOf(city.city) > -1) {
                                            $scope.currentGeoSelection.citySetting.splice( $scope.currentGeoSelection.citySetting.indexOf(city.city) , 1);
                                            city.selected = false;
                                        };
                                    });
                                });
                            });
                        });
                    }
 
                };
                if(type === 'continent') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.continentSetting.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.continentSetting.splice(pos, 1);
                    } else {
                        // Adding a continent
                        $scope.currentGeoSelection.continentSetting.push(selection);

                        // First find which Planet the selected continent belongs to
                        var selectionPlanet = '';
                        $scope.allLocations.forEach(function(planet) {
                            planet.continents.forEach(function(continent) {
                                if(continent.continent == selection) {
                                    selectionPlanet = planet.planet;
                                };
                            });
                        });
                        // Remove selected Continents's planet also if present
                        if($scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) > -1) {
                            $scope.currentGeoSelection.planetSetting.splice( $scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) , 1);
                            $scope.toggleSelected(selectionPlanet, 'planet', false);
                        };

                        var matchingContinents = lodash.chain($scope.allLocations).filter({planet: selectionPlanet}).pluck('continents').value()[0]; // pluck returns an array
                        var matchingCountries = lodash.chain(matchingContinents).filter({continent: selection}).pluck('countries').value()[0];
                        //var matchingCountries = lodash.chain($scope.allLocations.).filter({continent: selection}).pluck('countrySetting').value()[0]; // pluck returns an array
                        lodash.forEach(matchingCountries, function(country) {
                            // Remove all Countries that belong to this continent
                            if($scope.currentGeoSelection.countrySetting.indexOf(country.country) > -1) {
                                $scope.currentGeoSelection.countrySetting.splice( $scope.currentGeoSelection.countrySetting.indexOf(country.country) , 1);
                                country.selected = false;
                            };
                            country.states.forEach(function(state) {
                                // Remove all States that belong to this continent
                                if($scope.currentGeoSelection.stateSetting.indexOf(state.state) > -1) {
                                    $scope.currentGeoSelection.stateSetting.splice( $scope.currentGeoSelection.stateSetting.indexOf(state.state) , 1);
                                    state.selected = false;
                                };
                                state.cities.forEach(function(city) {
                                    // Remove all Cities that belong to this continent
                                    if($scope.currentGeoSelection.citySetting.indexOf(city.city) > -1) {
                                        $scope.currentGeoSelection.citySetting.splice( $scope.currentGeoSelection.citySetting.indexOf(city.city) , 1);
                                        city.selected = false;
                                    };
                                });
                            });
                        });
                    }
                };
                // 
                if(type === 'country') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.countrySetting.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.countrySetting.splice(pos, 1);
                    } else {
                        // Add a country
                        $scope.currentGeoSelection.countrySetting.push(selection);

                        // First find which planet and continent the selected country belongs to
                        var selectionPlanet = '';
                        var selectionContinent = '';
                        $scope.allLocations.forEach(function(planet) {
                            planet.continents.forEach(function(continent) {
                                continent.countries.forEach(function(country) {
                                    if(country.country == selection) {
                                        selectionPlanet = planet.planet;
                                        selectionContinent = continent.continent;
                                    };
                                });
                            });
                        });

                       // Remove selected countrie's Planet also if present
                        if($scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) > -1) {
                            $scope.currentGeoSelection.planetSetting.splice( $scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) , 1);
                            $scope.toggleSelected(selectionPlanet, 'planet', false);
                        };
                        // Remove selected countrie's continent also if present
                        if($scope.currentGeoSelection.continentSetting.indexOf(selectionContinent) > -1) {
                            $scope.currentGeoSelection.continentSetting.splice( $scope.currentGeoSelection.continentSetting.indexOf(selectionContinent) , 1);
                            $scope.toggleSelected(selectionContinent, 'continent', false);
                        };

                        var matchingContinents = lodash.chain($scope.allLocations).filter({planet: selectionPlanet}).pluck('continents').value()[0]; // pluck returns an array
                        var matchingCountries = lodash.chain(matchingContinents).filter({continent: selectionContinent}).pluck('countries').value()[0]; // pluck returns an array
                        var matchingStates = lodash.chain(matchingCountries).filter({country: selection}).pluck('states').value()[0];
                        lodash.forEach(matchingStates, function(state) {
                            // Remove all States that belong to this Country
                            if($scope.currentGeoSelection.stateSetting.indexOf(state.state) > -1) {
                                $scope.currentGeoSelection.stateSetting.splice( $scope.currentGeoSelection.stateSetting.indexOf(state.state) , 1);
                                state.selected = false;
                            };
                            state.cities.forEach(function(city) {
                                // Remove all Cities that belong to this State
                                if($scope.currentGeoSelection.citySetting.indexOf(city.city) > -1) {
                                    $scope.currentGeoSelection.citySetting.splice( $scope.currentGeoSelection.citySetting.indexOf(city.city) , 1);
                                    city.selected = false;
                                };
                            });
                        });
                    }
                };
                // 
                if(type === 'state') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.stateSetting.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.stateSetting.splice(pos, 1);
                    } else {
                        // Add a state
                        $scope.currentGeoSelection.stateSetting.push(selection);

                        // First find which Continent and Country the selected state belongs to
                        var selectionPlanet = '';
                        var selectionContinent = '';
                        var selectionCountry = '';
                        $scope.allLocations.forEach(function(planet) {
                            planet.continents.forEach(function(continent) {
                                continent.countries.forEach(function(country) {
                                    country.states.forEach(function(state) {
                                        if(state.state === selection) {
                                            selectionPlanet = planet.planet;
                                            selectionContinent = continent.continent;
                                            selectionCountry = country.country;
                                        };
                                    });
                                });
                            });
                        });

                        // Remove selected stateSetting's Planet also if present
                        if($scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) > -1) {
                            $scope.currentGeoSelection.planetSetting.splice( $scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) , 1);
                            $scope.toggleSelected(selectionPlanet, 'planet', false);
                        };
                        // Remove selected stateSetting's continent also if present
                        if($scope.currentGeoSelection.continentSetting.indexOf(selectionContinent) > -1) {
                            $scope.currentGeoSelection.continentSetting.splice( $scope.currentGeoSelection.continentSetting.indexOf(selectionContinent) , 1);
                            $scope.toggleSelected(selectionContinent, 'continent', false);
                        };
                        // Remove selected stateSetting's country also if present
                        if($scope.currentGeoSelection.countrySetting.indexOf(selectionCountry) > -1) {
                            $scope.currentGeoSelection.countrySetting.splice( $scope.currentGeoSelection.countrySetting.indexOf(selectionCountry) , 1);
                            $scope.toggleSelected(selectionCountry, 'country', false);
                        };

                        var matchingContinents = lodash.chain($scope.allLocations).filter({planet: selectionPlanet}).pluck('continents').value()[0]; // pluck returns an array
                        var matchingCountries = lodash.chain(matchingContinents).filter({continent: selectionContinent}).pluck('countries').value()[0]; // pluck returns an array
                        var matchingStates = lodash.chain(matchingCountries).filter({country: selectionCountry}).pluck('states').value()[0];
                        var matchingCities = lodash.chain(matchingStates).filter({state: selection}).pluck('cities').value()[0];
                        lodash.forEach(matchingCities, function(city) {
                            // Remove all Cities that belong to this State
                            if($scope.currentGeoSelection.citySetting.indexOf(city.city) > -1) {
                                $scope.currentGeoSelection.citySetting.splice( $scope.currentGeoSelection.citySetting.indexOf(city.city) , 1);
                                city.selected = false;
                            };

                        });
                    }
                };
                // 
                if(type === 'city') {
                    // Check if it is already selected
                    var pos = $scope.currentGeoSelection.citySetting.indexOf(selection);
                    // Toggle if present
                    if(pos > -1) {
                        $scope.currentGeoSelection.citySetting.splice(pos, 1);
                    } else {
                        // Add the selected City
                        $scope.currentGeoSelection.citySetting.push(selection);

                        // First find which Continent, Country and State the selected state belongs to
                        var selectionPlanet = '';
                        var selectionContinent = '';
                        var selectionCountry = '';
                        var selectionState = '';
                        $scope.allLocations.forEach(function(planet) {
                            planet.continents.forEach(function(continent) {
                                continent.countries.forEach(function(country) {
                                    country.states.forEach(function(state) {
                                        state.cities.forEach(function(city) {
                                            if(city.city === selection) {
                                                selectionPlanet = planet.planet;
                                                selectionContinent = continent.continent;
                                                selectionCountry = country.country;
                                                selectionState = state.state;
                                            };
                                        });
                                    });
                                });
                            });
                        });
 
                        var matchingPlanets = lodash.chain($scope.allLocations).filter({planet: selectionPlanet}).pluck('continents').value()[0]; // pluck returns an array
                        var matchingCountries = lodash.chain(matchingPlanets).filter({continent: selectionContinent}).pluck('countries').value()[0]; // pluck returns an array
                        var matchingStates = lodash.chain(matchingCountries).filter({country: selectionCountry}).pluck('states').value()[0];
                        var matchingCities = lodash.chain(matchingStates).filter({state: selectionState}).pluck('cities').value()[0];
                        // Remove selected city's Planet also if present
                        if($scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) > -1) {
                            $scope.currentGeoSelection.planetSetting.splice( $scope.currentGeoSelection.planetSetting.indexOf(selectionPlanet) , 1);
                            $scope.toggleSelected(selectionPlanet, 'planet', false);
                        };
                        // Remove selected city's Continent also if present
                        if($scope.currentGeoSelection.continentSetting.indexOf(selectionContinent) > -1) {
                            $scope.currentGeoSelection.continentSetting.splice( $scope.currentGeoSelection.continentSetting.indexOf(selectionContinent) , 1);
                            $scope.toggleSelected(selectionContinent, 'continent', false);
                        };
                        // Remove selected city's Country also if present
                        if($scope.currentGeoSelection.countrySetting.indexOf(selectionCountry) > -1) {
                            $scope.currentGeoSelection.countrySetting.splice( $scope.currentGeoSelection.countrySetting.indexOf(selectionCountry) , 1);
                            $scope.toggleSelected(selectionCountry, 'country', false);
                        };
                        // Remove selected city's State also if present
                        if($scope.currentGeoSelection.stateSetting.indexOf(selectionState) > -1) {
                            $scope.currentGeoSelection.stateSetting.splice( $scope.currentGeoSelection.stateSetting.indexOf(selectionState) , 1);
                            $scope.toggleSelected(selectionState, 'state', false);
                        };
 
                    }
                };
 
            };  // End changeSelection()

            $scope.saveGeoLocationSettings = function() {
                SettingsService.saveGeoLocationSettings($scope.currentGeoSelection, function(err, allLocations) {
                    if (err) {
                        return console.log("Error:: " + err);
                    }
                    //$scope.allLocations = allLocations;
                });
            };

       },   // End Controller
    };
}]);
