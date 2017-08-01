function Ship(x, y) {    
  PIXI.Sprite.call(this, GameGraphics.getShipGraphics());
  this.x = x;
  this.y = y;
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
  this.speed = 0;
  this.direction = 1;
  
  this.shoot = function() {
    if(this.loaded) {
      GameAudio.shootSound();
      this.addBullet(this.x, this.y - this.height / 2);
      this.loaded = false;
    }
  }
  
  this.reload = function() {
    this.loaded = true;
  } 
  
  this.addBullet = function(x, y) {    
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
  
  this.checkHit = function(bullet) {
    if(isIntersecting(bullet, this)) {
      bullet.ticker.stop();
      bullet.destroy(); 
      this.hit();
      return;
    }
  }

  this.hit = function() {
    ship.speed = 0;
    alert('Game over Man! Game Over!');
    app.reset();
  }
}

Ship.prototype = Object.create(PIXI.Sprite.prototype);