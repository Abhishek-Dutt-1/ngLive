'use strict';

Permission.service('PermissionService', ['$cacheFactory', 'ApiService', 'NotificationService', function($cacheFactory, ApiService, NotificationService) {
    /*
     * A permission has a structure
     * perm = {group: 'Group1', permission: 'Permission1'}
     */
    this.permissionList = [];

    // some times while permissions are being fetched, another permission query might come
    // triggering another fetchAllPermissions(), we cache the promies itself at return the same one to all queries
    this.fetchAllPermissionsTempPromise = undefined;

    // Currently user default cache, consider upgrading to 3rd party angular-cache for persistance with localStorage etc. so that
    // permissions are cached not just on first page load, but instead for days on users system --> better performance
    // http://angular-data.pseudobry.com/
    var permissionCache = $cacheFactory('permissionCache');

    /* 
     * fetch and cache all permissions
     */
    this.fetchAllPermissions = function() {

        // if a request is already in progress return the old promise as is
        if(this.fetchAllPermissionsTempPromise) {
            return this.fetchAllPermissionsTempPromise;
        };

        // if there is no permission fetching happenging start a new request
        this.fetchAllPermissionsTempPromise = ApiService.Permission.query(function(allPermissions) {
                permissionCache.put('allPermissions', allPermissions);
            }, function(err) {
                console.log(err);
        });
        return this.fetchAllPermissionsTempPromise;

        /*
        return ApiService.Permission.query(function(allPermissions) {
                permissionCache.put('allPermissions', allPermissions);
                this.fetchAllPermissionsInProgress = false;
            }, function(err) {
                this.fetchAllPermissionsInProgress = false;
                console.log(err);
            });
        */
    };

    // check if the user has all the permissions
    // returns true, false
    this.isAllowed = function(user, opts, cb) {
        // This is obviously risky but since we are caching all permissions
        // on client anyway (where they can be manipulated), this is ok
        if(user.isAdmin === true) {
            cb(true);
            return;
        }

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
            // permissions are in the cache, delete the promise
            this.fetchAllPermissionsTempPromise = undefined;
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

    // check if the user has AT LEAST ONE of the permissions
    // returns true, false
    this.isAllowedANY = function(user, opts, cb) {
        // This is obviously risky but since we are caching all permissions
        // on client anyway (where they can be manipulated), this is ok
        if(user.isAdmin === true) {
            cb(true);
            return;
        }

        // user == user obj to be checked, user can have more than one userroles
        // opts is an array of permissions [perm1, perm2, ...] (currently different from backend function, that also needs to be changed)

        var allPerms;

        if( permissionCache.info().size == 0 ) {

            // fetch all perms from server, will also update cache
            this.fetchAllPermissions().$promise.then(function(success) {

                allPerms = permissionCache.get('allPermissions');
                var permAllowedArray = getPermAllowed(user, opts);
                var permAllowed = permAllowedArray.some(function(allow) { return allow; });
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
            // permissions are in the cache, delete the promise
            this.fetchAllPermissionsTempPromise = undefined;
            // permission cache exists
            //console.log('Loading from Perm cache');
            allPerms = permissionCache.get('allPermissions');
            var permAllowedArray = getPermAllowed(user, opts);
            var permAllowed = permAllowedArray.some(function(allow) { return allow; });
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
