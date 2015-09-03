angular.module('starter.controllers', [])

.controller("homeCtrl",function($scope,$state) {

	$scope.submitForm = function(form) {
		if(form.$valid) {
			$state.go('materias');
		} else {
			alert("formulario invalido");
		}
	}; 


})