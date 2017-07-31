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
      this.addBullet(ship.x, ship.y - ship.height / 2);
      ship.loaded = false;
    }
  }
  ship.reload = function() {
    ship.loaded = true;
  } 
  ship.addBullet = function(x, y) {    
    var bullet = new PIXI.Sprite(GameGraphics.getBulletGraphics());
    bullet.x = x;
    bullet.y = y;
    bullet.anchor.x = 0.5;
    bullet.anchor.y = 0.5;
    bullet.speed = 8;
    bullet.ticker = new PIXI.ticker.Ticker();
    bullet.ticker.add(function() {
      bullet.y -= bullet.speed;
      if(bullet.y < 0) {
         bullet.ticker.stop();
         bullet.destroy(); 
      }
      else
        swarm.checkHit(bullet);
    });
    bullet.ticker.start();
    app.stage.addChild(bullet);
  }
  app.ticker.add(function() {
    ship.x += ship.speed;
  });
  return ship;
}
