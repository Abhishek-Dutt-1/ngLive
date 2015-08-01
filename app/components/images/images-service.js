'use strict';

Images.service('ImagesService', ['ApiService', function(ApiService) { 
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

}]);
