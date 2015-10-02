// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services'])

.run(function(User,$rootScope,$ionicPlatform,$log,$q,$state) {

  $rootScope.user = $rootScope.getUser;
  $rootScope.curso = null;

  $rootScope.setUser = function(userObj) {
    $rootScope.user = userObj;
  }

  $rootScope.$on('$stateChangeStart', function(event, toState) {

     User.getUser().then(function(user) {
      $rootScope.user = user;
    }).then(function() {
      if(angular.isDefined($rootScope.user) && toState.controller == "homeCtrl") {
        $state.go("cursos");
      }
    });


  });



  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.directive('cardNota', [function () {
  return {
    restrict: 'E',
    templateUrl:"templates/nota.html",
    controller:'cardNotaCtrl',
    scope: {
      item: '=',
      index: '@',
      nota: '@'
    },
    link: function (scope, iElement, iAttrs) {
    }
  };
}])

.filter('ucfirst', function() {
  return function(input,arg) {
    if(input) {
    return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    }
  };
})

.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .state('cursos', {
      url: '/cursos',
      templateUrl: 'templates/cursos.html',
      controller: 'cursosCtrl',
      data: {
        authenticate: true
      }
    })
    .state('materias', {
      url: '/materias/:idcurso',
      templateUrl: 'templates/materias.html',
      controller: 'materiasCtrl',
      data: {
        authenticate: true
      }
    })

    .state('edit', {
      url: "/edit/:idmateria",
      templateUrl: 'templates/materia-open.html',
      controller: 'notasCtrl',
      data: {
        authenticate: true
      }
    });

  // if none of the above states are matched, use this as the fallback
  

  $urlRouterProvider.otherwise('/home');    
  
  
  

});
