const Arena = require('./Arena');
const Player = require('./Player');

const Game = function () {
  this.score = [];
  this.roundActive = false;
  this.arena = new Arena ();
  this.playerOne = new Player ([250, 325], "Player 1");
  this.playerTwo = new Player ([750, 325], "Player 2");
};

Game.BG_COLOR = "#A6AAAB";
Game.DIM_X = 1000;
Game.DIM_Y = 600;

Game.prototype.start = function () {
  this.playRound();
};

Game.prototype.playRound = function () {
  this.roundActive = true;
};

Game.prototype.readyToAdvance = function () {
  return (this.playerOne.ready && this.playerTwo.ready);
};

Game.prototype.evaluateMoves = function () {
  console.log('evaluating');
  var pOne = this.playerOne;
  var pTwo = this.playerTwo;

  var turnsInterval = setInterval(function() {
    if (pOne.actions.length === 0) {
      pOne.reset();
      pTwo.reset();
      window.clearInterval(turnsInterval);
    } else {
      pOne.move(pOne.actions.shift().slice(3));
      pTwo.move(pTwo.actions.shift().slice(3));
    }
  }, 400);
  // for (var i = 0; i < pOne.actions.length; i++) {
  //     pOne.move(pOne.actions[i].slice(3));
  //     pTwo.move(pTwo.actions[i].slice(3));
  // }
};

Game.prototype.winner = function () {
  //place holder
  return false;
};

Game.prototype.actionLog = function (action) {
  if (action.slice(1,2) === '1') {
    this.playerOne.logAction(action);
  } else {
    this.playerTwo.logAction(action);
  }
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
