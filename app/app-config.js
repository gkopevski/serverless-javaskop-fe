'use strict';

// Declare app level module which depends on views, and components
angular.module('serverless.javaskop')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /start
    $urlRouterProvider.otherwise('/start');

    $stateProvider
      .state('start', {
        url: '/start',
        templateUrl: './views/start.tpl.html',
        controller: 'StartController',
        controllerAs: 'startCtrl',
        previousStates: null,
        nextStates: ['results']
      })
      .state('results', {
        url: '/results',
        templateUrl: './views/results.tpl.html',
        controller: 'ResultsController',
        controllerAs: 'resultsCtrl',
        previousStates: ['start', 'game'],
        nextStates: ['game']
      })
      .state('game', {
        url: '/game',
        templateUrl: './views/game.tpl.html',
        controller: 'GameController',
        controllerAs: 'gameCtrl',
        previousStates: ['results'],
        nextStates: ['results']
      })
  }])

  .run(['$rootScope', '$state',
    function ($rootScope, $state) {
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState) {
          if (toState.name !== 'start' &&
            (toState.previousStates === null ||
            (toState.previousStates !== null &&
            toState.previousStates.indexOf(fromState.name) === -1) // did not come from the previous state
            && (toState.nextStates === null || toState.nextStates.indexOf(fromState.name) === -1))) { // did not come from the next state
            event.preventDefault();
            $state.go('start');
          }

          $rootScope.$previousState = fromState;
        }
      );
    }]);
