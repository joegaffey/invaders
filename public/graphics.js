var GameGraphics = {};

GameGraphics.getShipGraphics = function() {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0x0033FF);
  graphics.moveTo(0,0);
  graphics.lineTo(0, -15);
  graphics.lineTo(10, -15);
  graphics.lineTo(10, -25);
  graphics.lineTo(15, -30);
  graphics.lineTo(20, -25);
  graphics.lineTo(20, -15);
  graphics.lineTo(30, -15);
  graphics.lineTo(30, 0);
  graphics.lineTo(30, 0);
  graphics.lineTo(0, 0);
  graphics.endFill();
  graphics.boundsPadding = 0;
  return graphics.generateTexture();
}

GameGraphics.getBulletGraphics = function() {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0xFFFFFF);
  graphics.drawRect(4, 4, 4, 4);
  graphics.endFill();
  graphics.boundsPadding = 0;
  return graphics.generateTexture();
}

GameGraphics.getEnemyGraphics = function() {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0xFFFFFF);
  graphics.moveTo(0,0);
  graphics.lineTo(5, 5);
  graphics.lineTo(25, 5);
  graphics.lineTo(30, 0);
  graphics.lineTo(25, -5);
  graphics.lineTo(5, -5);
  graphics.lineTo(0, 0);
  graphics.drawCircle(15, -5, 6);
  graphics.endFill();
  graphics.boundsPadding = 0;
  return graphics.generateTexture();
}

GameGraphics.getCellGraphics = function() {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0x33BB33);
  graphics.lineStyle(4, 0x88FF88, 1);
  graphics.moveTo(0,0);
  graphics.lineTo(20, 20);
  graphics.lineTo(60, 20);
  graphics.lineTo(80, 0);
  graphics.lineTo(60, -20);
  graphics.lineTo(20, -20);
  graphics.lineTo(0, 0);
  graphics.endFill();
  graphics.boundsPadding = 0;
  return graphics.generateTexture();
}