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
