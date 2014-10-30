'use strict';

/**
 * @ngdoc function
 * @name ngLiveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngLiveApp
 */
angular.module('ngLiveApp').controller('MainCtrl', function ($scope, localStorageService) {

	var todosInStore = localStorageService.get('todos');
	$scope.todos = todosInStore || [];
	$scope.$watch('todos', function () {
		localStorageService.set('todos', $scope.todos);
	}, true);

    $scope.addTodo = function () {
      $scope.todos.push(this.todo);
      this.todo = '';
    };
    $scope.removeTodo = function (index) {
      $scope.todos.splice(index, 1);
    };
});
