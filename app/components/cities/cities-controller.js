'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:UserController
 * @description
 * # UserController
 * Controller of the ngLiveApp
 */

Cities.controller('CitiesController', ['$scope', 'ApiService', function($scope, ApiService) {

// Config
    $scope.currentUser = {};
    $scope.citiesList = [];
    $scope.userroleList = [];
    // This gives a different ng-model name to each select inside ng-repeat
    $scope.userroleSelectModelList = [];

    /* User CRUD */
    $scope.fetchAll = function() {
        /*
         *  Dont use this form due to flickering !!!
        $scope.citiesList = ApiService.Cities.query(function(){}, 
            function(err){console.log(err);
        });
        */
        ApiService.Cities.query(function(allCities){
                $scope.citiesList = allCities; 
            }, 
            function(err){console.log(err);
        });
 
    };

    $scope.deleteCities = function(citiesId) {
        ApiService.Cities.delete({citiesId: citiesId}, function() {
            $scope.fetchAll();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.createCities = function(cities) {
        if(cities) {
            ApiService.Cities.save(cities, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.log("No User Input");
        }
    };

    $scope.fetchOne = function(citiesId) {
        ApiService.Cities.get({citiesId: citiesId}, function(cities) {
            $scope.citiesList = [cities];
        }, function(err) {
            console.log(err);
        });
    };

    $scope.updateCities = function(cities) {
        if(cities) {
            ApiService.Cities.update({citiesId: cities.id}, cities, function() {
                $scope.fetchAll();
            }, function(err) {
                console.log(err);
            });
        } else {
            console.info("No User Input");
        }
    };
    /* End User CRUD */


// Run
    // Get all users
    $scope.fetchAll();

}]);
