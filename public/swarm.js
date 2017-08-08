class Swarm {
  constructor(width, height) {  
    this.enemies = [];
    this.width = width;
    this.height = height; 
    this.columns = Math.floor(this.width / Props.ENEMY_GAP) - Props.SWARM_COLUMNS_MARGIN;
    this.xPos = 0;
    this.yPos = 0;
    this.direction = 1;
    
    for(var i = 0; i < this.columns; i++) {
      for(var j = 0; j < Props.ENEMY_ROWS; j++) {
        var x = Props.ENEMY_GAP / 2 + this.width / 2 - (this.columns * Props.ENEMY_GAP / 2) + (i * Props.ENEMY_GAP);
        var y = Props.SWARM_TOP + (j * Props.ENEMY_GAP);
        var enemy = new Enemy();
        enemy.x = x;
        enemy.y = y;
        enemy.tint = Props.ENEMY_COLORS[j % Props.ENEMY_COLORS.length];
        this.enemies.push(enemy);
        app.stage.addChild(enemy);
      }
    }
  }
  
  //@TODO - Make this work right 
  addEnemy() {
    var newEnemy = new Enemy();
    this.enemies.forEach(function(enemy, i) {
      if(!enemy) {
        var a = i % Props.ENEMY_ROWS;
        var b = Math.round(i / Props.ENEMY_ROWS);            
        newEnemy.x = Props.ENEMY_GAP / 2 + this.width / 2 - (this.columns * Props.ENEMY_GAP / 2) + (b * Props.ENEMY_GAP);
        newEnemy.y = Props.SWARM_TOP + (a * Props.ENEMY_GAP); 
        this.enemies[i] = newEnemy;
        app.stage.addChild(newEnemy);
        
        // newEnemy.ticker.add(function() {
        //   newEnemy.y += 5;
        //   if(newEnemy.y > app.renderer.height) {
        //     newEnemy.ticker.remove();
        //     var a = i % Props.ENEMY_ROWS;
        //     var b = Math.round(i / Props.ENEMY_ROWS);            
        //     newEnemy.x = Props.ENEMY_GAP / 2 + this.width / 2 - (this.columns * Props.ENEMY_GAP / 2) + (b * Props.ENEMY_GAP);
        //     newEnemy.y = Props.SWARM_TOP + (a * Props.ENEMY_GAP);
        //   }
        // }.bind(this));
        // newEnemy.ticker.start();
        return;
      } 
    }.bind(this));
  }
  
  shiftDown() {
    this.yPos++;
    this.enemies.forEach(function(enemy) {
      if(enemy)
        enemy.y += Props.SWARM_V_STEP;    
    });
    if(this.yPos * Props.SWARM_V_STEP > this.height - Props.GRID_TOP) {
      alert(Props.DEATH_MESSAGE);
      app.reset();
    }
  }

  shiftLeft() {
    this.xPos--;
    this.enemies.forEach(function(enemy) {
      if(enemy)
         enemy.x -= Props.SWARM_H_STEP;    
    });
  }

  shiftRight() {
    this.xPos++;
    this.enemies.forEach(function(enemy) {
      if(enemy)
        enemy.x += Props.SWARM_H_STEP;    
    });
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
    swarm = new Swarm(app.renderer.width, app.renderer.height, Props.ENEMY_ROWS);
  }

  move() {
    if((this.direction === 1 && this.xPos > Props.SWARM_MAX_SHIFT) || 
       (this.direction === -1 && this.xPos < -Props.SWARM_MAX_SHIFT)) {
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
        }
        return;
      }
    }.bind(this));
  }
}