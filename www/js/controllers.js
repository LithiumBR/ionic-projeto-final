angular.module('starter.controllers', ['ngMessages'])

.controller("homeCtrl", function(User,$scope,$state,$rootScope) {
  
  /** Cria usuário */
  $scope.submitForm = function(data) {
        if (typeof data.nome != 'undefined') {
            var userObj = {
                name:data.nome
            };
            User.saveUser(userObj).then(function(result) {
              $rootScope.setUser(userObj);
              $state.go('cursos');
            });
        }
    };
})
.controller("cursosCtrl", function(User,Cursos,$scope,$state,$rootScope,$ionicModal,$ionicListDelegate,$ionicNavBarDelegate,$rootScope,$ionicPopup, $timeout) {
      
    $ionicNavBarDelegate.showBackButton(false);
    $scope.cursos = [];

    $scope.data = {
      showDelete: false
    };
    
    Cursos.all().then(function(results) {
      $scope.cursos = results;
    });

    $ionicModal.fromTemplateUrl("templates/modal-curso.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function(modal) {
        $scope.modal = modal;
    });

    /** Adiciona novo curso */
    $scope.addItem = function(data) {
      console.log(data);
      if (typeof data.curso != 'undefined') {

        var newCurso = {
          "nome":data.curso,
          "periodo":data.periodo
        };

        Cursos.addCurso(newCurso).then(function(response) {
          newCurso.id  = response.insertId;
          $scope.cursos.push(newCurso);
          $scope.modal.hide();
        });

      }
    };

    $scope.onItemDelete = function(item) {
      Cursos.deleteItem(item).then(function(response) {
        $scope.cursos.splice($scope.cursos.indexOf(item),1);
        $scope.data.showDelete = false;
      });
    };

    $scope.clearAll = function() {
       // A confirm dialog
       var confirmPopup = $ionicPopup.confirm({
         title: 'Isso irá apagar todos os dados',
         template: 'Tem certeza disso?',
         cancelText:"Cancelar",
          okText:"Sim",
          okType:'button-assertive'
         
       });
       confirmPopup.then(function(res) {
         if(res) {
           User.removeUser().then(function() {
            $state.go("home");
           });
         } else {
           
         }
       });
    }

})

.controller("materiasCtrl", function(Cursos,Materias,Periodos,$scope,$ionicModal,$stateParams,$q,$ionicListDelegate,$ionicNavBarDelegate,$rootScope) {
  
  $scope.idcurso = $stateParams.idcurso;
  $scope.materias = [];
  $scope.notaAlterar = null;
  $scope.itemAlterar = null;
  $scope.itemAlterarIndex = 0;

  var materias = [];

  Materias.all($scope.idcurso).then(function(results) {
    $scope.materias = results;
  });

  Cursos.getById($scope.idcurso).then(function(result) {
    $rootScope.curso = result;
  }); 

  $ionicNavBarDelegate.showBackButton(false);

  $scope.data = {
    showDelete: false
  };

  $ionicModal.fromTemplateUrl("templates/modal-materia.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function(modal) {
        $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl("templates/modal-nota.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function(modal) {
        $scope.modalNota = modal;
  });

  /** Adiciona nova materia */
  $scope.addItem = function(materia) {

    if (typeof materia != 'undefined') {

      var newMateria = {
        "nome":materia,
        "idcurso":$scope.idcurso
      };

      Materias.addMateria(newMateria,$rootScope.curso.periodo).then(function(response) {
        newMateria.id  = response.insertId;
        Materias.all($scope.idcurso).then(function(results) {
          $scope.materias = results;
        });
        $scope.modal.hide();
      });

    }
  };

  $scope.onItemDelete = function(item) {
    Materias.deleteItem(item).then(function(response) {
      $scope.materias.splice($scope.materias.indexOf(item),1);
      $scope.data.showDelete = false;
    });
  };

  $scope.alterarNota = function(item,nota,index) {
    $scope.notaAlterar = nota;
    $scope.itemAlterar = item;
    $scope.itemAlterarIndex = index;
    $scope.modalNota.show();
 
  }

  $scope.updateNota = function(nNota) {

    Periodos.alterarNota($scope.notaAlterar.id,nNota).then(function(response) {
      $scope.notaAlterar.nota = nNota;
      $scope.modalNota.hide();
      $scope.itemAlterar.periodos[$scope.itemAlterarIndex].nota = parseFloat(nNota);

      var totalNotas = 0;
      angular.forEach($scope.itemAlterar.periodos,function(item,index) {
        totalNotas += item.nota;
      });

      $scope.itemAlterar.total_nota = totalNotas;

    });
    
  }


})

