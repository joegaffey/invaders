class Ship extends PIXI.Sprite {
  constructor() {    
    super(PIXI.Texture.fromImage('big-ship.svg', undefined, undefined, 0.11));
    this.tint = 0x44AAFF;
    
    this.x = Props.STAGE_HRES / 2;
    this.y = Props.STAGE_VRES - Props.SHIP_VERT_ADJUST;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.speed = 0;
    this.direction = 1;
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(function() {
      if(app.paused)
        this.speed = 0;
      this.x += this.speed;
      if(this.x <= this.width / 2 || this.x >= Props.STAGE_HRES - this.width / 2)
        this.x -= this.speed;
    }.bind(this));
    this.ticker.start();
    app.stage.addChild(this);
  }
  
  shoot() {
    GameAudio.shootSound();
    this.addBullet(this.x, this.y - this.height / 2);
  }
  
  charge() {
    GameAudio.shootSound();
    this.addEnergy(this.x, this.y - this.height / 2);
  }
  
  reset() {
    this.x = Props.STAGE_HRES / 2;
  }
  
  addBullet(x, y) {    
    var bullet = new PIXI.Sprite(GameGraphics.getBulletGraphics());
    bullet.x = x;
    bullet.y = y;
    bullet.anchor.x = 0.5;
    bullet.anchor.y = 0.5;
    bullet.speed = Props.BULLET_SPEED;
    bullet.ticker = new PIXI.ticker.Ticker();
    bullet.ticker.add(function() {
      if(app.paused)
         return;
      bullet.y -= bullet.speed;
      if(bullet.y < 0) {
         bullet.ticker.stop();
         bullet.destroy(); 
      }
      else {
        swarm.checkHit(bullet);
        if(mother)
           mother.checkHit(bullet);
      }
    });
    bullet.ticker.start();
    app.stage.addChild(bullet);
  }
  
  addEnergy(x, y) {    
    var energy = new PIXI.Sprite(GameGraphics.getEnergyGraphics());
    energy.x = x;
    energy.y = y;
    energy.tint = 0x00FF00;
    energy.anchor.x = 0.5;
    energy.anchor.y = 0.5;
    energy.speed = Props.BULLET_SPEED;
    energy.ticker = new PIXI.ticker.Ticker();
    energy.ticker.add(function() {
      if(app.paused)
         return;
      energy.y -= energy.speed;
      if(energy.y < 0) {
         energy.ticker.stop();
         energy.destroy(); 
      }
      else {
        grid.checkEnergy(energy);
        swarm.checkEnergy(energy);
        if(mother)
          mother.checkEnergy(energy);
      }
    });
    energy.ticker.start();
    app.stage.addChild(energy);
  }
  
  checkHit(bullet) {
    if(isIntersecting(bullet, this)) {
      bullet.ticker.stop();
      Effects.explode(bullet.x, bullet.y, Props.EXPLOSION_MEDIUM);
      bullet.destroy(); 
      this.hit();
      return;
    }
  }
  
  checkPillHit(pill) {
    if(isIntersecting(pill, this)) {
      assist.destroyEnemies(pill.power);
      pill.ticker.stop();
      pill.destroy(); 
      app.addScore(Props.PILL_COLLECT_POINTS);
      return;
    }
  }
  
  checkCollision(enemy) {
    if(enemy && isIntersecting(enemy, this)) {
      enemy.explode();
      this.hit();
    }
  }

  hit() {
    GameAudio.explosionSound();
    this.speed = 0;
    lives.dec();
  }
}