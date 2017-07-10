// import PIXI from 'pixi.js';

var app = new PIXI.Application();
app.renderer = PIXI.autoDetectRenderer(800, 600, { transparent: true });

var paused = false;

document.addEventListener('visibilitychange', function() {
  if( document.visibilityState == 'hidden')
    paused = true;
  else if( document.visibilityState == 'visible')
    paused = false;
});

var graphicsCanvas = document.querySelector('.graphicsCanvas');
graphicsCanvas.appendChild(app.view);

setSize();
window.onresize = setSize;
function setSize() {    
  var w = window.innerWidth;    
  var h = window.innerHeight;     
  var ratio = 4 / 3;
  if(w >= h) {
    app.renderer.view.style.width = h * ratio + 'px';
    app.renderer.view.style.height = h + 'px';     
  }
  else {
    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = w / ratio + 'px';     
  }
}

var ship = getShip(app.renderer.width / 2, app.renderer.height - 30);    
app.stage.addChild(ship);

var shipSpeed = 3;

function reset() {
  enemies.reset();
  cells.reset();
}

function addBullet(x, y) {    
  var bullet = new PIXI.Sprite(GameGraphics.getBulletGraphics());
  bullet.x = x;
  bullet.y = y;
  bullet.anchor.x = 0.5;
  bullet.anchor.y = 0.5;
  bullet.speed = 8;
  bullet.ticker = new PIXI.ticker.Ticker();
  bullet.ticker.add(function() {
    bullet.y -= bullet.speed;
    if(bullet.y < 0) {
       bullet.destroy(); 
    }
    else
      checkHit(bullet);
  });
  bullet.ticker.start();
  app.stage.addChild(bullet);
}

function checkHit(bullet) {
  enemies.forEach(function(enemy, i) {
    if(isIntersecting(bullet, enemy)) {
      bullet.ticker.stop();
      bullet.destroy(); 
      hit(enemy, i);
      return;
    }
  });
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

function checkShipHit(bullet, ship) {
  if(isIntersecting(bullet, ship)) {
    bullet.ticker.stop();
    bullet.destroy(); 
    hitShip();
    return;
  }
}

function hitShip() {
  ship.speed = 0;
  alert('Game over Man! Game Over!');
  reset();
}

function hit(enemy, i) {
  GameAudio.alienHitSound();
  enemy.hits++;
  if(enemy.hits == 5) {
    enemy.ticker.stop();
    enemy.destroy(); 
    enemies.splice(i, 1);
  }
}

function isIntersecting(s1, s2) {
  try {
    var r1 = s1.getBounds();
    var r2 = s2.getBounds();
    return !(r2.x > (r1.x + r1.width) || 
             (r2.x + r2.width) < r1.x || 
             r2.y > (r1.y + r1.height) ||
             (r2.y + r2.height) < r1.y);   
  }
  catch(e) { // Some issue with Pixi getBounds
    return false;
  }
}