function Swarm(width, height, rows) {
  
  this.enemies = [];
  this.width = width;
  this.height = height; 
  this.columns = Math.floor(this.width / Props.ENEMY_GAP) - Props.SWARM_COLUMNS_SPACE;
  this.rows = rows;
  this.speed = 1;
  this.xPos = 0;
  this.yPos = 0;
  this.direction = 1;
  
  for(var i = 0; i < this.columns; i++) {
    for(var j = 0; j < this.rows; j++) {
      var x = Props.ENEMY_GAP / 2 + this.width / 2 - (this.columns * Props.ENEMY_GAP / 2) + (i * Props.ENEMY_GAP);
      var y = Props.ENEMY_GAP + (j * Props.ENEMY_GAP);
      var enemy = getEnemy(x, y);
      enemy.tint = Props.ENEMY_COLORS[j % Props.ENEMY_COLORS.length];
      this.enemies.push(enemy);
      app.stage.addChild(enemy);
    }
  }
  
  this.shiftDown = function() {
    this.yPos++;
    this.enemies.forEach(function(enemy) {
      enemy.y += Props.SWARM_V_STEP;    
    });
    if(this.yPos * Props.SWARM_V_STEP > this.height - Props.CELLS_TOP) {
      alert(Props.DEATH_MESSAGE);
      app.reset();
    }
  }

  this.shiftLeft = function() {
    this.xPos--;
    this.enemies.forEach(function(enemy) {
      enemy.x -= Props.SWARM_H_STEP    
    });
  }

  this.shiftRight = function() {
    this.xPos++;
    this.enemies.forEach(function(enemy) {
      enemy.x += Props.SWARM_H_STEP;    
    });
  }

  this.reset = function() {
    this.enemies.forEach(function(enemy) {
      enemy.ticker.stop();
      enemy.destroy();
    });
    this.enemies.splice(0, this.enemies.length);
    this.yPos = 0;
    this.xPos = 0;
  }

  this.move = function() {
    if((this.direction == 1 && this.xPos > Props.SWARM_MAX_SHIFT) || 
       (this.direction == -1 && this.xPos < -Props.SWARM_MAX_SHIFT)) {
      this.shiftDown();
      this.direction *= -1; 
    }
    else if(this.direction === 1)
      this.shiftRight();
    else
      this.shiftLeft();
    GameAudio.moveSound();
  }

  this.checkHit = function(bullet) {
    this.enemies.forEach(function(enemy, i) {
      if(bullet && enemy && isIntersecting(bullet, enemy)) {
        bullet.ticker.stop();
        bullet.destroy(); 
        if(enemy.hit())
          swarm.enemies.splice(i, 1);
        return;
      }
    });
  }
}