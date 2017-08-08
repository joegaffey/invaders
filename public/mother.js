class Mother extends PIXI.Sprite {
  constructor(x, y) {
    super(GameGraphics.getMotherGraphics());
    this.x = x;
    this.y = y;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.hits = 0;
    this.direction = 1;
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(function() {
      if(Math.random() * 1000 < Props.MOTHER_FIRE_RATE)
        this.shoot(this.x, this.y + this.height / 2);
      this.x += this.direction * Props.MOTHER_SPEED;
      if(this.x > Props.STAGE_HRES - this.width /2)
        this.direction = -1;
      if(this.x < this.width /2)
        this.direction = 1;
    }.bind(this));
    this.ticker.start();
  }
  
  hit() {
    GameAudio.motherHitSound();
    this.hits++;
    if(this.hits === Props.MOTHER_MAX_HITS) {
      this.ticker.stop();
      Effects.explode(this.x, this.y, Props.EXPLOSION_HUGE);
      this.destroy(); 
      GameAudio.explosionSound();
      return true;
    }
    return false;
  }
  
  shoot() {
    this.addEnemyBullet(this.x, this.y - this.height / 2);
  }
  
  checkHit(bullet) {
    if(bullet && isIntersecting(bullet, this)) {
      bullet.ticker.stop();
      Effects.explode(bullet.x, bullet.y, Props.EXPLOSION_TINY);
      bullet.destroy(); 
      this.hit();
      return;
    }
  }
  
  shoot(x, y) {    
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
