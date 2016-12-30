(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .controller('QuizController', function($scope, $log, $state, $timeout, $sce, FoundationApi){

      /*
        Setup code
      */

      var vm = this;

      //Exports
      vm.nextCitation = nextCitation;
      vm.prevCitation = prevCitation;
      vm.addCitations = addCitations;
      vm.citationsLeft = citationsLeft;
      vm.check = check;
      vm.checkBypass = checkBypass;
      vm.submit = submit;
      vm.renderHtml = renderHtml;
      vm.everythingSubmitted = everythingSubmitted;

      //Quiz state object
      vm.quiz = {};
      //Stores the current active citation index
      vm.citationIndex = 0;

      let quiz;
      let answers = [];
      let quizCitations;

      //Load data from backend
      $.ajax({
        url: "http://localhost:3001/citations/",
        success: (data) => {
          quiz = data;
          quizCitations = _clone(data);
          _setupQuiz();
          _updateCitation();
          _setupKeyListener();
        }
      })


      /*
        Setup functions
      */
      function _setupQuiz() {
        vm.quiz.citations = [];

        //Shuffle citation order after cloning citations from quiz
        _shuffleArray(quizCitations);


        //Populate citation array with citation objects
        for(const index in quizCitations) {
          if(index == 10) break; //10 citations maximum
          _addCitation(index);
        }
      }

      function _addCitation(index) {
        vm.quiz.citations.push(quizCitations[index]);

        const citation = vm.quiz.citations[index];


        //Setup hint arrays
        citation.hints = quizCitations[index].hints.map((ele) => {
          return {
            text: ele,
            unlocked: false
          }
        });

        //Setup block array
        citation.blocks = quizCitations[index].blocks.map((ele) => {
          return {
            text: ele,
            id: FoundationApi.generateUuid()
          }
        });

        //Stores an in-order copy of the block ids
        answers.push(_clone(citation.blocks).map((ele) => ele.id));

        citation.checks = 0;
        citation.submitted = false;

        _shuffleArray(citation.blocks);
      }

      function _setupSortable() {
        //Calling timeout gives the DOM time to load
        $timeout(function() {
          $("#sortable"+vm.citationIndex+":visible").sortable({

            //Sortable properties
            tolerance: "intersect",

            //BLocks have been modified
            stop: function(event, ui) {

              const citation = vm.quiz.citations[vm.citationIndex];

              //Update quiz state
              const ids = Array.from($(".quiz-sortable-block")).map((ele) => ele.childNodes[1].id);
              //console.log(ids);
              //console.log(_getBlock(citation.id,ids[0]));
              citation.blocks = ids.map((id) => _getBlock(citation.id, id));


              //Alow answer to be checked
              if(citation.checks < 5){
                $("#checkBtn"+vm.citationIndex).removeClass("disabled");
              }
            },
            start: function() {
              $(".quiz-sortable-block").removeClass("correct");
              $(".quiz-sortable-block").removeClass("incorrect");
            }
          });
          $("#sortable"+vm.citationIndex).disableSelection();
        });
      }

      function _setupKeyListener() {
        $(document).ready(function() {
          $(this).on('keydown', (event) => {
            //Down or right
            if (event.keyCode === 39 || event.keyCode === 40) {
              nextCitation();
            //Up or left
          }else if(event.keyCode === 37 || event.keyCode === 38){
              prevCitation();
            }

          });
        });
      }

      function _setupTooltips() {
        $timeout(() => {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }

      function _updateCitation(){
        const citation = vm.quiz.citations[vm.citationIndex];
        _setupSortable();

        $timeout(() => {
          if(citation.submitted){
            $(".quiz-sortable-block").addClass("submitted");
            $("#sortable"+vm.citationIndex).sortable("disable");

            $(".quiz-sortable-block").removeClass("correct");
            $(".quiz-sortable-block").removeClass("incorrect");

            $("#submitBtn"+vm.citationIndex).addClass("disabled");
            $("#checkBtn"+vm.citationIndex).addClass("disabled");
            $("#hintsBtn"+vm.citationIndex).addClass("disabled");
          }
        });
      }



      /*
        Public functions
      */
      function nextCitation() {
        $timeout(() => {
          if(vm.citationIndex === vm.quiz.citations.length - 1) return;
          vm.citationIndex++;
          _updateCitation();
        });
      }

      function prevCitation() {
        $timeout(() => {
          if(vm.citationIndex === 0) return;
          vm.citationIndex--;
          _updateCitation();
        });
      }

      function addCitations() {
        $timeout(() => {
          for(let i = vm.citationIndex + 1; i < vm.citationIndex + 6; i++) {
            _addCitation(i);
          }
        });
      }

      function citationsLeft() {
        return vm.quiz.citations.length < quizCitations.length;
      }

      function check() {
        if(sessionStorage.mlaQuizCheckConfirmation){
          checkBypass();
        }else{
          $("#checkModal").addClass('is-active');
        }
      }

      function checkBypass() {
        sessionStorage.mlaQuizCheckConfirmation = true;
        $timeout(() => {
            const citation = vm.quiz.citations[vm.citationIndex];
            const answer = answers[vm.citationIndex];

            for(const [index, block] of citation.blocks.entries()) {
              const id = block.id;

              //Apply syling to quiz block container
              if(index === answer.indexOf(id)) {
                $("#"+id).parent().addClass("correct");
              } else {
                $("#"+id).parent().addClass("incorrect");
              }
            }

            //Correctly order the sortable li's again cause jquery likes to fk this up for some reason
            const ul = $(".ui-sortable");
            const li = ul.children("li");
            li.detach().sort((a,b) => _findWithAttribute(citation.blocks, "id", a.childNodes[1].id) - _findWithAttribute(citation.blocks, "id", b.childNodes[1].id));
            ul.append(li);


            citation.checks++;

            //Unlock first locked hint
            for(const hint of citation.hints){
              if(!hint.unlocked){
                hint.unlocked = true;
                break;
              }
            }

            $("#checkBtn"+vm.citationIndex).addClass("disabled");

        });
      }

       function renderHtml(html) {
        return $sce.trustAsHtml(html);
      }

      function submit() {
        const citation = vm.quiz.citations[vm.citationIndex];
        citation.submitted = true;

        _updateCitation();
      }

      function everythingSubmitted(){
        for(const citation of vm.quiz.citations){
          if(!citation.submitted) return false;
        }
        return true;
      }

      /*
        Util functions
      */
      function _shuffleArray(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
      }

      function _clone(obj){
        return JSON.parse(JSON.stringify(obj));
      }

      function _getBlock(citationId, blockId){
        const citation = vm.quiz.citations.filter((citation) => citation.id === citationId)[0];
        return citation.blocks.filter((block) => block.id === blockId)[0];
      }

      function _findWithAttribute(array, attr, value) {
          for(var i = 0; i < array.length; i += 1) {
              if(array[i][attr] === value) {
                  return i;
              }
          }
          return -1;
      }
  })
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
