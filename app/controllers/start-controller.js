'use strict';

angular.module('serverless.javaskop')
  .controller('StartController', ['$state', 'apiFactory',
    function ($state, apiFactory) {

      var startCtrl = this;

      startCtrl.password = '';

      startCtrl.isPasswordEmpty = isPasswordEmpty;
      startCtrl.login = login;


      function isPasswordEmpty () {
        return !startCtrl.password || startCtrl.password.trim().length === 0;
      }

      function login () {
        apiFactory.login(startCtrl.password)
          .then(function (success) {
              if (success.allowed) {
                $state.go('results');
              } else {
                console.log('Login failed. User not allowed.');
              }
            },
            function (error) {
              console.log('Login failed. Error: ' + JSON.stringify(error));
            });
      }

    }
  ]);