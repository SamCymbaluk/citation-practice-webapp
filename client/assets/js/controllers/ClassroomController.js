(function() {
  angular.module('application')
    .controller('ClassroomController', ClassroomController);

  ClassroomController.$inject = ['$scope', '$log', '$state', '$timeout', '$sce', '$location', 'FoundationApi'];

  function ClassroomController($scope, $log, $state, $timeout, $sce, $location, FoundationApi) {
    var vm = this;
    vm.id = $location.search().id;
    vm.authenticated = vm.id ? true : false;

    $('body').css('background-color', 'rgb(241, 241, 241)');

    _loadResults();


    function _loadResults() {
      $.ajax({
        datatype: 'json',
        url: `http://cathedralgaels.ca:3001/mla/results/classroom/${vm.id}`,
        success: (data) => {
          $timeout(() => {
            vm.results = data;
          });
        },
        error: (xhr, ajaxOptions, thrownError) => {
          console.log(thrownError);
        }
      });
    }
  }
})();
