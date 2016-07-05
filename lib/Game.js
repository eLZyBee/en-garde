var Arena = require('./Arena');
var Player = require('./Player');

var Game = function () {
  this.score = [];
  this.roundActive = false;
  this.arena = new Arena ();
  this.playerOne = new Player ([250, 325], "Player 1", "RIGHT");
  this.playerTwo = new Player ([750, 325], "Player 2", "LEFT");
  this.aiActive = false;
};

var bannerTearAudio = new Audio("audio/banner-tear.mp3");
var jabClashAudio = new Audio("audio/sword-clash-two.mp3");
var slashClashAudio = new Audio("audio/sword-clash-one.mp3");
var victoryAudio = new Audio("audio/victory.mp3");

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
  this.playerOne.livesRemaining = 3;
  this.playerTwo.livesRemaining = 3;
  this.playRound();
};

Game.prototype.playRound = function () {
  this.roundActive = true;
};

Game.prototype.readyToAdvance = function () {
  if (this.playerOne.ready && this.playerTwo.ready) {
    this.evaluateMoves();

  }

};

Game.prototype.toggleAI = function (keycode) {
  if (keycode === 49) {
    this.playerOne.switchPlayMode();
  } else {
    this.playerTwo.switchPlayMode();
  }
  if (!this.aiActive) {this.initializeAI();}
};

Game.prototype.initializeAI = function () {
  window.setInterval(this.readyToAdvance.bind(this), 1000);
  this.aiActive = true;
};

Game.prototype.evaluateMoves = function () {
  this.roundActive = false;
  var pOne = this.playerOne;
  var pTwo = this.playerTwo;

  var pOneMoves = [];
  var pTwoMoves = [];

  var turnsInterval = setInterval(function() {
    if (pOne.actions.length === 0) {
      // check for physical collision on final move
      if (collision(pOne.position, pTwo.position)) {
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
      // check for physical collision during move set
      if (collision(pOne.position, pTwo.position)) {
        pOne.move(UNDO[pOneMoves[pOneMoves.length - 2]], true);
        pTwo.move(UNDO[pTwoMoves[pTwoMoves.length - 2]], true);
        pOne.reset();
        pTwo.reset();
      }
      // check for jabbing attack
      if (pOneLastMove === 'JAB' || pTwoLastMove === 'JAB') {
        var pOneSwordPosDistant;
        var pOneSwordPosClose;
        var pTwoSwordPosDistant;
        var pTwoSwordPosClose;
        switch (pOne.facing) {
          case 'UP':
            pOneSwordPosDistant = [pOne.position[0], pOne.position[1] - 128];
            pOneSwordPosClose = [pOne.position[0], pOne.position[1] - 64];
            break;
          case 'DOWN':
            pOneSwordPosDistant = [pOne.position[0], pOne.position[1] + 128];
            pOneSwordPosClose = [pOne.position[0], pOne.position[1] + 64];
            break;
          case 'LEFT':
            pOneSwordPosDistant = [pOne.position[0] - 172, pOne.position[1]];
            pOneSwordPosClose = [pOne.position[0] - 86, pOne.position[1]];
            break;
          case 'RIGHT':
            pOneSwordPosDistant = [pOne.position[0] + 172, pOne.position[1]];
            pOneSwordPosClose = [pOne.position[0] + 86, pOne.position[1]];
            break;
        }
        switch (pTwo.facing) {
          case 'UP':
            pTwoSwordPosDistant = [pTwo.position[0], pTwo.position[1] - 128];
            pTwoSwordPosClose = [pTwo.position[0], pTwo.position[1] - 64];
            break;
          case 'DOWN':
            pTwoSwordPosDistant = [pTwo.position[0], pTwo.position[1] + 128];
            pTwoSwordPosClose = [pTwo.position[0], pTwo.position[1] + 64];
            break;
          case 'LEFT':
            pTwoSwordPosDistant = [pTwo.position[0] - 172, pTwo.position[1]];
            pTwoSwordPosClose = [pTwo.position[0] - 86, pTwo.position[1]];
            break;
          case 'RIGHT':
            pTwoSwordPosDistant = [pTwo.position[0] + 172, pTwo.position[1]];
            pTwoSwordPosClose = [pTwo.position[0] + 86, pTwo.position[1]];
            break;
        }
        // check for collisions in jabbing attack
        if ((collision(pOneSwordPosDistant , pTwo.position) && !collision(pTwoSwordPosDistant, pOne.position)) ||
            (collision(pOneSwordPosClose , pTwo.position) && !collision(pTwoSwordPosClose, pOne.position))){
          this.roundActive = false;
          window.clearInterval(turnsInterval);
          setTimeout(this.resetBoard.bind(this, pTwo), 1000);
        } else if ((!collision(pOneSwordPosDistant , pTwo.position) && collision(pTwoSwordPosDistant, pOne.position)) ||
            (!collision(pOneSwordPosClose , pTwo.position) && collision(pTwoSwordPosClose, pOne.position))) {
          this.roundActive = false;
          window.clearInterval(turnsInterval);
          setTimeout(this.resetBoard.bind(this, pOne), 1000);
        } else if ((collision(pOneSwordPosDistant , pTwo.position) && collision(pTwoSwordPosDistant, pOne.position)) ||
            (collision(pOneSwordPosClose , pTwo.position) && collision(pTwoSwordPosClose, pOne.position))) {
          jabClashAudio.currentTime = 0;
          jabClashAudio.play();
        }
      }
      // check for slashing attack
      if (pOneLastMove === 'SLASH' || pTwoLastMove === 'SLASH') {
        var pOneSwordPosLeft;
        var pOneSwordPosMid;
        var pOneSwordPosRight;
        var pTwoSwordPosLeft;
        var pTwoSwordPosMid;
        var pTwoSwordPosRight;
        switch (pOne.facing) {
          case 'UP':
            pOneSwordPosLeft = [pOne.position[0] - 86, pOne.position[1] - 64];
            pOneSwordPosMid = [pOne.position[0], pOne.position[1] - 64];
            pOneSwordPosRight = [pOne.position[0] + 86, pOne.position[1] - 64];
            break;
          case 'DOWN':
            pOneSwordPosLeft = [pOne.position[0] + 86, pOne.position[1] + 64];
            pOneSwordPosMid = [pOne.position[0], pOne.position[1] + 64];
            pOneSwordPosRight = [pOne.position[0] - 86, pOne.position[1] + 64];
            break;
          case 'LEFT':
            pOneSwordPosLeft = [pOne.position[0] - 86, pOne.position[1] - 64];
            pOneSwordPosMid = [pOne.position[0] - 86, pOne.position[1]];
            pOneSwordPosRight = [pOne.position[0] - 86, pOne.position[1] + 64];
            break;
          case 'RIGHT':
            pOneSwordPosLeft = [pOne.position[0] + 86, pOne.position[1] + 64];
            pOneSwordPosMid = [pOne.position[0] + 86, pOne.position[1]];
            pOneSwordPosRight = [pOne.position[0] + 86, pOne.position[1] - 64];
            break;
        }
        switch (pTwo.facing) {
          case 'UP':
            pTwoSwordPosLeft = [pTwo.position[0] - 86, pTwo.position[1] - 64];
            pTwoSwordPosMid = [pTwo.position[0], pTwo.position[1] - 64];
            pTwoSwordPosRight = [pTwo.position[0] + 86, pTwo.position[1] - 64];
            break;
          case 'DOWN':
            pTwoSwordPosLeft = [pTwo.position[0] + 86, pTwo.position[1] + 64];
            pTwoSwordPosMid = [pTwo.position[0], pTwo.position[1] + 64];
            pTwoSwordPosRight = [pTwo.position[0] - 86, pTwo.position[1] + 64];
            break;
          case 'LEFT':
            pTwoSwordPosLeft = [pTwo.position[0] - 86, pTwo.position[1] - 64];
            pTwoSwordPosMid = [pTwo.position[0] - 86, pTwo.position[1]];
            pTwoSwordPosRight = [pTwo.position[0] - 86, pTwo.position[1] + 64];
            break;
          case 'RIGHT':
            pTwoSwordPosLeft = [pTwo.position[0] + 86, pTwo.position[1] + 64];
            pTwoSwordPosMid = [pTwo.position[0] + 86, pTwo.position[1]];
            pTwoSwordPosRight = [pTwo.position[0] + 86, pTwo.position[1] - 64];
            break;
        }
        // check for collisions in slashing attack
        if ((collision(pOneSwordPosLeft , pTwo.position) && !collision(pTwoSwordPosLeft, pOne.position)) ||
            (collision(pOneSwordPosMid , pTwo.position) && !collision(pTwoSwordPosMid, pOne.position)) ||
            (collision(pOneSwordPosRight , pTwo.position) && !collision(pTwoSwordPosRight, pOne.position))){
          this.roundActive = false;
          window.clearInterval(turnsInterval);
          setTimeout(this.resetBoard.bind(this, pTwo), 1000);
        } else if ((!collision(pOneSwordPosLeft , pTwo.position) && collision(pTwoSwordPosLeft, pOne.position)) ||
            (!collision(pOneSwordPosMid , pTwo.position) && collision(pTwoSwordPosMid, pOne.position)) ||
            (!collision(pOneSwordPosRight , pTwo.position) && collision(pTwoSwordPosRight, pOne.position))) {
          this.roundActive = false;
          window.clearInterval(turnsInterval);
          setTimeout(this.resetBoard.bind(this, pOne), 1000);
        } else if ((collision(pOneSwordPosLeft , pTwo.position) && collision(pTwoSwordPosLeft, pOne.position)) ||
            (collision(pOneSwordPosMid , pTwo.position) && collision(pTwoSwordPosMid, pOne.position)) ||
            (collision(pOneSwordPosRight , pTwo.position) && collision(pTwoSwordPosRight, pOne.position))) {
          slashClashAudio.currentTime = 0;
          slashClashAudio.play();
        }
      }
    }
  }.bind(this), 600);

};

Game.prototype.resetBoard = function (player) {
  bannerTearAudio.play();
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
    this.winner((this.playerOne.livesRemaining === 0) ? this.playerTwo : this.playerOne);
  } else {
    this.roundActive = true;
  }
};

Game.prototype.winner = function (winner) {
  victoryAudio.play();
  $(".modal-background").toggleClass("vanish")
    .append('<div class="modal-window"><h1>' + winner.name +' is victorious!</h1></div>');

  $(".modal-window").click(function () {
    $(".modal-background").toggleClass("vanish");
    $(".modal-window").addClass("vanish");
    setTimeout(this.start.bind(this), 1000);
  }.bind(this));
};

Game.prototype.actionLog = function (action) {
  if (action.slice(1,2) === '1') {
    if (this.playerOne.mode === 'HUMAN') this.playerOne.logAction(action);
  } else {
    if (this.playerTwo.mode === 'HUMAN') this.playerTwo.logAction(action);
  }
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.arena.draw(ctx);
  this.playerOne.draw(ctx);
  this.playerTwo.draw(ctx);

  ctx.font = "40px serif";
  ctx.fillText(this.playerOne.name, 30, 90);
  ctx.fillText(this.playerTwo.name, 830, 90);

  ctx.font = "italic 50px serif";
  ctx.fillStyle = "#292929";
  ctx.fillText("En Garde", 400, 60);

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
