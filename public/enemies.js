var enemies = [];
enemies.wide = Math.floor(app.renderer.width / 40) - 6;
enemies.deep = 5;
initEnemies();

function initEnemies() {
  enemies.speed = 1;
  enemies.hStep = 5;
  enemies.vStep = 10;
  enemies.xPos = 0;
  enemies.yPos = 0;
  enemies.maxShift = 8;
  enemies.direction = 1;
  var enemyColors = [0xFFAAAA, 0xAAFF00, 0x00AAFF, 0xFF00FF, 0x00FFAA];
  for(var i = 0; i < enemies.wide; i++) {
    for(var j = 0; j < enemies.deep; j++) {
      var x = 20 + app.renderer.width / 2 - (enemies.wide * 40 / 2) + (i * 40);
      var y = 40 + (j * 40);
      var enemy = getEnemy(x, y);
      enemy.tint = enemyColors[j % 5];
      app.stage.addChild(enemy); 
      enemies.push(enemy);
    }
  }
}

enemies.shiftDown = function() {
  enemies.yPos ++;
  enemies.forEach(function(enemy) {
    enemy.y += enemies.vStep;    
  });
  if(enemies.yPos * enemies.vStep > app.renderer.height - 375) {
    alert('Game over Man! Game Over!');
    reset();
  }
}

enemies.shiftLeft = function() {
  enemies.xPos--;
  enemies.forEach(function(enemy) {
    enemy.x -= enemies.hStep;    
  });
}

enemies.shiftRight = function() {
  enemies.xPos++;
  enemies.forEach(function(enemy) {
    enemy.x += enemies.hStep;    
  });
}

enemies.reset = function() {
  enemies.forEach(function(enemy) {
    enemy.destroy();
  });
  enemies.splice(0, enemies.length);
  enemies.yPos = 0;
  enemies.xPos = 0;
  initEnemies();
}

enemies.move = function() {
  if((enemies.direction == 1 && enemies.xPos > enemies.maxShift) || 
     (enemies.direction == -1 && enemies.xPos < -enemies.maxShift)) {
    enemies.shiftDown();
    enemies.direction *= -1; 
  }
  else if(enemies.direction == 1)
    enemies.shiftRight();
  else
    enemies.shiftLeft();
  GameAudio.moveSound();
}

setInterval(function() { 
  if(!paused)
    enemies.move(); 
}, 1000 / enemies.speed);

setInterval(function() { 
  if(!paused)
    enemies[Math.floor(Math.random() * enemies.length)].shoot();
}, 500);

function getEnemy(x, y) {
  var enemy = new PIXI.Sprite(GameGraphics.getEnemyGraphics());
  enemy.x = x;
  enemy.y = y;
  enemy.anchor.x = 0.5;
  enemy.anchor.y = 0.5;
  enemy.hits = 0;
  enemy.ticker = new PIXI.ticker.Ticker();
  enemy.ticker.add(function() {
    enemy.rotation += enemy.hits * 0.1;
    enemy.scale.x = 1 - (enemy.hits * 0.1);  
    enemy.scale.y = 1 - (enemy.hits * 0.1);  
  });
  enemy.shoot = function() {
    addEnemyBullet(enemy.x, enemy.y - enemy.height / 2);
  }
  enemy.ticker.start();
  return enemy;
}