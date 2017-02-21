'use strict';

angular.module('serverless.javaskop')
  .controller('ResultsController', ['$state', 'apiFactory',
    function ($state, apiFactory) {

      var resultsCtrl = this;

      resultsCtrl.resultsList = [];

      resultsCtrl.newGame = newGame;

      updateResults();


      function updateResults () {
        apiFactory.getResults()
          .then(function (success) {
              if (success.users.Items) {
                resultsCtrl.resultsList = success.users.Items;
              }
            },
            function (error) {
              console.log('Results retrieval failed. Error: ' + JSON.stringify(error));
            });
      }

      function newGame () {
        $state.go('game');
      }

    }
  ]);