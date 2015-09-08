angular.module('starter.controllers', [])

.controller("homeCtrl", function($scope, $state, $localstorage, $app) {

    $scope.submitForm = function(data) {

        if (data.nome && data.periodo) {

            $localstorage.set('nome', data.nome);
            $localstorage.set('periodo', data.periodo);

            $state.go('materias');
        }
    };

})

.controller("materiasCtrl", function($scope, $state, $localstorage, $ionicModal, $ionicListDelegate) {

    $scope.userNome = null;
    $scope.userPeriodo = null;

    $scope.data = {
        showDelete: false
    };

    if (localStorage.getItem('materias')) {
        $scope.materias = JSON.parse(localStorage.materias);
    } else {
        $scope.materias = [];
    }

    if ($localstorage.get("nome") && $localstorage.get("periodo")) {
        $scope.userNome = $localstorage.get("nome");
        $scope.userPeriodo = $localstorage.get("periodo");
    }

    $ionicModal.fromTemplateUrl("templates/modal-materia.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.addItem = function(materia) {

        if (materia) {

            $scope.materias.push({
                name: materia
            });

            localStorage.setItem("materias", JSON.stringify($scope.materias))

            $scope.materia = "";
            $scope.modal.hide();

        }
    }

    $scope.remove = function(index) {
        $scope.materias.splice(index, 1);
        localStorage.setItem("materias", JSON.stringify($scope.materias));
        $ionicListDelegate.closeOptionButtons();
    }

    $scope.onItemDelete = function(item) {
    	console.debug("item");
        $scope.materias.splice($scope.materias.indexOf(item), 1);
    };

    $scope.moveItem = function(item, fromIndex, toIndex) {
        $scope.materias.splice(fromIndex, 1);
        $scope.materias.splice(toIndex, 0, item);
        localStorage.setItem("materias", JSON.stringify($scope.materias));
    };

    $scope.clearAll = function() {
        $scope.materias = [];
        localStorage.clear();
    }
})
