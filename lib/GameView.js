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
