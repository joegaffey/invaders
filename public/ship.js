function getShip(x, y) {    
  var ship = new PIXI.Sprite(GameGraphics.getShipGraphics());
  ship.x = x;
  ship.y = y;
  ship.anchor.x = 0.5;
  ship.anchor.y = 0.5;
  ship.speed = 0;
  ship.shoot = function() {
    if(ship.loaded) {
      GameAudio.shootSound();
      addBullet(ship.x, ship.y - ship.height / 2);
      ship.loaded = false;
    }
  }
  ship.reload = function() {
    ship.loaded = true;
  } 
  app.ticker.add(function() {
    ship.x += ship.speed;
  });
  return ship;
}