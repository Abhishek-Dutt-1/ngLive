'use strict';

Settings.service('SettingsService', ['ApiService', function(ApiService) { 

    // Stores all cities in hierarchy
    this.allLocations = [];

    this.fetchUniqueLocations = function(cb) {

        if(this.allLocations.length === 0) {

            (function(_this) {
                ApiService.Cities.fetchUniqueLocations({}, function(allLocations2) {
                    _this.allLocations = allLocations2;
                    cb(_this.allLocations);
                    console.log("Settings Service Inside Success");
                }, function(err) {
                    return err;
                });
            })(this);


        } else {
            cb(this.allLocations);
        }
    };

}]);
