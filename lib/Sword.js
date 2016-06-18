const Sword = function (player) {
  this.player = player;
  this.color = "#b3b3b3";
};

Sword.prototype.jab = function () {
  
};

Sword.prototype.slash = function () {

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

  ctx.save();
  ctx.translate(playerX, playerY);
  ctx.rotate(facingAdjustment);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = this.color;
  ctx.moveTo(15, -5);
  ctx.lineTo(0, -40);
  ctx.stroke();
  ctx.restore();
};

module.exports = Sword;
