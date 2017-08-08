var app = new PIXI.Application();
//app.renderer = PIXI.autoDetectRenderer(Props.STAGE_HRES, Props.STAGE_VRES, { transparent: true });
app.renderer = new PIXI.CanvasRenderer(Props.STAGE_HRES, Props.STAGE_VRES, { transparent: true });
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
    app.renderer.view.style.width = h * Props.STAGE_RATIO + 'px';
    app.renderer.view.style.height = h + 'px';     
  }
  else {
    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = w / Props.STAGE_RATIO + 'px';     
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

var swarm = new Swarm(app.renderer.width, app.renderer.height);

setInterval(function() { 
  if(!app.paused)
    swarm.move(); 
}, Props.SWARM_MOVE_INTERVAL);

setInterval(function() { 
  if(!app.paused)
    var enemy = swarm.getRandomEnemy();
    if(enemy)
       enemy.shoot();
}, Props.SWARM_SHOOT_INTERVAL);

var grid = new Grid();

var mother = new Mother(app.renderer.width / 2, 40);
app.stage.addChild(mother);

app.reset = function() {
  swarm.reset();
  grid.reset();
  mother = new Mother(app.renderer.width / 2, 40);
  app.stage.addChild(mother);
}