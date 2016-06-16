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
	    if (action && game.roundActive) {
	      game.actionLog(action);
	      if (game.readyToAdvance()) {
	          game.evaluateMoves();
	      }
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	const Arena = function () {
	};
	
	Arena.BG_COLOR = "#FAE7B1";
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
/***/ function(module, exports) {

	const Player = function (pos, name) {
	  this.position = pos || [500, 300];
	  this.name = name;
	  this.ready = false;
	  this.actions = [];
	  this.livesRemaining = 3;
	  this.color = "#" + pos[0] + pos[1];
	};
	
	Player.V_MOVE = 450 / 7;
	Player.H_MOVE = 600 / 7;
	
	
	Player.prototype.logAction = function (action) {
	  this.actions.length < 4 ? this.actions.push(action) : console.log(this.name + " is out of moves");
	  this.actions.length === 4 ? this.ready = true : null;
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
	  switch (direction) {
	    case 'UP':
	      this.validY(y - Player.V_MOVE) ? y -= Player.V_MOVE : null;
	      break;
	    case 'DOWN':
	      this.validY(y + Player.V_MOVE) ? y += Player.V_MOVE : null;
	      break;
	    case 'LEFT':
	      this.validX(x - Player.H_MOVE) ? x -= Player.H_MOVE : null;
	      break;
	    case 'RIGHT':
	      this.validX(x + Player.H_MOVE) ? x += Player.H_MOVE : null;
	      break;
	    case 'JAB':
	      // jab
	      break;
	    case 'SLASH':
	      // slash
	      break;
	  }
	  this.position = [x, y];
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map