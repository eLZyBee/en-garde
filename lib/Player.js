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
