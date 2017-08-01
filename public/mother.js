function Mother(x, y) {
  PIXI.Sprite.call(this, GameGraphics.getMotherGraphics());
  this.x = x;
  this.y = y;
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
  this.hits = 0;
  
  this.hit = function() {
    GameAudio.motherHitSound();
    this.hits++;
    if(this.hits == Props.MOTHER_MAX_HITS) {
      //this.ticker.stop();
      this.destroy(); 
      GameAudio.explosionSound();
      return true;
    }
    return false;
  }
  
  this.shoot = function() {
    this.addEnemyBullet(this.x, this.y - this.height / 2);
  }
  
  this.checkHit = function(bullet) {
    if(bullet && isIntersecting(bullet, this)) {
      bullet.ticker.stop();
      bullet.destroy(); 
      this.hit();
      return;
    }
  }
  
  this.addEnemyBullet = function(x, y) {    
    var bullet = new PIXI.Sprite(GameGraphics.getBulletGraphics());
    bullet.x = x;
    bullet.y = y;
    bullet.anchor.x = 0.5;
    bullet.anchor.y = 0.5;
    bullet.speed = Props.ENEMY_BULLET_SPEED;
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
}
Mother.prototype = Object.create(PIXI.Sprite.prototype);