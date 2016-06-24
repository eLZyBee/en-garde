const Sword = function (player) {
  this.player = player;
  this.jabbing = false;
  this.slashing = false;
  this.color = "#b3b3b3";
  this.swordOrds = null;
};

var jabAudio = new Audio("audio/sword-jab-one.mp3");
var slashAudio = new Audio("audio/sword-slash-one.mp3");

Sword.prototype.jab = function () {
  this.jabbing = true;
  this.moveStart = new Date().getTime();

  this.animate(1, -200, 300);
  jabAudio.currentTime = 0;
  jabAudio.play();
};

Sword.prototype.slash = function () {
  this.slashing = true;
  this.moveStart = new Date().getTime();

  this.animate(1, 50, 300);
  slashAudio.currentTime = 0;
  slashAudio.play();
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

  var swordImage = new Image();
  swordImage.src = "./images/sword.png";
  var straightSwordImage = new Image();
  straightSwordImage.src = "./images/straightSword.png";

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
    // swordStart = [0, 0];
    // swordLine = [-40, -70];
    swordStart = [30, -5];
    swordLine = [-35, -75];
    ctx.save();
    ctx.translate(playerX, playerY);
    var timestamp = new Date().getTime();
    debugger
    ctx.rotate(-((facingAdjustment - (half)) - (timestamp - this.moveStart) / 100));
    ctx.drawImage(straightSwordImage, swordStart[0], swordStart[1], swordLine[0], swordLine[1]);
    ctx.restore();
  } else if (this.jabbing) {
    // ords for jabbing
    swordStart = [20, -15];
    swordLine = [-35, -125]; // distance in front of character
    ctx.save();
    ctx.translate(playerX, playerY);
    ctx.rotate(facingAdjustment);
    ctx.drawImage(swordImage, swordStart[0], swordStart[1], swordLine[0], swordLine[1]);
    ctx.restore();
  } else {
    swordStart = [25, 0];
    swordLine = [-35, -75];
    ctx.save();
    ctx.translate(playerX, playerY);
    ctx.rotate(facingAdjustment);

    ctx.drawImage(swordImage, swordStart[0], swordStart[1], swordLine[0], swordLine[1]);
    ctx.restore();
  }

  // ctx.save();
  // ctx.translate(playerX, playerY);
  // ctx.rotate(facingAdjustment);
  //
  // ctx.drawImage(swordImage, swordStart[0], swordStart[1], swordLine[0], swordLine[1]);
  // ctx.drawImage(swordImage, 25,0,-35,-75);

  // ctx.beginPath();
  // ctx.lineWidth = 2;
  // ctx.strokeStyle = this.color;
  // ctx.moveTo(swordStart[0], swordStart[1]);
  // ctx.lineTo(swordLine[0], swordLine[1]);
  // ctx.stroke();
  // ctx.restore();

  this.swordOrds = [swordStart, swordLine];
};

module.exports = Sword;
