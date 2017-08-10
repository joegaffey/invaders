class Ship extends PIXI.Sprite {
  constructor() {    
    super(GameGraphics.getShipGraphics());
    this.x = Props.STAGE_HRES / 2;
    this.y = Props.STAGE_VRES - Props.SHIP_VERT_ADJUST;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.speed = 0;
    this.direction = 1;
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(function() {
      this.x += this.speed;
    }.bind(this));
    this.ticker.start();
    app.stage.addChild(this);
  }
  
  shoot() {
    if(this.loaded) {
      GameAudio.shootSound();
      this.addBullet(this.x, this.y - this.height / 2);
      this.loaded = false;
    }
  }
  
  reload() {
    this.loaded = true;
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
  
  checkHit(bullet) {
    if(isIntersecting(bullet, this)) {
      bullet.ticker.stop();
      bullet.destroy(); 
      this.hit();
      return;
    }
  }

  hit() {
    GameAudio.explosionSound();
    this.speed = 0;
    app.stop(Props.DEATH_MESSAGE);
  }
}