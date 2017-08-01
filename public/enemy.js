function Enemy(x, y) {
  PIXI.Sprite.call(this, GameGraphics.getEnemyGraphics());
  this.x = x;
  this.y = y;
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
  this.hits = 0;
  
  this.hit = function() {
    GameAudio.alienHitSound();
    this.hits++;
    if(this.hits == 5) {
      this.ticker.stop();
      this.destroy(); 
      return true;
    }
    return false;
  }
  
  this.shoot = function() {
    this.addEnemyBullet(this.x, this.y - this.height / 2);
  }
  
  this.addEnemyBullet = function(x, y) {    
    var bullet = new PIXI.Sprite(GameGraphics.getBulletGraphics());
    bullet.x = x;
    bullet.y = y;
    bullet.anchor.x = 0.5;
    bullet.anchor.y = 0.5;
    bullet.speed = 6;
    bullet.ticker = new PIXI.ticker.Ticker();
    bullet.ticker.add(function() {
      bullet.y += bullet.speed;
      if(bullet.y > app.renderer.height) {
        bullet.ticker.stop();
        bullet.destroy();
      }
      else {
        ship.checkHit(bullet);
        grid.checkCellHit(bullet);
      }
    });
    bullet.ticker.start();
    app.stage.addChild(bullet);
  }
  
  this.ticker = new PIXI.ticker.Ticker();
  this.ticker.add(function() {
    this.rotation += this.hits * 0.1;
    this.scale.x = 1 - (this.hits * 0.1);  
    this.scale.y = 1 - (this.hits * 0.1);  
  }.bind(this));
  this.ticker.start();
}
Enemy.prototype = Object.create(PIXI.Sprite.prototype);