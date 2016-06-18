const Sword = require('./Sword');

const Player = function (pos, name, facing) {
  this.position = pos || [500, 300];
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

// animation

Player.prototype.animate = function(prop, val, duration) {
  // The calculations required for the step function
  var start = new Date().getTime();
  var end = start + duration;
  var current = this.position[prop];
  var distance = val - current;

  var step = function() {
    // Get our current progres
    var timestamp = new Date().getTime();
    var progress = Math.min((duration - (end - timestamp)) / duration, 1);

    // Update the this.position's property
    this.position[prop] = current + (distance * progress);

    // If the animation hasn't finished, repeat the step.
    if (progress < 1) requestAnimationFrame(step);
  }.bind(this);

  // Start the animation
  return step();
};



module.exports = Player;
