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

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

function collision(posOne, posTwo) {
  return ((posOne[0].between(posTwo[0] - 50, posTwo[0] + 50)) && (posOne[1].between(posTwo[1] - 50, posTwo[1] + 50)));
}

var UNDO = {
  "UP" : "DOWN",
  "DOWN" : "UP",
  "LEFT" : "RIGHT",
  "RIGHT" : "LEFT"
};

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
  this.roundActive = false;
  var pOne = this.playerOne;
  var pTwo = this.playerTwo;

  var pOneMoves = [];
  var pTwoMoves = [];

  var turnsInterval = setInterval(function() {
    if (pOne.actions.length === 0) {
      if (collision(pOne.position, pTwo.position)) {
        console.log("Ahh, Collision!");
        pOne.move(UNDO[pOneMoves[pOneMoves.length - 1]]);
        pTwo.move(UNDO[pTwoMoves[pTwoMoves.length - 1]]);
        pOne.reset();
        pTwo.reset();
      }
      pOne.reset();
      pTwo.reset();
      this.roundActive = true;
      window.clearInterval(turnsInterval);
    } else {
      pOneMoves.push(pOne.actions.shift().slice(3));
      pTwoMoves.push(pTwo.actions.shift().slice(3));
      pOne.move(pOneMoves[pOneMoves.length - 1]);
      pTwo.move(pTwoMoves[pTwoMoves.length - 1]);
      if (collision(pOne.position, pTwo.position)) {
        console.log("Ahh, Collision!");
        pOne.move(UNDO[pOneMoves[pOneMoves.length - 2]]);
        pTwo.move(UNDO[pTwoMoves[pTwoMoves.length - 2]]);
        pOne.reset();
        pTwo.reset();
      }
    }
  }.bind(this), 600);

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
