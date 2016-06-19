const Arena = require('./Arena');
const Player = require('./Player');

const Game = function () {
  this.score = [];
  this.roundActive = false;
  this.arena = new Arena ();
  this.playerOne = new Player ([250, 325], "Player 1", "RIGHT");
  this.playerTwo = new Player ([750, 325], "Player 2", "LEFT");
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
        pOne.move(UNDO[pOneMoves[pOneMoves.length - 1]], true);
        pTwo.move(UNDO[pTwoMoves[pTwoMoves.length - 1]], true);
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
      var pOneLastMove = pOneMoves[pOneMoves.length - 1];
      var pTwoLastMove = pTwoMoves[pTwoMoves.length - 1];
      pOne.move(pOneLastMove);
      pTwo.move(pTwoLastMove);
      if (collision(pOne.position, pTwo.position)) {
        console.log("Ahh, Collision!");
        pOne.move(UNDO[pOneMoves[pOneMoves.length - 2]], true);
        pTwo.move(UNDO[pTwoMoves[pTwoMoves.length - 2]], true);
        pOne.reset();
        pTwo.reset();
      } else if (pOneLastMove === 'JAB' || pTwoLastMove === 'JAB') {
        var pOneSwordPosDistant;
        var pOneSwordPosClose;
        var pTwoSwordPosDistant;
        var pTwoSwordPosClose;
        switch (pOne.facing) {
          case 'UP':
            pOneSwordPosDistant = [pOne.position[0], pOne.position[1] - 128];
            pOneSwordPosClose = [pOne.position[0], pOne.position[1] - 128];
            break;
          case 'DOWN':
            pOneSwordPosDistant = [pOne.position[0], pOne.position[1] + 128];
            pOneSwordPosClose = [pOne.position[0], pOne.position[1] + 128];
            break;
          case 'LEFT':
            pOneSwordPosDistant = [pOne.position[0] - 172, pOne.position[1]];
            pOneSwordPosClose = [pOne.position[0] - 172, pOne.position[1]];
            break;
          case 'RIGHT':
            pOneSwordPosDistant = [pOne.position[0] + 172, pOne.position[1]];
            pOneSwordPosClose = [pOne.position[0] + 172, pOne.position[1]];
            break;
        }
        switch (pTwo.facing) {
          case 'UP':
            pTwoSwordPosDistant = [pTwo.position[0], pTwo.position[1] - 128];
            pTwoSwordPosClose = [pTwo.position[0], pTwo.position[1] - 128];
            break;
          case 'DOWN':
            pTwoSwordPosDistant = [pTwo.position[0], pTwo.position[1] + 128];
            pTwoSwordPosClose = [pTwo.position[0], pTwo.position[1] + 128];
            break;
          case 'LEFT':
            pTwoSwordPosDistant = [pTwo.position[0] - 172, pTwo.position[1]];
            pTwoSwordPosClose = [pTwo.position[0] - 172, pTwo.position[1]];
            break;
          case 'RIGHT':
            pTwoSwordPosDistant = [pTwo.position[0] + 172, pTwo.position[1]];
            pTwoSwordPosClose = [pTwo.position[0] + 172, pTwo.position[1]];
            break;
        }
        if ((collision(pOneSwordPosDistant , pTwo.position) && !collision(pTwoSwordPosDistant, pOne.position)) ||
            (collision(pOneSwordPosClose , pTwo.position) && !collision(pTwoSwordPosClose, pOne.position))){
          this.roundActive = false;
          window.clearInterval(turnsInterval);
          setTimeout(this.resetBoard.bind(this, pTwo), 1000);
        } else if ((!collision(pOneSwordPosDistant , pTwo.position) && collision(pTwoSwordPosDistant, pOne.position)) ||
            (!collision(pOneSwordPosDistant , pTwo.position) && collision(pTwoSwordPosDistant, pOne.position))) {
          this.roundActive = false;
          window.clearInterval(turnsInterval);
          setTimeout(this.resetBoard.bind(this, pOne), 1000);
        }
      }
    }
  }.bind(this), 600);

};

Game.prototype.resetBoard = function (player) {
  player.livesRemaining -= 1;
  this.playerOne.position = [250, 325];
  this.playerOne.facing = 'RIGHT';
  this.playerOne.ready = false;
  this.playerOne.actions = [];
  this.playerTwo.position = [750, 325];
  this.playerTwo.facing = 'LEFT';
  this.playerTwo.ready = false;
  this.playerTwo.actions = [];
  if (this.playerOne.livesRemaining === 0 || this.playerTwo.livesRemaining === 0) {
    console.log('it is all over');
    this.winner((this.playerOne.livesRemaining === 0) ? this.playerTwo : this.playerOne);
  } else {
    this.roundActive = true;
  }
};

Game.prototype.winner = function (winner) {
  //place holder
  $(".modal-background").removeClass("vanish")
    .append('<div class="modal-window"><h1>' + winner.name +' is victorious!</h1></div>');
    
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

  if (this.playerOne.livesRemaining < 3) this.drawPlayerStanding(ctx, this.playerOne);
  if (this.playerTwo.livesRemaining < 3) this.drawPlayerStanding(ctx, this.playerTwo);
};

Game.prototype.drawPlayerStanding = function (ctx, player) {
  var offset;
  if (player === this.playerOne) {
    offset = [25, 100];
  } else if (player === this.playerTwo) {
    offset = [825, 100];
  }

  var drawSlash = function(cntx, offSet) {
    cntx.save();
    cntx.translate(offSet[0], offSet[1]);
    cntx.beginPath();
    cntx.lineWidth = 2;
    cntx.strokeStyle = '#000000';
    cntx.moveTo(25, 50);
    cntx.lineTo(125, 75);
    cntx.stroke();

    cntx.fillStyle = '#a2a2a2';
    cntx.beginPath();
    cntx.moveTo(25, 50);
    cntx.lineTo(126, 76);
    cntx.lineTo(35, 80);
    cntx.lineTo(25, 50);
    cntx.fill();

    cntx.restore();
  };
  // draw first slash
  drawSlash(ctx, offset);

  if (player.livesRemaining < 2) {
    //draw second slash
    offset[1] += 60;
    drawSlash(ctx, offset);
  }

  if (player.livesRemaining < 1) {
    // draw third slash
    offset[1] += 60;
    drawSlash(ctx, offset);

  }

};

module.exports = Game;
