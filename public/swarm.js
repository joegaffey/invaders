class Swarm {
  constructor(width, height, rows) {  
    this.enemies = [];
    this.positions = [];
    this.width = width;
    this.height = height; 
    this.columns = Math.floor(this.width / Props.ENEMY_GAP) - Props.SWARM_COLUMNS_MARGIN;
    this.rows = rows;
    this.speed = 1;
    this.xPos = 0;
    this.yPos = 0;
    this.direction = 1;

    for(var i = 0; i < this.columns; i++) {
      for(var j = 0; j < this.rows; j++) {
        var x = Props.ENEMY_GAP / 2 + this.width / 2 - (this.columns * Props.ENEMY_GAP / 2) + (i * Props.ENEMY_GAP);
        var y = Props.SWARM_TOP + (j * Props.ENEMY_GAP);
        var enemy = new Enemy(x, y);
        enemy.tint = Props.ENEMY_COLORS[j % Props.ENEMY_COLORS.length];
        this.enemies.push(enemy);
        this.positions.push(true);
        app.stage.addChild(enemy);
      }
    }
  }
  
  // this.addEnemy = function(x, y) {
  //   var enemy = new Enemy(x, y);
  //   this.positions.forEach(function(pos, i) {
  //     if(!pos) {
  //       this.positions[i] = true;
  //       this.enemies.push(enemy);
  //       app.stage.addChild(enemy);
  //       enemy.ticker.add(function() {
  //         enemy.y += 5;
  //         if(enemy.y > app.renderer.height) {
  //           enemy.ticker.stop();
  //           var a = i % Props.ENEMY_ROWS;
  //           var b = Math.round(i / Props.ENEMY_ROWS);            
  //           enemy.x = Props.ENEMY_GAP / 2 + this.width / 2 - (this.columns * Props.ENEMY_GAP / 2) + (b * Props.ENEMY_GAP);
  //           enemy.y = Props.SWARM_TOP + (a * Props.ENEMY_GAP);
  //         }
  //       }.bind(this));
  //       enemy.ticker.start();
  //       return;
  //     } 
  //   }.bind(this));
  // }
  
  shiftDown() {
    this.yPos++;
    this.enemies.forEach(function(enemy) {
      enemy.y += Props.SWARM_V_STEP;    
    });
    if(this.yPos * Props.SWARM_V_STEP > this.height - Props.CELLS_TOP) {
      alert(Props.DEATH_MESSAGE);
      app.reset();
    }
  }

  shiftLeft() {
    this.xPos--;
    this.enemies.forEach(function(enemy) {
      enemy.x -= Props.SWARM_H_STEP    
    });
  }

  shiftRight() {
    this.xPos++;
    this.enemies.forEach(function(enemy) {
      enemy.x += Props.SWARM_H_STEP;    
    });
  }

  reset() {
    this.enemies.forEach(function(enemy) {
      enemy.ticker.stop();
      enemy.destroy();
    });
    this.enemies.splice(0, this.enemies.length);
    this.yPos = 0;
    this.xPos = 0;
    swarm = new Swarm(app.renderer.width, app.renderer.height, Props.ENEMY_ROWS);
  }

  move() {
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

  checkHit(bullet) {
    this.enemies.forEach(function(enemy, i) {
      if(bullet && enemy && isIntersecting(bullet, enemy)) {
        bullet.ticker.stop();
        bullet.destroy(); 
        if(enemy.hit()) {
          this.enemies.splice(i, 1);
          this.positions[i] = false;
        }
        return;
      }
    }.bind(this));
  }
}