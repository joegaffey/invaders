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

function resize() {
    if (window.innerWidth / window.innerHeight >= Props.STAGE_RATIO) {
        var w = window.innerHeight * Props.STAGE_RATIO;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / Props.STAGE_RATIO;
    }
    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = h - Props.STAGE_VERT_OFFSET + 'px';
}
window.onresize = resize;
resize();

var ship = new Ship();    
var mother = new Mother(); 
var swarm = new Swarm();
var grid = new Grid();
var assist = new Assist();
var lives = new Lives(); 

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

if(Props.SERVER_AVAILABLE) {
  fetch('/properties').then(function(response) {
    return response.json();
  }).then(function(data) {
    Props = data.props;
  });
  
  var init = {
    method: "POST",
    body: JSON.stringify({})
  }
  var request = new Request('/games/', init);  
  fetch(request)
    .then(function(res){ return res.json(); })
    .then(function(data){ 
      app.game = data; 
  });
  
  setInterval(function() { 
    if(app.paused)
      return;
    if(!app.game)
      return;
    
    var request = new Request('/games/' + app.game.id);  
    fetch(request).then(function(response) {
      return response.json();
    }).then(function(data) {
      app.game = data;
      for(var i = 0; i < data.newInvaders.length; i++)
        swarm.addEnemy();
      for(var i = 0; i < data.newPills.length; i++)
        mother.addPill(data.newPills[i].power);
      assist.destroyEnemies(data.destroyedInvaders.length);
      var count = swarm.enemyCount - data.destroyedInvaders.length;
      if(count < 0)
        count = 0;
      sendInvaderCount(count);
    });
  }, Props.SERVER_POLL_INTERVAL);   
}
else {
  swarm.addEnemies(Props.SWARM_INITIAL_SIZE);
}

function sendInvaderCount(count) {
  var data = {};
  data.count = count;
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  var init = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: headers
  };
  var request = new Request('/games/' + app.game.id + '/invaders/count', init);  
  fetch(request);
}

app.reset = function() {
  grid.reset();
  if(mother) {
    mother.reset();
  }
  mother = new Mother();
  swarm.reset();
  ship.reset();
  assist.reset();
  lives.reset();
  app.updateScore(0);
  if(!Props.SERVER_AVAILABLE)
    swarm.addEnemies(Props.SWARM_INITIAL_SIZE);
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