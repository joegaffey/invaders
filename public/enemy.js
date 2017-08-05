class Enemy extends PIXI.Sprite {
  constructor(x, y) {
    super(GameGraphics.getEnemyGraphics());
    this.x = x;
    this.y = y;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.hits = 0;
    
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(function() {
      this.rotation += this.hits * Props.ENEMY_ROTATION_SPEED;
      this.scale.x = 1 - (this.hits * Props.ENEMY_DECAY_RATE);  
      this.scale.y = 1 - (this.hits * Props.ENEMY_DECAY_RATE);  
    }.bind(this));
    this.ticker.start();
  }
  
  hit() {
    this.hits++;
    if(this.hits == 5) {
      GameAudio.alienHitSound();
      this.ticker.stop();
      this.destroy(); 
      return true;
    }
    return false;
  }
  
  shoot() {
    this.addEnemyBullet(this.x, this.y - this.height / 2);
  }
  
  addEnemyBullet(x, y) {    
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