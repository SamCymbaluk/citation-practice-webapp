(function() {
  angular.module('application')
  .controller('AdminController', AdminController);

  AdminController.$inject = ['$scope', '$log', '$state', '$timeout', '$sce', '$location', 'FoundationApi'];

  function AdminController($scope, $log, $state, $timeout, $sce, $location, FoundationApi) {
      var vm = this;
      vm.key = $location.search().key;
      vm.authenticated = true; //false

      vm.StateEnum = Object.freeze({
        'RESULTS': 1,
        'CLASSROOMS': 2,
        'CITATIONS': 3,
      });
      $timeout(() => changeState(vm.StateEnum.RESULTS));

      vm.renderHtml = renderHtml;
      vm.changeState = changeState

      $('body').css('background-color','rgb(241, 241, 241)');

      //Test Data
      vm.results = [
        {classroom: 'A6BY74', firstName: 'Sam', lastName: 'Smith', score: 90, timestamp: new Date()},
        {classroom: 'A6BY74', firstName: 'John', lastName: 'Douglas', score: 60, timestamp: new Date()},
        {classroom: 'TJUY8D', firstName: 'Iris', lastName: 'Warren', score: 94, timestamp: new Date()},
        {classroom: 'A6BY74', firstName: 'Taylor', lastName: 'Smith', score: 23, timestamp: new Date()},
        {classroom: 'L7FM2N', firstName: 'Don', lastName: 'Hodges', score: 89, timestamp: new Date()},
        {classroom: 'L7FM2N', firstName: 'Alyssa', lastName: 'Norris', score: 98, timestamp: new Date()},
    ];

    vm.classrooms = [
      {id: 'A6BY74', key:'YjEwNTA0OTktNmY3OC00YTZjLWI3NGEtNGZiMjU1YzhhZGMx'},
      {id: 'TJUY8D', key:'NGNhMjc0NzktMjQ5YS00ZTcxLTg5ZmMtZjM0NGIzOTlmNGMy'},
      {id: 'L7FM2N', key:'ODQ4MDA0MGUtYzEwMi00ZGNjLWFiYTgtOGNhOWM2YWU0ZmMw'},
    ]

    _loadCitations();

    function _loadCitations() {
      $.ajax({
        url: 'http://cathedralgaels.ca:3001/mla/citations',
        success: (data) => {
          vm.citations = data;
        }
      });
    }



    function changeState(state) {
      $(`#${vm.state}-btn`).removeClass("active");
      $(`#${state}-btn`).addClass("active");
      vm.state = state;
    }

    function renderHtml(html) {
      return $sce.trustAsHtml(html);
    }
  }
})();
