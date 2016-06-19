/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(4);
	const KeyBindings = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	
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
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Arena = __webpack_require__(2);
	const Player = __webpack_require__(3);
	
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
	    this.initializeAI(this.playerOne);
	  } else {
	    this.playerTwo.switchPlayMode();
	    this.initializeAI(this.playerTwo);
	  }
	};
	
	Game.prototype.initializeAI = function (player) {
	  window.setInterval(this.readyToAdvance.bind(this), 1000);
	  window.setInterval(player.aiPrepare.bind(player), 1000);
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
	      }
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
	        }
	      }
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	const Arena = function () {
	};
	
	Arena.BG_COLOR = "#faf0b1";
	Arena.DIM_X = 600;
	Arena.DIM_Y = 450;
	
	// check for players moving within bounds and not colliding.
	
	Arena.prototype.draw = function (ctx) {
	  // draw arena
	  ctx.fillStyle = Arena.BG_COLOR;
	  ctx.fillRect(200, 100, Arena.DIM_X, Arena.DIM_Y);
	  // draw banner
	  ctx.fillStyle = "#F5F3F0";
	  ctx.beginPath();
	  ctx.moveTo(25, 100);
	  ctx.lineTo(175, 100);
	  ctx.lineTo(175, 500);
	  ctx.lineTo(100, 425);
	  ctx.lineTo(25, 500);
	  ctx.lineTo(25, 100);
	  ctx.fill();
	
	  ctx.beginPath();
	  ctx.moveTo(825, 100);
	  ctx.lineTo(975, 100);
	  ctx.lineTo(975, 500);
	  ctx.lineTo(900, 425);
	  ctx.lineTo(825, 500);
	  ctx.lineTo(825, 100);
	  ctx.fill();
	};
	
	module.exports = Arena;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Sword = __webpack_require__(6);
	
	const Player = function (pos, name, facing) {
	  this.position = pos || [500, 300];
	  this.mode = 'HUMAN';
	  this.facing = facing;
	  this.name = name;
	  this.ready = false;
	  this.actions = [];
	  this.livesRemaining = 3;
	  this.color = "#" + pos[0] + pos[1];
	  this.sword = new Sword (this);
	};
	
	Player.V_MOVE = 450 / 7;
	Player.H_MOVE = 600 / 7;
	
	var randomAction = function () {
	  var actions = ["AI_UP", "AI_DOWN", "AI_LEFT", "AI_RIGHT", "AI_JAB", "AI_SLASH"];
	  return actions[Math.floor(Math.random() * actions.length)];
	};
	
	Player.prototype.logAction = function (action) {
	  this.actions.length < 4 ? this.actions.push(action) : console.log(this.name + " is out of moves");
	  this.actions.length === 4 ? this.ready = true : null;
	};
	
	Player.prototype.aiPrepare = function () {
	  while (this.actions.length < 4 && this.ready === false && this.mode === 'AI') {
	    this.actions.push(randomAction());
	  }
	  this.ready = true;
	};
	
	Player.prototype.reset = function () {
	  this.ready = false;
	  this.actions = [];
	};
	
	Player.prototype.validY = function (coord) {
	  return (coord < 550 && coord > 100);
	};
	
	Player.prototype.validX = function (coord) {
	  return (coord < 800 && coord > 200);
	};
	
	Player.prototype.move = function (direction) {
	  var x = this.position[0];
	  var y = this.position[1];
	  var collision = [].slice.call(arguments, 1)[0];
	
	  switch (direction) {
	    case 'UP':
	      this.validY(y - Player.V_MOVE) ? this.animate(1, (y - Player.V_MOVE), 500) : null;
	      collision ? null : this.facing = "UP";
	      break;
	    case 'DOWN':
	      this.validY(y + Player.V_MOVE) ? this.animate(1, (y + Player.V_MOVE), 500) : null;
	      collision ? null : this.facing = "DOWN";
	      break;
	    case 'LEFT':
	      this.validX(x - Player.H_MOVE) ? this.animate(0, (x - Player.H_MOVE), 500) : null;
	      collision ? null : this.facing = "LEFT";
	      break;
	    case 'RIGHT':
	      this.validX(x + Player.H_MOVE) ? this.animate(0, (x + Player.H_MOVE), 500) : null;
	      collision ? null : this.facing = "RIGHT";
	      break;
	    case 'JAB':
	      // jab
	      this.sword.jab();
	      break;
	    case 'SLASH':
	      // slash
	      this.sword.slash();
	      break;
	  }
	
	};
	
	Player.prototype.switchPlayMode = function () {
	  if (this.mode === 'HUMAN') {
	    this.mode = 'AI';
	    this.name = "Ai";
	  } else {
	    this.mode = 'HUMAN';
	    this.name = 'Human';
	  }
	};
	
	Player.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(
	    this.position[0],
	    this.position[1],
	    20,
	    0,
	    (Math.PI+(Math.PI*2)/2),
	    false);
	  ctx.fill();
	  this.sword.draw(ctx);
	};
	
	
	Player.prototype.animate = function(prop, val, duration) {
	  var start = new Date().getTime();
	  var end = start + duration;
	  var current = this.position[prop];
	  var distance = val - current;
	
	  var step = function() {
	    var timestamp = new Date().getTime();
	    var progress = Math.min((duration - (end - timestamp)) / duration, 1);
	
	    this.position[prop] = current + (distance * progress);
	
	    if (progress < 1) requestAnimationFrame(step);
	  }.bind(this);
	
	  return step();
	};
	
	
	
	module.exports = Player;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const GameView = function(game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function () {
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  this.game.draw(this.ctx);
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
	  97: "P1_LEFT",
	  115: "P1_DOWN",
	  100: "P1_RIGHT",
	  119: "P1_UP",
	  101: "P1_JAB",
	  113: "P1_SLASH",
	  108: "P2_LEFT",
	  59: "P2_DOWN",
	  39: "P2_RIGHT",
	  112: "P2_UP",
	  91: "P2_JAB",
	  111: "P2_SLASH"
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	const Sword = function (player) {
	  this.player = player;
	  this.jabbing = false;
	  this.slashing = false;
	  this.color = "#b3b3b3";
	  this.swordOrds = null;
	};
	
	Sword.prototype.jab = function () {
	  this.jabbing = true;
	
	  this.animate(1, -200, 300);
	};
	
	Sword.prototype.slash = function () {
	  this.slashing = true;
	
	  this.animate(1, 50, 300);
	};
	
	Sword.prototype.animate = function (prop, val, duration) {
	  // The calculations required for the step function
	  var start = new Date().getTime();
	  var end = start + duration;
	  var current = this.swordOrds[prop][prop];
	  var distance = val - current;
	
	  var step = function() {
	    // Get our current progress
	    var timestamp = new Date().getTime();
	    var progress = Math.min((duration - (end - timestamp)) / duration, 1);
	
	    // Update the this.swordOrds[prop][prop] property
	    this.swordOrds[prop][prop] = current + (distance * progress);
	
	    // If the animation hasn't finished, repeat the step.
	    if (progress < 1) {
	      requestAnimationFrame(step);
	    } else {
	      this.jabbing = false;
	      this.slashing = false;
	    }
	  }.bind(this);
	
	  // Start the animation
	  return step();
	};
	
	Sword.prototype.draw = function (ctx) {
	  var playerX = this.player.position[0];
	  var playerY = this.player.position[1];
	  var facing = this.player.facing;
	  var facingAdjustment;
	  var half = Math.PI/2;
	
	  switch (facing) {
	    case 'UP':
	      facingAdjustment = 0;
	      break;
	    case 'DOWN':
	      facingAdjustment = half * 2;
	      break;
	    case 'LEFT':
	      facingAdjustment = half * 3;
	      break;
	    case 'RIGHT':
	      facingAdjustment = half;
	      break;
	  }
	
	  var swordStart;
	  var swordLine;
	
	  if (this.slashing) {
	    // ords for beginning sword slash
	    swordStart = [-5, -18];
	    swordLine = [-40, -50];
	  } else if (this.jabbing) {
	    // ords for jabbing
	    swordStart = [0, -20];
	    swordLine = [0, -60];
	  } else {
	    swordStart = [15, -5];
	    swordLine = [0, -40];
	  }
	
	  ctx.save();
	  ctx.translate(playerX, playerY);
	  ctx.rotate(facingAdjustment);
	  ctx.beginPath();
	  ctx.lineWidth = 2;
	  ctx.strokeStyle = this.color;
	  ctx.moveTo(swordStart[0], swordStart[1]);
	  ctx.lineTo(swordLine[0], swordLine[1]);
	  ctx.stroke();
	  ctx.restore();
	
	  this.swordOrds = [swordStart, swordLine];
	};
	
	module.exports = Sword;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map