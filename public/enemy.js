class Enemy extends PIXI.Sprite {
  constructor() {
    super(Enemy.textures[0]);
    this.currentTexture = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.hits = 0;
    this.inPosition = false;
    this.startX = 0;
    this.starty = 0;
    
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(function() {
      if(app.paused)
        return;
      this.rotation += this.hits * Props.ENEMY_ROTATION_SPEED;
      this.scale.x = 1 - (this.hits * Props.ENEMY_DECAY_RATE);  
      this.scale.y = 1 - (this.hits * Props.ENEMY_DECAY_RATE);  
    }.bind(this));
    this.ticker.start();
  }
  
  swapTexture() {
    if(this.currentTexture === 0)
      this.currentTexture = 1;
    else 
      this.currentTexture = 0;
    this.setTexture(Enemy.textures[this.currentTexture]);
  }
  
  moveToStartPosition() {
    if(app.paused)
      return;
    if(Math.abs(this.x - this.startX) < Props.ENEMY_SPEED && Math.abs(this.y - this.startY) < Props.ENEMY_SPEED) {
      this.inPosition = true;
      this.x = swarm.getEnemyXByIndex(this.index);
      this.y = swarm.getEnemyYByIndex(this.index);
      grid.checkCellCollision(this);
      ship.checkCollision(this);
      this.ticker.remove(this.moveToStartPosition, this);
    }
    else {   
      var dirX = this.startX - this.x;
      var dirY = this.startY - this.y;

      var distance = Math.sqrt(dirX * dirX + dirY * dirY);
      dirX = dirX / distance;
      dirY = dirY / distance;

      this.x += dirX * Props.ENEMY_SPEED;
      this.y += dirY * Props.ENEMY_SPEED;
      grid.checkCellCollision(this);
      ship.checkCollision(this);
    }
  }
  
  explode() {
    swarm.enemyCount--;
    swarm.enemies[this.index] = null;
    GameAudio.explosionSound();
    Effects.explode(this.x, this.y, Props.EXPLOSION_MEDIUM);
    this.ticker.stop();
    this.destroy();
    if(swarm.enemyCount === 0 && !mother)
      app.stop(Props.SUCCESS_MESSAGE);
  }
  
  hit() {
    this.hits++;
    if(this.hits == Props.ENEMY_MAX_HITS) {
      app.addScore(Props.ENEMY_KILL_POINTS);
      this.explode();      
    }
    else {
      Effects.explode(this.x, this.y, Props.EXPLOSION_TINY);
      app.addScore(Props.ENEMY_HIT_POINTS);
      GameAudio.alienHitSound();
    }
  }
  
  shoot() {
    this.addEnemyBullet(this.x, this.y + this.height / 2);
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
      if(app.paused)
         return;
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

Enemy.textures = [PIXI.Texture.fromImage('invader1.svg', undefined, undefined, 0.06),
                  PIXI.Texture.fromImage('invader2.svg', undefined, undefined, 0.06)];
    