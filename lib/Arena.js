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
