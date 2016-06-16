const Game = require('./Game');
const GameView = require('./GameView');

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  $(".modal-window").click(function () {
    $(".modal-window").addClass("vanish");
    $(".modal-background").addClass("vanish");
  });
  
  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});
