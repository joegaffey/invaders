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
setSize();
window.onresize = setSize;

var ship = new Ship(app.renderer.width / 2, app.renderer.height - 30);    
var shipSpeed = 3;
app.ticker.add(function() {
  ship.x += ship.speed;
});
app.stage.addChild(ship);

var swarm = new Swarm(800, 600, 5);

setInterval(function() { 
  if(!app.paused && swarm.enemies.length > 0)
    swarm.move(); 
}, 1000 / swarm.speed);

setInterval(function() { 
  if(!app.paused && swarm.enemies.length > 0)
    swarm.enemies[Math.floor(Math.random() * swarm.enemies.length)].shoot();
}, 500);

app.reset = function() {
  swarm.reset();
  swarm = new Swarm(800, 600, 5);
  cells.reset();
}