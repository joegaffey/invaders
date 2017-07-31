var app = new PIXI.Application();
app.renderer = PIXI.autoDetectRenderer(800, 600, { transparent: true });
app.paused = false;

document.addEventListener('visibilitychange', function() {
  if( document.visibilityState == 'hidden')
    app.paused = true;
  else if( document.visibilityState == 'visible')
    app.paused = false;
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
var shipSpeed = 3;
app.stage.addChild(ship);


app.reset = function() {
  swarm.reset();
  cells.reset();
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
  app.reset();
}