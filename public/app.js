var app = new PIXI.Application();
app.renderer = PIXI.autoDetectRenderer(Props.HRES, Props.VRES, { transparent: true });
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
  if(w >= h) {
    app.renderer.view.style.width = h * Props.RATIO + 'px';
    app.renderer.view.style.height = h + 'px';     
  }
  else {
    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = w / Props.RATIO + 'px';     
  }
}
setSize();
window.onresize = setSize;

var ship = new Ship(app.renderer.width / 2, app.renderer.height - Props.SHIP_VERT_ADJUST);    
var shipSpeed = Props.SHIP_SPEED;
app.ticker.add(function() {
  ship.x += ship.speed;
});
app.stage.addChild(ship);

var swarm = new Swarm(app.renderer.width, app.renderer.height, Props.ENEMY_ROWS);

setInterval(function() { 
  if(!app.paused && swarm.enemies.length > 0)
    swarm.move(); 
}, Props.SWARM_MOVE_INTERVAL / swarm.speed);

setInterval(function() { 
  if(!app.paused && swarm.enemies.length > 0)
    swarm.enemies[Math.floor(Math.random() * swarm.enemies.length)].shoot();
}, Props.SWARM_SHOOT_INTERVAL);

app.reset = function() {
  swarm.reset();
  swarm = new Swarm(app.renderer.width, app.renderer.height, Props.ENEMY_ROWS);
  cells.reset();
}