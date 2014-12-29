'use strict';

Permission.service('PermissionService', ['$cacheFactory', 'ApiService', 'NotificationService', function($cacheFactory, ApiService, NotificationService) {
    /*
     * A permission has a structure
     * perm = {group: 'Group1', permission: 'Permission1'}
     */
    this.permissionList = [];
    // Currently user default cache, consider upgrading to 3rd party angular-cache for persistance with localStorage etc. so that
    // permissions are cached not just on first page load, but instead for days on users system --> better performance
    // http://angular-data.pseudobry.com/
    var permissionCache = $cacheFactory('permissionCache');

    // fetch and cache all permissions
    this.fetchAllPermissions = function() {
       // return the promise
        return ApiService.Permission.query(function(allPermissions) {
                permissionCache.put('allPermissions', allPermissions);
            }, function(err) {
                console.log(err);
            });
    };

    // check if the user has all the permissions
    // returns true, false
    this.isAllowed = function(user, opts, cb) {
    // user == user obj to be checked, user can have more than one userroles
    // opts is an array of permissions [perm1, perm2, ...] (currently different from backend function, that also needs to be changed)

        var allPerms;

        if( permissionCache.info().size == 0 ) {

            // fetch all perms from server, will also update cache
            this.fetchAllPermissions().$promise.then(function(success) {

                allPerms = permissionCache.get('allPermissions');
                var permAllowedArray = getPermAllowed(user, opts);
                var permAllowed = permAllowedArray.every(function(allow) { return allow; });
                cb(permAllowed);
                return;

            }, function(err) {
                // fetching permissions failed, deny permission
                NotificationService.createNotification({type:'danger', text: 'Could not get permissions from server.'});
                console.log(err);
                cb(false);
                return;
            });
        } else {
            // permission cache exists
            //console.log('Loading from Perm cache');
            allPerms = permissionCache.get('allPermissions');
            var permAllowedArray = getPermAllowed(user, opts);
            var permAllowed = permAllowedArray.every(function(allow) { return allow; });
            cb(permAllowed);
        }

    /*
        first check if permissionCache is set
        if not then fetchAll
        if cache set then loop through opts; perms have array of allowed userroles, check if atleast one of user's userrole exists in them.
        all permissions must be satisfied
    */
        function getPermAllowed(user, opts) {
            //var allPerms = permissionCache.get('allPermissions');
            var permAllowedArray = [];
            opts.forEach(function(permQueried) {
                var permMatched = getMatchingPermission(permQueried);
                if(permMatched != false) {
                    var permQueriedAllowed = user.userroles.some(function(userroleQueried) {
                        // some will return true if even one userrole matches queried user's userrole
                        return permMatched.userroles.some(function(userroleAll) {
                            return userroleAll.name == userroleQueried.name;
                        });
                    });
                    permAllowedArray.push(permQueriedAllowed);
                } else {
                    //WHAT TO DO IF PERMISSION IS NOT DEFINED
                    var PERMISSION_ALLOW_IF_PERM_NOT_DEFINED = false;
                    permAllowedArray.push(PERMISSION_ALLOW_IF_PERM_NOT_DEFINED);
                }
            });
            return permAllowedArray;
        };

        function getMatchingPermission(permQuery) {
            //var allPerms = permissionCache.get('allPermissions');
            var permMatched = false;
            allPerms.forEach(function(permAll) {
                if(permQuery.group === permAll.group && permQuery.permission === permAll.permission) {  // all matching are by string names, not id
                    permMatched = permAll; 
                }
            });
            return permMatched;
        };
    };

}]);
