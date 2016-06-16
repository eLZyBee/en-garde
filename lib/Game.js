const Arena = require('./Arena');
const Player = require('./Player');

const Game = function () {
  this.score = [];
  this.arena = new Arena ();
  this.playerOne = new Player ([250, 325]);
  this.playerTwo = new Player ([750, 325]);
};

Game.BG_COLOR = "#A6AAAB";
Game.DIM_X = 1000;
Game.DIM_Y = 600;

Game.prototype.start = function () {
  
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.arena.draw(ctx);
  this.playerOne.draw(ctx);
  this.playerTwo.draw(ctx);
};

module.exports = Game;
