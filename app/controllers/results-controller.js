'use strict';

angular.module('serverless.javaskop')
    .controller('ResultsController', ['$state', 'apiFactory', '$timeout',
      function ($state, apiFactory, $timeout) {

        var resultsCtrl = this;

        resultsCtrl.resultsList = [];

        resultsCtrl.newGame = newGame;

        $timeout(function () {
          updateResults();
        }, 2000);

        function updateResults() {
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

        function newGame() {
          $state.go('game');
        }

      }
    ])
    .filter('parseTime', function () {
      return function (time) {
        var minutes = Math.floor(time / 60) + "";
        var seconds = (time % 60) + "";
        if (minutes.length === 1) {
          minutes = "0" + minutes;
        }
        if (seconds.length === 1) {
          seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
      }
    });