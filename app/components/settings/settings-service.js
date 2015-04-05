'use strict';

Settings.service('SettingsService', ['$rootScope', 'ApiService', 'AuthenticationService', function($rootScope, ApiService, AuthenticationService) { 

    // Stores all cities in hierarchy
    this.allLocations = [];
    // Stores all unique countries
    this.allCountries = [];
    // Stores all unique board names
    this.allBoards = [];
 
    // Local cache of Users's geo settings
    // This is just for not logged in users, this will be bypassed for logged in users
    this.currentGeoSelection = {planetSetting: ['Earth'], continentSetting: [], countrySetting: [], stateSetting: [], citySetting: []};

    // Fetch locations hierarchy
    this.fetchUniqueLocations = function(cb) {

        if (this.allLocations.length === 0) {

            (function(_this) {
                ApiService.Cities.fetchUniqueLocations({}, function(allLocations2) {
                    _this.allLocations = allLocations2;
                    cb(false, _this.allLocations);
                    console.log("Settings Service Inside Success");
                }, function(err) {
                    return cb(err, false);
                });
            })(this);

        } else {
            cb(false, this.allLocations);
        }
    };

    // Fetch all unique countries
    this.fetchUniqueCountries = function(cb) {

        if (this.allCountries.length === 0) {

            (function(_this) {
                ApiService.Cities.fetchUniqueCountries({}, function(allCountries) {
                    _this.allCountries = allCountries;
                    cb(false, _this.allCountries);
                }, function(err) {
                    return cb(err, false);
                });
            })(this);

        } else {
            cb(false, this.allCountries);
        }
    };

    // Fetch all unique Boards names
    // This is here for caching
    // this should be moved to a dedicated cahcing service
    this.fetchUniqueBoards = function(cb) {

        if (this.allBoards.length === 0) {

            (function(_this) {

                ApiService.Board.query(function(allBoards) {
                    _this.allBoards = allBoards;
                    cb(false, _this.allBoards);
                }, function(err) {
                    return cb(err, false);
                });
            })(this);

        } else {
            cb(false, this.allBoards);
        }
    };


    /**
     * Returns Users geo location settings,
     * this comes directly from users model via Authentication Service
     */
    this.fetchUserGeoLocationSettings = function() {

        if ( AuthenticationService.isCurrentUserLoggedIn() ) {
            var user = AuthenticationService.getCurrentUser();
            var settings = {
                planetSetting    : user.planetSetting || [],
                continentSetting : user.continentSetting || [],
                countrySetting   : user.countrySetting || [],
                stateSetting     : user.stateSetting || [],
                citySetting      : user.citySetting || [],
            };
            // If user is logged in
            // Simply return settings from Users model
            return settings;
        } else {
            // User is not logged in,
            // Check and return local front end settings store
            return this.fetchGeoLocationSettingsLocal();
        };

    };

    /**
    * User clicked save locations settings from the ui
    */
    this.saveGeoLocationSettings = function(currentGeoSelection, cb) {

        if ( AuthenticationService.isCurrentUserLoggedIn() ) {
            // Save user's setting in his model
            AuthenticationService.updateCurrentUser(currentGeoSelection, function(err, success) {
                if(err) cb(err, false);
                cb(false, success);
            });
            // Update local cache without waiting for User's model save
            this.saveGeoLocationSettingsLocal(currentGeoSelection);
        } else {
            // User is not logged in
            // But still save the settings in frontend
            this.saveGeoLocationSettingsLocal(currentGeoSelection);
            cb(false, currentGeoSelection);
        }
        // Save front end user's setting in frontend 
    };

    /** 
     * Cache users settings in frontend
     */
    this.saveGeoLocationSettingsLocal = function(currentGeoSelection) {   
        this.currentGeoSelection = currentGeoSelection;
    };
    /**
     * Retrive cached users settings
     */
    this.fetchGeoLocationSettingsLocal = function() {   
        return this.currentGeoSelection;
    };

    /**
     * Some utility functions
     */
    this.getParents = function(child, childType, cb) {
        var parentObj = {};
        if(!child) {
            cb('Invalid Child', undefined);
        };

        this.fetchUniqueLocations( function(err, allLoc) {

            allLoc.forEach( function(planet) {

                planet.continents.forEach( function(continent) {

                    if (continent.continent === child && childType === 'continent') {
                        parentObj.planet = planet.planet;
                    };

                    continent.countries.forEach( function(country) {

                        if (country.country === child && childType === 'country') {
                            parentObj.planet = planet.planet;
                            parentObj.continent = continent.continent;
                        };

                    });

                });

            });
            cb(false, parentObj);
        });

    };


}]);
