var Sword = require('./Sword');

var Player = function (pos, name, facing) {
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
  this.actions.length < 4 ? this.actions.push(action) : null;
  this.actions.length === 4 ? this.ready = true : null;
};

Player.prototype.aiPrepare = function () {
  if (!this.ready) {
    while (this.actions.length < 4 && this.ready === false && this.mode === 'AI') {
      this.actions.push(randomAction());
    }
    this.ready = true;
  }
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
    this.aiInterval = window.setInterval(this.aiPrepare.bind(this), 1000);
  } else {
    this.mode = 'HUMAN';
    this.name = 'Human';
    window.clearInterval(this.aiInterval);
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
