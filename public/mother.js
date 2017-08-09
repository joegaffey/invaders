class Mother extends PIXI.Sprite {
  constructor() {
    super(GameGraphics.getMotherGraphics());
    this.x = app.renderer.width / 2;
    this.y = 40;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.hits = 0;
    this.direction = 1;
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(function() {
      if(!app.paused) {
        this.x += this.direction * Props.MOTHER_SPEED;
        if(this.x > Props.STAGE_HRES - this.width /2)
          this.direction = -1;
        if(this.x < this.width /2)
          this.direction = 1;
      }
    }.bind(this));
    app.stage.addChild(this);
    this.ticker.start();
  }
  
  hit() {
    GameAudio.motherHitSound();
    this.hits++;
    if(this.hits === Props.MOTHER_MAX_HITS) {
      this.ticker.stop();
      GameAudio.explosionSound();
      Effects.explode(this.x, this.y, Props.EXPLOSION_HUGE);
      this.destroy(); 
      app.addScore(Props.MOTHER_KILL_POINTS);
      return true;
    }
    app.addScore(Props.MOTHER_HIT_POINTS);
    return false;
  }
  
  shoot() {
    this.addBullet(this.x, this.y + this.height / 2);
  }
  
  checkHit(bullet) {
    if(bullet && isIntersecting(bullet, this)) {
      bullet.ticker.stop();
      Effects.explode(bullet.x, bullet.y, Props.EXPLOSION_TINY);
      bullet.destroy(); 
      if(this.hit() && swarm.enemyCount === 0)
        app.stop(Props.SUCCESS_MESSAGE);       
    }
  }
  
  addBullet(x, y) {    
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
  
  reset() {
    this.destroy();
    mother = new Mother();
  }
}
