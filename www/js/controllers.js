angular.module('starter.controllers', [])

.controller("homeCtrl",function($scope,$state,$localstorage,$app) {

	$scope.submitForm = function(data) {

		if(data.nome && data.periodo) {

			$localstorage.set('nome',data.nome);
			$localstorage.set('periodo',data.periodo);

			$state.go('materias');
		}
	}; 
})

.controller("materiasCtrl",function($scope,$state,$localstorage) {

	if($localstorage.getObject("nome")) {
		var currentLogin = [];

		currentLogin.nome = $localstorage.get("nome");
		currentLogin.periodo = $localstorage.get("periodo");

		$scope.currentLogin = currentLogin;

	} else {
		$state.go('home');
	}
})

