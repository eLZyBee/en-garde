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
