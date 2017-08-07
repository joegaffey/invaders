class Ship extends PIXI.Sprite {
  constructor(x, y) {    
    super(GameGraphics.getShipGraphics());
    this.x = x;
    this.y = y;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.speed = 0;
    this.direction = 1;
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
    alert(Props.DEATH_MESSAGE);
    app.reset();
  }
}