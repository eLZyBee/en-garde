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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Arena = __webpack_require__(2);
	const Player = __webpack_require__(3);
	
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

	const Player = function (pos) {
	  this.position = pos || [500, 300];
	};
	
	Player.V_MOVE = 450 / 7;
	Player.H_MOVE = 600 / 7;
	
	Player.prototype.move = function (direction) {
	  var x = this.position[0];
	  var y = this.position[1];
	  switch (direction) {
	    case 'up':
	      x -= Player.V_MOVE;
	      break;
	    case 'down':
	      x += Player.V_MOVE;
	      break;
	    case 'left':
	      x -= Player.H_MOVE;
	      break;
	    case 'right':
	      x += Player.H_MOVE;
	      break;
	  }
	  this.position = [x, y];
	};
	
	Player.prototype.draw = function (ctx) {
	  ctx.fillStyle = "#383838";
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
	
	// const MOVES = {
	//   up: [0, -1],
	//   left: [-1, 0],
	//   down: [0, 1],
	//   right: [1, 0]
	// };
	//
	// GameView.P1MOVES = {
	//   "w": MOVES.up,
	//   "a": MOVES.left,
	//   "s": MOVES.down,
	//   "d": MOVES.right
	// };
	//
	// GameView.P2MOVES = {
	//   "up": MOVES.up,
	//   "left": MOVES.left,
	//   "down": MOVES.down,
	//   "right": MOVES.right
	// };
	
	GameView.prototype.start = function () {
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  this.game.draw(this.ctx);
	  this.game.start();
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map