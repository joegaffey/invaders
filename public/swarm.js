var swarm = [];

swarm.init = function(width, height, rows) {
  swarm.width = width;
  swarm.height = height; 
  swarm.columns = Math.floor(swarm.width / 40) - 6;
  swarm.rows = rows;
  swarm.speed = 1;
  swarm.hStep = 5;
  swarm.vStep = 10;
  swarm.xPos = 0;
  swarm.yPos = 0;
  swarm.maxShift = 8;
  swarm.direction = 1;
  var enemyColors = [0xFFAAAA, 0xAAFF00, 0x00AAFF, 0xFF00FF, 0x00FFAA];
  for(var i = 0; i < swarm.columns; i++) {
    for(var j = 0; j < swarm.rows; j++) {
      var x = 20 + swarm.width / 2 - (swarm.columns * 40 / 2) + (i * 40);
      var y = 40 + (j * 40);
      var enemy = getEnemy(x, y);
      enemy.tint = enemyColors[j % 5];
      swarm.push(enemy);
      app.stage.addChild(enemy);
    }
  }
}
swarm.init(800, 600, 5);

swarm.shiftDown = function() {
  swarm.yPos ++;
  swarm.forEach(function(enemy) {
    enemy.y += swarm.vStep;    
  });
  if(swarm.yPos * swarm.vStep > swarm.height - 375) {
    alert('Game over Man! Game Over!');
    app.reset();
  }
}

swarm.shiftLeft = function() {
  swarm.xPos--;
  swarm.forEach(function(enemy) {
    enemy.x -= swarm.hStep;    
  });
}

swarm.shiftRight = function() {
  swarm.xPos++;
  swarm.forEach(function(enemy) {
    enemy.x += swarm.hStep;    
  });
}

swarm.reset = function() {
  swarm.forEach(function(enemy) {
    enemy.ticker.stop();
    enemy.destroy();
  });
  swarm.splice(0, swarm.length);
  swarm.yPos = 0;
  swarm.xPos = 0;
  swarm.init(800, 600, 5);
}

swarm.move = function() {
  if((swarm.direction == 1 && swarm.xPos > swarm.maxShift) || 
     (swarm.direction == -1 && swarm.xPos < -swarm.maxShift)) {
    swarm.shiftDown();
    swarm.direction *= -1; 
  }
  else if(swarm.direction == 1)
    swarm.shiftRight();
  else
    swarm.shiftLeft();
  GameAudio.moveSound();
}

swarm.checkHit = function(bullet) {
  swarm.forEach(function(enemy, i) {
    if(bullet && enemy && isIntersecting(bullet, enemy)) {
      bullet.ticker.stop();
      bullet.destroy(); 
      swarm.hitEnemy(enemy, i);
      return;
    }
  });
}

swarm.hitEnemy = function(enemy, i) {
  GameAudio.alienHitSound();
  enemy.hits++;
  if(enemy.hits == 5) {
    enemy.ticker.stop();
    enemy.destroy(); 
    swarm.splice(i, 1);
  }
}

setInterval(function() { 
  if(!app.paused && swarm.length > 0)
    swarm.move(); 
}, 1000 / swarm.speed);

setInterval(function() { 
  if(!app.paused && swarm.length > 0)
    swarm[Math.floor(Math.random() * swarm.length)].shoot();
}, 500);