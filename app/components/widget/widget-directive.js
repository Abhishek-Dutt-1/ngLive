'use strict';

Widget.directive('editableInputWidget', [function() {
    return {
        restrict: 'AE',

        template: '<div><span ng-hide="editing" ng-class="spanClass">{{text}}</span><form ng-show="editing"><input type="{{getInputType()}}" ng-class="inputClass"></form><div>',

        scope : {
            text: '=model',
            onReady: '&',
            spanClass: '@',
            inputClass: '@',
            inputType: '@'
        },
        replace: true,
        link: function(scope, element, attrs) {
            scope.getInputType = function() {
                return scope.inputType || 'text';
            };

            var span = angular.element(element.children()[0]);
            var form = angular.element(element.children()[1]);
            var input = angular.element(element.children()[1][0]);

            span.bind('click', function(event) {
                input[0].value = scope.text;
                startEdit();
            });

            function startEdit() {
                bindEditElements();
                setEdit(true);
                input[0].focus();
            };

            function bindEditElements() {
                input.bind('blur', function() {
                    stopEdit();
                });

                input.bind('keyup', function(event) {
                    if(isEscape(event)) {
                        stopEdit();
                    };
                });

                form.bind('submit', function() {
                    // don't save empty
                    if(input[0].value) {
                        console.log("Before Save");
                        save();
                        console.log("After Save");
                    }
                    stopEdit();
                });
            };

            function save() {
                scope.text = input[0].value;
                scope.$apply();
                scope.onReady();
            };

            function stopEdit() {
                unbindEditElements();
                setEdit(false);
            };

            function unbindEditElements() {
                input.unbind();
                form.unbind();
            };

            function setEdit(value) {
                scope.editing = value;
                scope.$apply();
            };

            function isEscape(event) {
                return event && event.keyCode == 27;
            };
        }   // End Link
    } // End return
}]);


Widget.directive('editableSelectWidget', [function() {
    return {
        restrict: 'AE',

        template: '<div>' +
                    '<span ng-hide="editing" ng-class="spanClass">{{text}}</span>' +
                    '<form ng-show="editing">' +
//                        '<select data-ng-options="contObj for contObj in optionsList" ng-class="inputClass"></select>' +
                            '<select><option ng-repeat="contObj in optionsList">{{contObj}}</option></select>' +
                    '</form>' +
                    '<div>',

        scope : {
            text: '=model',
            onReady: '&',
            spanClass: '@',
            inputClass: '@',
            optionsList: '=',
        },
        replace: true,
        link: function(scope, element, attrs) {

            var span = angular.element(element.children()[0]);
            var form = angular.element(element.children()[1]);
            var input = angular.element(element.children()[1][0]);

            span.bind('click', function(event) {
                input[0].value = scope.text;
                startEdit();
            });

            function startEdit() {
                bindEditElements();
                setEdit(true);
                input[0].focus();
            };

            function bindEditElements() {
                input.bind('blur', function() {
                    stopEdit();
                });

                input.bind('keyup', function(event) {
                    if(isEscape(event)) {
                        stopEdit();
                    };
                });

                input.bind('change', function() {
                    // don't save empty
                    if(input[0].value) {
                        console.log("Before Save");
                        save();
                        console.log("After Save");
                    }
                    stopEdit();
                });
 
                /*
                form.bind('submit', function() {
                    // don't save empty
                    if(input[0].value) {
                        console.log("Before Save");
                        save();
                        console.log("After Save");
                    }
                    stopEdit();
                });
                */
            };

            function save() {
                scope.text = input[0].value;
                scope.$apply();
                scope.onReady();
            };

            function stopEdit() {
                unbindEditElements();
                setEdit(false);
            };

            function unbindEditElements() {
                input.unbind();
                form.unbind();
            };

            function setEdit(value) {
                scope.editing = value;
                scope.$apply();
            };

            function isEscape(event) {
                return event && event.keyCode == 27;
            };
        }   // End Link
    } // End return
}]);

/*
Mainmenu.directive('mainmenuFooterPartial', function() {
    return {
        scope: {},
        templateUrl: 'components/mainmenu/footerPartial.html'
    };
});
*/
