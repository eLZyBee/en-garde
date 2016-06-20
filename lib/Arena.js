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

  // draw controls

  ctx.save();
  ctx.translate(20, 550);
  ctx.font = "18px serif";
  ctx.fillStyle = "#1c1c1c";
  ctx.fillText("W A S D keys to move", 0, 0);
  ctx.fillText("Q to Slash, E to Jab",10, 20);
  ctx.restore();

  ctx.save();
  ctx.translate(825, 550);
  ctx.font = "18px serif";
  ctx.fillStyle = "#2e0b0b";
  ctx.fillText("P L ; ' keys to move", 5, 0);
  ctx.fillText("O to Slash, [ to Jab",10, 20);
  ctx.restore();

};

module.exports = Arena;
