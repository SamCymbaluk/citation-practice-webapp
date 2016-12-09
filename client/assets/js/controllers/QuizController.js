(function() {
  'use strict';

  angular.module('application').controller('QuizController', QuizController);

  QuizController.$inject = ['$scope', '$stateParams', '$state', '$controller'];

  function QuizController($scope, $stateParams, $state, $controller) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    //Controller code
    var vm = this;
    $scope.test "Hello!";

    function test(){
      return "Hello World!";
    }
  }


})();
