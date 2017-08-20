var app = new PIXI.Application();

// Use canvas renderer to avoid cross origin issues with webgl
// Change to auto renderer to enable webgl in suported hosting environments 
//app.renderer = PIXI.autoDetectRenderer(Props.STAGE_HRES, Props.STAGE_VRES, { transparent: true });
app.renderer = new PIXI.CanvasRenderer(Props.STAGE_HRES, Props.STAGE_VRES, { transparent: true });

app.paused = true;
app.score = 0;

document.addEventListener('visibilitychange', function() {
  if( document.visibilityState == 'hidden') {
    app.pause();
  }
});

app.pause = function() {
  app.paused = true;
  app.showDialog();
}

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

var ship = new Ship();    
var mother = new Mother(); 
var swarm = new Swarm();
var grid = new Grid();
// var lives = new Lives(); 

setInterval(function() { 
  if(!app.paused)
    swarm.move(); 
}, Props.SWARM_MOVE_INTERVAL);

setInterval(function() { 
  if(!app.paused) {
    var enemy = swarm.getRandomEnemy();
    if(enemy)
       enemy.shoot();
  }
}, Math.floor(Props.SWARM_SHOOT_INTERVAL + Math.random() * Props.SWARM_SHOOT_INTERVAL));

setInterval(function() { 
  if(!app.paused) {
    if(mother)
       mother.shoot();
  }
}, Math.floor(Props.MOTHER_SHOOT_INTERVAL + Math.random() * Props.MOTHER_SHOOT_INTERVAL));

app.reset = function() {
  grid.reset();
  if(mother) {
    mother.reset();
  }
  mother = new Mother();
  swarm.reset();
  ship.reset();
  app.updateScore(0);
}

app.showDialog = function(message) {
  if(message) {
    document.querySelector('#scoreMessage').innerText = 'You scored ' + app.score + ' points';
    document.querySelector('#optMessage').innerText = message;
  }
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
  document.querySelector('#scoreMessage').innerText = '';
}

app.updateScore = function(score) {
  app.score = score;
  document.querySelector('.score').innerText = score;
}

app.addScore = function(score) {
  app.score += score;
  document.querySelector('.score').innerText = app.score;
}

app.minusScore = function(score) {
  if(app.score > score)
     app.score -= score;
  else
    app.score = 0;
  document.querySelector('.score').innerText = app.score;
}

app.stop = function(message) {
  app.paused = true;
  app.stopped = true;
  app.showDialog(message);
}