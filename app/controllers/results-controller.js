'use strict';

angular.module('serverless.javaskop')
    .controller('ResultsController', ['$state', 'apiFactory',
      function ($state, apiFactory) {

        var resultsCtrl = this;

        resultsCtrl.resultsList = [];

        resultsCtrl.newGame = newGame;

        updateResults();


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
        var timeValues = time.split(":");
        var minutes = timeValues[0];
        var seconds = timeValues[1];
        if (minutes.length === 1) {
          minutes = "0" + minutes;
        }
        if (seconds.length === 1) {
          seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
      }
    });