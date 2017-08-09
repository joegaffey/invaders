var app = new PIXI.Application();

// Use canvas renderer to avoid cross origin issues with webgl
//Change to auto renderer to enable webgl in suported hosting environments 
//app.renderer = PIXI.autoDetectRenderer(Props.STAGE_HRES, Props.STAGE_VRES, { transparent: true });

app.renderer = new PIXI.CanvasRenderer(Props.STAGE_HRES, Props.STAGE_VRES, { transparent: true });
app.paused = true;

document.addEventListener('visibilitychange', function() {
  if( document.visibilityState == 'hidden') {
    app.paused = true;
    app.showDialog();
  }
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

var swarm = new Swarm();

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

app.showDialog = function(message) {
  if(message)
    document.querySelector('#optMessage').innerText = message;
  document.querySelector('.modal').style.display = 'block';
}

app.hideDialog = function() {
  document.querySelector('.modal').style.display = 'none';
}

app.unPause = function() {
  if(app.stopped) {
    app.stopped = false;
    app.reset();
  }
  app.paused = false;
  app.hideDialog();
  document.querySelector('#optMessage').innerText = '';
}

app.stop = function(message) {
  app.paused = true;
  app.stopped = true;
  app.showDialog(message);
}