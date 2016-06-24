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
  ctx.lineTo(175, 480);
  ctx.lineTo(100, 415);
  ctx.lineTo(25, 480);
  ctx.lineTo(25, 100);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(825, 100);
  ctx.lineTo(975, 100);
  ctx.lineTo(975, 480);
  ctx.lineTo(900, 415);
  ctx.lineTo(825, 480);
  ctx.lineTo(825, 100);
  ctx.fill();

  // draw controls
  var pOneControls = new Image();
  pOneControls.src = "./images/controls.png";
  var pTwoControls = new Image();
  pTwoControls.src = "./images/controls2.png";

  ctx.save();
  ctx.translate(20, 490);
  ctx.drawImage(pOneControls, 0, 0, 161, 100);
  ctx.restore();

  ctx.save();
  ctx.translate(820, 490);
  ctx.drawImage(pTwoControls, 0, 0, 161, 100);
  ctx.restore();

};

module.exports = Arena;
