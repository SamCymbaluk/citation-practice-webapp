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

      //Test data from db
      const quiz = {
        citations: [
          {
            id: "a195080e-bcc7-11e6-a4a6-cec0c932ce01",
            title: "Book with one author",
            info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at, ultricies vulputate orci. Nunc elit mauris, maximus ac pharetra sed, sollicitudin id odio. Nulla luctus vel dui sed ultrices. Phasellus in enim non nulla iaculis faucibus",
            blocks: [
              {
                id: "21",
                text: "Tatenda,"
              },
              {
                id: "22",
                text: "Amadi P."
              },
              {
                id: "23",
                text: "<em>Crunking: A World History.</em> Cape Media,"
              },
              {
                id: "24",
                text: "2002."
              }
            ],
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
            blocks: [
              {
                id: "1",
                text: "Block1"
              },
              {
                id: "2",
                text: "Block2"
              },
              {
                id: "3",
                text: "Block3"
              },
              {
                id: "4",
                text: "Block4"
              },
              {
                id: "5",
                text: "Block5"
              },
              {
                id: "6",
                text: "Block6"
              },
              {
                id: "7",
                text: "Block7"
              },
              {
                id: "8",
                text: "Block8"
              },
              {
                id: "9",
                text: "Block9"
              },
              {
                id: "10",
                text: "Block10"
              },
              {
                id: "11",
                text: "Block11"
              },
              {
                id: "12",
                text: "Block12"
              },
              {
                id: "13",
                text: "Block13"
              },
              {
                id: "14",
                text: "Block14"
              },
              {
                id: "15",
                text: "Block15"
              }
            ],
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
            blocks: [
              {
                id: "1",
                text: "Block1"
              },
              {
                id: "2",
                text: "Block2"
              },
              {
                id: "3",
                text: "Block3"
              },
              {
                id: "4",
                text: "Block4"
              },
              {
                id: "5",
                text: "Block5"
              },
              {
                id: "6",
                text: "Block6"
              },
              {
                id: "7",
                text: "Block7"
              },
              {
                id: "8",
                text: "Block8"
              },
              {
                id: "9",
                text: "Block9"
              },
              {
                id: "10",
                text: "Block10"
              },
              {
                id: "11",
                text: "Block11"
              },
              {
                id: "12",
                text: "Block12"
              },
              {
                id: "13",
                text: "Block13"
              },
              {
                id: "14",
                text: "Block14"
              },
              {
                id: "15",
                text: "Block15"
              },
              {
                id: "16",
                text: "Block16"
              },
              {
                id: "17",
                text: "Block17"
              },
              {
                id: "18",
                text: "Block18"
              },
              {
                id: "19",
                text: "Block19"
              },
              {
                id: "20",
                text: "Block20"
              }
            ],
            hints: [
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at.",
              "Hint for Single Author, consectetur adipiscing elit. Ut leo lectus, tincidunt vitae est at."
            ]
          }
        ]
      };

      /*
        Setup code
      */

      var vm = this;

      //Exports
      vm.nextCitation = nextCitation;
      vm.prevCitation = prevCitation;
      vm.check = check;
      vm.checkBypass = checkBypass;
      vm.submit = submit;
      vm.renderHtml = renderHtml;

      //Quiz state object
      vm.quiz = {};
      //Stores the current active citation index
      vm.citationIndex = 0;
      //Stores answers to quiz (not visible to vm)
      const answers = [];


      _setupQuiz();
      _updateCitation();

      /*
        Setup functions
      */
      function _setupQuiz() {
        vm.quiz.citations = [];

        //Shuffle citation order after cloning citations from quiz
        const quizCitations = _clone(quiz.citations);
        _shuffleArray(quizCitations);


        //Populate citation array with citation objects
        for(const index in quizCitations) {
          if(index === 10) break; //10 citations maximus`
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
              text: ele.text,
              id: ele.id
            }
          });

          //Stores an in-order copy of the block ids
          answers.push(_clone(citation.blocks).map((ele) => ele.id));

          citation.checks = 0;
          citation.submitted = false;

          _shuffleArray(citation.blocks);
        }
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

      function _setupTooltips() {
        $timeout(function() {
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
        $timeout(function() {
          if(vm.citationIndex === vm.quiz.citations.length - 1) return;
          vm.citationIndex++;
          _updateCitation();
        });
      }

      function prevCitation() {
        $timeout(function() {
          if(vm.citationIndex === 0) return;
          vm.citationIndex--;
          _updateCitation();
        });
      }

      function check() {
        if(sessionStorage.mlaQuizCheckConfirmation){
          checkBypass();
        }else{
          console.log(FoundationApi);
          $("#checkModal").addClass('is-active');
        }
      }

      function checkBypass(){
        sessionStorage.mlaQuizCheckConfirmation = true;
        $timeout(() => {
            const citation = vm.quiz.citations[vm.citationIndex];
            const answer = answers[vm.citationIndex];
            const blocks = $(".quiz-sortable-block");

            for(let i = 0; i < blocks.length; i++){
              if(i === answer.indexOf(blocks[i].childNodes[1].id)){
                $(blocks[i]).addClass("correct");
              }else{
                $(blocks[i]).addClass("incorrect");
              }
            }

            citation.checks++;

            //Unlock new hint
            //citation.hints.push(citation.lockedHints.splice(0,1));

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

      //Listen for keypresses
      $(document).ready(() => {
        $(this).on('keydown', (event) => {

          //Down or right
          if (event.keyCode === 39 || event.keyCode === 40) {
            nextCitation();
          //Up or left
        }else if(event.keyCode === 37 || event.keyCode === 38){
            prevCitation();
          }

        });
      })

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
        const citation = quiz.citations.filter((citation) => citation.id === citationId)[0];
        return citation.blocks.filter((block) => block.id === blockId)[0];
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
