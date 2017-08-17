class Swarm {
  constructor() {  
    this.enemies = [];
    this.width = app.renderer.width;
    this.height = app.renderer.height; 
    this.columns = Math.floor(this.width / Props.ENEMY_GAP) - Props.SWARM_COLUMNS_MARGIN;
    this.xPos = Props.SWARM_COLUMNS_MARGIN / 2 * Props.ENEMY_GAP;
    this.yPos = Props.SWARM_TOP;
    this.xShift = 0;
    this.direction = 1;       
    this.enemyCount = 0;
    for(var i = 0; i < Props.SWARM_INITIAL_SIZE; i++) {
      this.addEnemy();
    }
  }
  
  addEnemy() {
    for(var i  = 0; i < this.enemies.length + 1; i++) {
      if(!this.enemies[i]) {
        var enemy = new Enemy();
        enemy.x = this.xPos + this.getColumnByIndex(i) * Props.ENEMY_GAP;
        enemy.y = this.yPos + this.getRowByIndex(i) * Props.ENEMY_GAP;
        enemy.tint = Props.ENEMY_COLORS[this.getRowByIndex(i) % Props.ENEMY_COLORS.length];
        this.enemies[i] = enemy;
        app.stage.addChild(enemy);
        this.enemyCount++;
        this.moveEnemyIntoPosition(enemy, i);
        return;
      }
    }
  }
  
  moveEnemyIntoPosition(enemy, i) {
    enemy.x = mother.x;
    enemy.y = mother.y; 
    enemy.startX = this.xPos + this.getColumnByIndex(i) * Props.ENEMY_GAP;
    enemy.startY = this.yPos + this.getRowByIndex(i) * Props.ENEMY_GAP;
    enemy.ticker.add(enemy.moveToStartPosition, enemy);
  }
  
  getColumnByIndex(i) {
    return i % this.columns;
  }
  
  getRowByIndex(i) {
    return Math.floor(i / this.columns);
  }
  
  shiftDown() {
    this.xShift = 0;
    this.yPos += Props.SWARM_V_STEP;   
    this.enemies.forEach(function(enemy, i) {
      if(enemy && enemy.inPosition) {
        if(enemy.y > Props.GRID_TOP - Props.ENEMY_GAP) {
          app.stop(Props.DEATH_MESSAGE);
          return;
        }           
        enemy.y = this.yPos + this.getRowByIndex(i) * Props.ENEMY_GAP;         
      }
    }.bind(this));
  }

  shiftLeft() {
    this.xPos -= Props.SWARM_H_STEP;   
    this.xShift--;
    this.enemies.forEach(function(enemy, i) {
      if(enemy && enemy.inPosition)
         enemy.x = this.xPos + this.getColumnByIndex(i) * Props.ENEMY_GAP;
    }.bind(this));
  }

  shiftRight() {
    this.xPos += Props.SWARM_H_STEP;   
    this.xShift++;
    this.enemies.forEach(function(enemy, i) {
      if(enemy && enemy.inPosition)
        enemy.x = this.xPos + this.getColumnByIndex(i) * Props.ENEMY_GAP;
    }.bind(this));
  } 
  
  getRandomEnemy() {
    let enemy = null;
    let i = 0;
    while(!enemy) {
      i++;
      if(i > this.enemies.length)
        return null;
      enemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
    }
    return enemy;
  }

  reset() {
    this.enemies.forEach(function(enemy) {
      if(enemy) {
        enemy.ticker.stop();
        enemy.destroy();
      }
    });
    this.enemies.splice(0, this.enemies.length);
    this.yPos = 0;
    this.xPos = 0;
    swarm = new Swarm();
  }

  move() {
    if(this.enemyCount === 0)
      return;
    if((this.direction === 1 && this.xShift > Props.SWARM_MAX_SHIFT) || 
       (this.direction === -1 && this.xShift < -Props.SWARM_MAX_SHIFT)) {
      this.shiftDown();
      this.direction *= -1; 
    }
    else if(this.direction === 1)
      this.shiftRight();
    else
      this.shiftLeft();
    GameAudio.moveSound();
  }

  checkHit(bullet) {
    this.enemies.forEach(function(enemy, i) {
      if(bullet && enemy && isIntersecting(bullet, enemy)) {
        bullet.ticker.stop();
        bullet.destroy(); 
        if(enemy.hit()) {
          this.enemies[i] = null;
          this.enemyCount--;
          if(this.enemyCount === 0 && mother.hits === Props.MOTHER_MAX_HITS)
            app.stop(Props.SUCCESS_MESSAGE);
        }
        return;
      }
    }.bind(this));
  }
  
  checkEnergy(energy) {
    this.enemies.forEach(function(enemy, i) {
      if(energy && enemy && isIntersecting(energy, enemy)) {
        if(enemy.hits > 0) {
          energy.ticker.stop();
          energy.destroy(); 
          enemy.hits--;
          if(enemy.hits == 0)
            enemy.rotation = 0;
        }
        return;
      }
    }.bind(this));
  }
}