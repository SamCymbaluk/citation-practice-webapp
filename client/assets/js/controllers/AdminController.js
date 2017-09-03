(function() {
  angular.module('application')
  .controller('AdminController', AdminController);

  AdminController.$inject = ['$scope', '$log', '$state', '$timeout', '$sce', '$location', 'FoundationApi'];

  function AdminController($scope, $log, $state, $timeout, $sce, $location, FoundationApi) {
      var vm = this;
      vm.key = $location.search().key;
      vm.authenticated = vm.key ? true : false;
      const authHeader = {
        'Authorization': 'Basic ' + btoa('admin' + ':' + atob(vm.key))
      };

      vm.StateEnum = Object.freeze({
        'RESULTS': 1,
        'CLASSROOMS': 2,
        'CITATIONS': 3,
      });

      /*
        State info
      */
      $timeout(() => changeState(vm.StateEnum.RESULTS));
      //Citation being edited in modal
      vm.currentCitation = '';

      vm.renderHtml = renderHtml;
      vm.changeState = changeState
      vm.addClassroom = addClassroom;
      vm.delClassroom = delClassroom;
      vm.getCitation = getCitation;
      vm.beginEditingCitation = beginEditingCitation;
      vm.removeCitationBlock = removeCitationBlock;
      vm.addCitationBlock = addCitationBlock;
      vm.removeIntextAnswer = removeIntextAnswer;
      vm.addIntextAnswer = addIntextAnswer;
      vm.addHint = addHint;
      vm.removeHint = removeHint;
      vm.putCitation = putCitation;

      $('body').css('background-color','rgb(241, 241, 241)');


    _loadResults();
    _loadClassrooms();
    _loadCitations();

    function _loadResults() {
      $.ajax({
        datatype: 'json',
        url: 'http://cathedralgaels.ca:3001/mla/results',
        headers: authHeader,
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

    function _loadClassrooms() {
      $.ajax({
        datatype: 'json',
        url: 'http://cathedralgaels.ca:3001/mla/classrooms',
        success: (data) => {
          $timeout(() => {
            vm.classrooms = data;
          });
        },
        error: (xhr, ajaxOptions, thrownError) => {
          console.log(thrownError);
        }
      });
    }

    function _loadCitations() {
      $.ajax({
        url: 'http://cathedralgaels.ca:3001/mla/citations',
        success: (data) => {
          vm.citations = data;
        }
      });
    }

    function _generateClassroom() {
      let id = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      for (let i=0; i < 6; i++) {
         id += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      const key = _guid();

      return {id, key};
    }

    function _guid() {
      return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' +
        _s4() + '-' + _s4() + _s4() + _s4();
    }

    function _s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    function _clone(obj){
      return JSON.parse(JSON.stringify(obj));
    }

    function _sendNotification(data) {
      FoundationApi.publish('submit-notification', data);
    }

    function addClassroom() {
      $.ajax({
        type: 'POST',
        url: 'http://cathedralgaels.ca:3001/mla/classrooms',
        headers: authHeader,
        data: _generateClassroom(),
        success: (data, status, xhr) => {
          _loadClassrooms();
        },
        error: (xhr, status, error) => {
          console.error(xhr, status, error);
        }
      });
    }

    function delClassroom(id) {
      $.ajax({
        type: 'DELETE',
        url: 'http://cathedralgaels.ca:3001/mla/classrooms/' + id,
        headers: authHeader,
        success: (data, status, xhr) => {
          _loadClassrooms();
        },
        error: (xhr, status, error) => {
          console.error(xhr, status, error);
        }
      });
    }

    function changeState(state) {
      $(`#${vm.state}-btn`).removeClass('active');
      $(`#${state}-btn`).addClass('active');
      vm.state = state;
    }

    function getCitation(key) {
      for (let citation of vm.citations) {
        if (citation.id === key) {
          return citation;
        }
      }
    }

    function beginEditingCitation(key) {
      vm.currentCitation = _clone(getCitation(key));
    }

    function removeCitationBlock(index) {
      vm.currentCitation.blocks.splice(index, 1);
    }

    function addCitationBlock() {
      vm.currentCitation.blocks.push('');
    }

    function addIntextAnswer() {
      vm.currentCitation.intext_answers.push('');
    }

    function removeIntextAnswer(index) {
      vm.currentCitation.intext_answers.splice(index, 1);
    }

    function addHint() {
      vm.currentCitation.hints.push('');
    }

    function removeHint(index) {
      vm.currentCitation.hints.splice(index, 1);
    }

    function putCitation() {
      const title = $('#citation_title').val();
      const blocks = $('.citation-block').toArray().map((input) => input.value);
      const intext_info = $('#intext_info').val();
      const intext_answers = $('.citation-answer').toArray().map((input) => input.value);
      const hints = $('.citation-hint').toArray().map((input) => input.value);
      const end_text = $('#end_text').val();

      const formData = {
        title,
        blocks,
        intext_info,
        intext_answers,
        hints,
        end_text
      }

      $.ajax({
        type: 'PUT',
        url: 'http://cathedralgaels.ca:3001/mla/citations/' + vm.currentCitation.id,
        headers: authHeader,
        data: {data: formData},
        success: (data, status, xhr) => {
          _loadCitations();
          _sendNotification({
            title: 'Changes Saved',
            content: 'Citation info updated',
            autoclose: 5000,
          });
        },
        error: (xhr, status, error) => {
          console.error(xhr, status, error);
          _sendNotification({
            title: 'Submission failed',
            content: 'Please try again',
            autoclose: 5000,
          });
        }
      });
    }


    function renderHtml(html) {
      return $sce.trustAsHtml(html);
    }
  }
})();
