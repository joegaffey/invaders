function Swarm(width, height, rows) {
  
  Swarm.hStep = 5;
  Swarm.vStep = 10;
  
  this.enemies = [];
  this.width = width;
  this.height = height; 
  this.columns = Math.floor(this.width / 40) - 6;
  this.rows = rows;
  this.speed = 1;
  this.xPos = 0;
  this.yPos = 0;
  this.maxShift = 8;
  this.direction = 1;
  
  var enemyColors = [0xFFAAAA, 0xAAFF00, 0x00AAFF, 0xFF00FF, 0x00FFAA];
  for(var i = 0; i < this.columns; i++) {
    for(var j = 0; j < this.rows; j++) {
      var x = 20 + this.width / 2 - (this.columns * 40 / 2) + (i * 40);
      var y = 40 + (j * 40);
      var enemy = getEnemy(x, y);
      enemy.tint = enemyColors[j % 5];
      this.enemies.push(enemy);
      app.stage.addChild(enemy);
    }
  }
  
  this.shiftDown = function() {
    this.yPos ++;
    this.enemies.forEach(function(enemy) {
      enemy.y += Swarm.vStep;    
    });
    if(this.yPos * Swarm.vStep > this.height - 375) {
      alert('Game over Man! Game Over!');
      app.reset();
    }
  }

  this.shiftLeft = function() {
    this.xPos--;
    this.enemies.forEach(function(enemy) {
      enemy.x -= Swarm.hStep;    
    });
  }

  this.shiftRight = function() {
    this.xPos++;
    this.enemies.forEach(function(enemy) {
      enemy.x += Swarm.hStep;    
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
    if((this.direction == 1 && this.xPos > this.maxShift) || 
       (this.direction == -1 && this.xPos < -this.maxShift)) {
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