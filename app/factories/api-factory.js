'use strict';

angular.module('serverless.javaskop')
  .factory('apiFactory', function apiFactory ($http, $q) {

    var apiFactory = {};

    var baseUrl = 'https://85rlnfrmi0.execute-api.us-east-1.amazonaws.com/dev';

    function getLoginUrl (password) {
      return baseUrl + '/login?pass=' + password;
    }

    function getResultsUrl () {
      return baseUrl + '/results';
    }

    apiFactory.login = function (password) {
      var loginUrl = getLoginUrl(password);

      var def = $q.defer();
      $http.get(loginUrl)
        .success(function (data) {
          def.resolve(data);
        })
        .error(function (e) {
          def.reject(e);
        });
      return def.promise;
    };

    apiFactory.getResults = function () {
      var resultsUrl = getResultsUrl();

      var def = $q.defer();
      $http.get(resultsUrl)
        .success(function (data) {
          def.resolve(data);
        })
        .error(function (e) {
          def.reject(e);
        });
      return def.promise;
    };

    return apiFactory;
  });