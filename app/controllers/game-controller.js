'use strict';

angular.module('serverless.javaskop')
    .controller('GameController', ['$state', 'apiFactory', '$scope', '$interval',
      function ($state, apiFactory, $scope, $interval) {

        var gameCtrl = this;

        var ENTER_KEY = 13;
        var SPACE_KEY = 32;

        gameCtrl.player1 = {
          id: undefined,
          name: '',
          hasFinished: false,
          email: '',
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
          email: '',
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


        function startGame() {
          if (!canGameStart()) {
            return;
          }

          gameCtrl.gameStarted = true;

          generateIds();

          startTimers();
        }

        function canGameStart() {
          if (gameCtrl.gameStarted) {
            return false; // game is already active
          }
          return !isEmpty(gameCtrl.player1.name)
              && !isEmpty(gameCtrl.player2.name)
              && !isEmpty(gameCtrl.player1.email)
              && !isEmpty(gameCtrl.player2.email);
        }

        function isEmpty(name) {
          return !name || name.trim().length === 0;
        }

        function generateIds() {
          var now = moment();
          gameCtrl.player1.id = generateId(now);
          gameCtrl.player2.id = generateId(now.add(1, 'seconds'));
        }

        function generateId(date) {
          return date.format('HH-mm-ss');
        }

        function startTimers() {
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

        $scope.$on('keypress', function (eventName, event) {
          if (gameCtrl.gameStarted && !gameCtrl.hasGameFinished()) {
            if (event.which === ENTER_KEY) {
              gameCtrl.stopGame(gameCtrl.player1);
            }
            if (event.which === SPACE_KEY) {
              gameCtrl.stopGame(gameCtrl.player2);
            }
            $scope.$
          }
        });


        function updateTime(timer) {
          timer.seconds++;
          if (timer.seconds === 60) {
            timer.seconds = 0;
            timer.minutes++;
          }
        }

        function stopGame(player) {
          gameCtrl.stopTimer(player.timer);
          player.hasFinished = true;
          $scope.$digest();
        }

        function hasGameFinished() {
          return gameCtrl.player1.hasFinished && gameCtrl.player2.hasFinished;
        }

        function finishGame() {
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

        function formatTime(player) {
          return player.timer.minutes + ':' + player.timer.seconds;
        }

        function formatDBTime(player) {
          return player.timer.minutes * 60 + player.timer.seconds;
        }


        function insertResult(player) {
          var formattedData = {
            'id': player.id,
            'name': player.name,
            'email': player.email,
            'time': formatDBTime(player)
          }
          return apiFactory.insertResult(formattedData);
        }

      }
    ]);