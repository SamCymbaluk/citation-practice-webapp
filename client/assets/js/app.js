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
    .controller('QuizController', function($scope, $log, $state, $timeout){

      var vm = this;

      //Test data from db stores a pristine copy of quiz
      const quiz = {
        citations: [
          {
            id: "a195080e-bcc7-11e6-a4a6-cec0c932ce01",
            title: "Single Author",
            info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at, ultricies vulputate orci. Nunc elit mauris, maximus ac pharetra sed, sollicitudin id odio. Nulla luctus vel dui sed ultrices. Phasellus in enim non nulla iaculis faucibus",
            blocks: ["Block1","Block2","Block3","Block4","Block5","Block6","Block7","Block8","Block9","Block10"],
            hints: [
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at."
            ]
          },
          {
            id: "a195080e-bcc7-11e6-a4a6-cec0c932ce02",
            title: "Two Authors",
            info: "Info about two authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at, ultricies vulputate orci. Nunc elit mauris, maximus ac pharetra sed, sollicitudin id odio. Nulla luctus vel dui sed ultrices. Phasellus in enim non nulla iaculis faucibus",
            blocks: ["Block1","Block2","Block3","Block4","Block5","Block6","Block7","Block8","Block9","Block10","Block11","Block12","Block13","Block14","Block15"],
            hints: [
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at."
            ]
          },
          {
            id: "a195080e-bcc7-11e6-a4a6-cec0c932ce03",
            title: "Another Citation",
            info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at, ultricies vulputate orci. Nunc elit mauris, maximus ac pharetra sed, sollicitudin id odio. Nulla luctus vel dui sed ultrices. Phasellus in enim non nulla iaculis faucibus",
            blocks: ["Block1","Block2","Block3","Block4","Block5","Block6","Block7","Block8","Block9","Block10","Block11","Block12","Block13","Block14","Block15","Block16","Block17","Block18","Block19","Block20"],
            hints: [
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at."
            ]
          },
          {
            id: "a195080e-bcc7-11e6-a4a6-cec0c932ce04",
            title: "Difficult Citation",
            info: "Info about two authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at, ultricies vulputate orci. Nunc elit mauris, maximus ac pharetra sed, sollicitudin id odio. Nulla luctus vel dui sed ultrices. Phasellus in enim non nulla iaculis faucibus",
            blocks: ["Block1","Block2","Block3","Block4","Block5"],
            hints: [
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Two Authors, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at."
            ]
          }
        ]
      };

      /*
        Setup code
      */

      //Quiz state object
      $scope.quiz = {};

      //Stores the current active citation index
      $scope.citationIndex = 0;

      _setupQuiz();
      _setupCitation();


      function _indexOfBlock(blockText, citationId) {
        return quiz.citations.find((ele) => ele.id === citationId).blocks.indexOf($.trim(blockText));
      }

      function _shuffleArray(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
      }

      function _clone(obj){
        return JSON.parse(JSON.stringify(obj));
      }

      function _scoreBlocks(){
        const citation = $scope.quiz.citations[$scope.citationIndex];
        const citationId = citation.id;
        const blocks = $(".quiz-sortable-block");

        let correct = 0;
        const amount = blocks.length;

        for(let i = 0; i < blocks.length; i++){
          if(i === _indexOfBlock(blocks[i].innerText, citationId)) correct++;
        }

        return correct/amount*100;
      }

      function _setupQuiz() {
        $scope.quiz.citations = [];

        //Shuffle citation order after cloning citations from quiz
        const quizCitations = _clone(quiz.citations);
        _shuffleArray(quizCitations);

        //Populate citation array with citation objects
        for(const index in quizCitations) {
          if(index === 10) break; //10 citations maximus
          $scope.quiz.citations.push(quizCitations[index]);

          const citation = $scope.quiz.citations[index];


          //Setup hint arrays
          citation.hints = quiz.citations[index].hints.map((ele) => {
            return {
            text: ele,
            unlocked: false
          }});

          citation.checks = 0;
          citation.submitted = false;

          //Shuffle citation blocks
          _shuffleArray($scope.quiz.citations[index].blocks);
        }
      }

      function _setupSortable() {
        //Calling timeout gives the DOM time to load
        $timeout(function() {
          $("#sortable"+$scope.citationIndex).sortable({

            //Sortable properties
            containment: "parent",
            revert: true,

            //BLocks have been modified
            stop: function(event, ui) {

              //Update quiz state
              $scope.quiz.citations[$scope.citationIndex].blocks = Array.from($(".quiz-sortable-block")).map((ele) => $.trim(ele.innerText));

              //Alow answer to be checked
              if($scope.quiz.citations[$scope.citationIndex].checks < 5){
                $("#checkBtn"+$scope.citationIndex).removeClass("disabled");
              }
            },
            start: function() {
              $(".quiz-sortable-block").removeClass("correct");
              $(".quiz-sortable-block").removeClass("incorrect");
            }
          });
          $("#sortable"+$scope.citationIndex).disableSelection();
        });
      }

      function _setupTooltips() {
        $timeout(function() {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }

      function _setupCitation(){
        const citation = $scope.quiz.citations[$scope.citationIndex];
        _setupSortable();

        $timeout(() => {
          if(citation.submitted){
            $(".quiz-sortable-block").addClass("submitted");
            $("#sortable"+$scope.citationIndex).sortable("disable");

          }
        });
      }



      /*
        Scope functions
      */

      $scope.nextCitation = function () {
        $timeout(function() {
          if($scope.citationIndex === $scope.quiz.citations.length - 1) return;
          $scope.citationIndex++;
          _setupCitation();
        });
      }

      $scope.prevCitation = function () {
        $timeout(function() {
          if($scope.citationIndex === 0) return;
          $scope.citationIndex--;
          _setupCitation();
        });
      }

      $scope.checkBlocks = function() {
        $timeout(() => {
            const citation = $scope.quiz.citations[$scope.citationIndex];
            const citationId = citation.id;
            const blocks = $(".quiz-sortable-block");

            for(let i = 0; i < blocks.length; i++){
              if(i === _indexOfBlock(blocks[i].innerText, citationId)){
                $(blocks[i]).addClass("correct");
              }else{
                $(blocks[i]).addClass("incorrect");
              }
            }

            citation.checks++;

            //Unlock new hint
            citation.hints.push(citation.lockedHints.splice(0,1));

            $("#checkBtn"+$scope.citationIndex).addClass("disabled");
        }).then($timeout(() => {
          $(".quiz-sortable-block").removeClass("correct");
          $(".quiz-sortable-block").removeClass("incorrect");
        },5000));
      }

      $scope.submit = function() {
        $timeout(function () {
          const citation = $scope.quiz.citations[$scope.citationIndex];
          citation.submitted = true;

          $(".quiz-sortable-block").addClass("submitted");
          $("#sortable"+$scope.citationIndex).sortable("disable");

          $(".quiz-sortable-block").removeClass("correct");
          $(".quiz-sortable-block").removeClass("incorrect");

          console.log(_scoreBlocks());
        });
      }

      //Listen for keypresses
      $(document).ready(function() {
        $(this).on('keydown', function(event) {

          //Down or right
          if (event.keyCode === 39 || event.keyCode === 40) {
              $scope.nextCitation();
          //Up or left
        }else if(event.keyCode === 37 || event.keyCode === 38){
            $scope.prevCitation();
          }

        });
      })
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
