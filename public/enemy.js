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

function addEnemyBullet(x, y) {    
  var bullet = new PIXI.Sprite(GameGraphics.getBulletGraphics());
  bullet.x = x;
  bullet.y = y;
  bullet.anchor.x = 0.5;
  bullet.anchor.y = 0.5;
  bullet.speed = 6;
  bullet.ticker = new PIXI.ticker.Ticker();
  bullet.ticker.add(function() {
    bullet.y += bullet.speed;
    if(bullet.y > app.renderer.height) {
      bullet.ticker.stop();
      bullet.destroy();
    }
    else {
      checkShipHit(bullet, ship);
      checkCellHit(bullet);
    }
  });
  bullet.ticker.start();
  app.stage.addChild(bullet);
}