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
        controllerAs: 'startCtrl'
      })
      .state('results', {
        url: '/results',
        templateUrl: './views/results.tpl.html',
        controller: 'ResultsController',
        controllerAs: 'resultsCtrl'
      })
      .state('game', {
        url: '/game',
        templateUrl: './views/game.tpl.html',
        controller: 'GameController',
        controllerAs: 'gameCtrl'
      })
  }]);
