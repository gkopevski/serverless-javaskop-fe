'use strict';

angular.module('serverless.javaskop')
  .controller('GameController', ['$state', 'apiFactory', '$scope', '$interval',
    function ($state, apiFactory, $scope, $interval) {

      var gameCtrl = this;

      gameCtrl.player1 = {
        id: undefined,
        name: '',
        hasFinished: false,
        timer: {
          timerId: undefined,
          seconds: 0,
          minutes: 0
        }
      };
      gameCtrl.player2 = {
        id: undefined,
        name: '',
        hasFinished: false,
        timer: {
          timerId: undefined,
          seconds: 0,
          minutes: 0
        }
      };
      gameCtrl.gameStarted = false;

      gameCtrl.canGameStart = canGameStart;
      gameCtrl.hasGameFinished = hasGameFinished;
      gameCtrl.startGame = startGame;
      gameCtrl.stopGame = stopGame;
      gameCtrl.finishGame = finishGame;

      gameCtrl.formatTime = formatTime;


      function startGame () {
        if (!canGameStart()) {
          return;
        }

        gameCtrl.gameStarted = true;

        generateIds();

        startTimers();
      }

      function canGameStart () {
        if (gameCtrl.gameStarted) {
          return false; // game is already active
        }
        return !isEmpty(gameCtrl.player1.name) && !isEmpty(gameCtrl.player2.name);
      }

      function isEmpty (name) {
        return !name || name.trim().length === 0;
      }

      function generateIds () {
        var now = moment();
        gameCtrl.player1.id = generateId(now);
        gameCtrl.player2.id = generateId(now.add(1, 'seconds'));
      }

      function generateId (date) {
        return date.format('HH-mm-ss');
      }

      function startTimers () {
        gameCtrl.player1.timer.timerId = $interval(function () {
          updateTime(gameCtrl.player1.timer);
        }, 1000);
        gameCtrl.player2.timer.timerId = $interval(function () {
          updateTime(gameCtrl.player2.timer);
        }, 1000);
      }

      gameCtrl.stopTimer = function (timer) {
        if (angular.isDefined(timer.timerId)) {
          $interval.cancel(timer.timerId);
          timer.timerId = undefined;
        }
      };

      $scope.$on('$destroy', function () {
        gameCtrl.stopTimer(gameCtrl.player1.timer);
        gameCtrl.stopTimer(gameCtrl.player2.timer);
      });


      function updateTime (timer) {
        timer.seconds++;
        if (timer.seconds === 60) {
          timer.seconds = 0;
          timer.minutes++;
        }
      }

      function stopGame (player) {
        gameCtrl.stopTimer(player.timer);
        player.hasFinished = true;
      }

      function hasGameFinished () {
        return gameCtrl.player1.hasFinished && gameCtrl.player2.hasFinished;
      }

      function finishGame () {
        if (!hasGameFinished()) {
          return;
        }
        // alert('Player1: ' + JSON.stringify(gameCtrl.player1, null, 2) + '\n Player2: ' + JSON.stringify(gameCtrl.player2, null, 2));

        Promise.all([
          insertResult(gameCtrl.player1),
          insertResult(gameCtrl.player2)
        ]).then(function () {
            // go to results page
            $state.go('results');
          },
          function (error) {
            console.log('Inserting results failed. Error: ' + JSON.stringify(error));
          });


      }

      function formatTime (player) {
        return player.timer.minutes + ':' + player.timer.seconds;
      }


      function insertResult (player) {
        var formattedData = {
          'id': player.id,
          'name': player.name,
          'time': formatTime(player)
        }
        return apiFactory.insertResult(formattedData);
      }

    }
  ]);