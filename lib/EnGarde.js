const Game = require('./Game');
const GameView = require('./GameView');
const KeyBindings = require('./KeyBindings');

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
  var titleAudio = new Audio('audio/opening-sound.mp3');

  $(".title-image").addClass("appear");
  $(".title-sword-image").addClass("appear");
  titleAudio.play();

  window.setTimeout(function () { $(".title-image").addClass("float"); }, 700);
  window.setTimeout(function () {
    $(".title-image").addClass("leave");
    $(".title-sword-image").addClass("leave");
  }, 2200);


  window.setTimeout(function() {
    $(".modal-window").removeClass("title-seq-wd");
    $(".modal-background").removeClass("title-seq-bg");
    $(".modal-window").click(function () {
      $(".modal-window").addClass("vanish");
      $(".modal-background").addClass("vanish");
      game.start();
    });

    $("body").keypress(function (e) {
      var action = KeyBindings[e.keyCode];
      if (e.keyCode === 49 || e.keyCode === 50) {
        game.toggleAI(e.keyCode);
      }
      if (action && game.roundActive) {
        game.actionLog(action);
        game.readyToAdvance();
      }
    });
  }, 2500);
});
