document.body.addEventListener('touchstart', showControls);

function showControls() {
  document.querySelector('.controls').style.opacity = 0.5;
  document.body.removeEventListener('touchstart', showControls);
}

var fireButton = document.querySelector('.fireControl');
fireButton.addEventListener('touchstart', handleFire);

var leftButton = document.querySelector('.leftControl');
leftButton.addEventListener('touchstart', handleLeft);
leftButton.addEventListener('touchend', handleLeftEnd);

var rightButton = document.querySelector('.rightControl');
rightButton.addEventListener('touchstart', handleRight);
rightButton.addEventListener('touchend', handleRightEnd);


window.addEventListener('keyup', function (e) {
  if(e.keyCode == 32) {
    ship.loaded = true;
    ship.shoot();
  }
  else if (e.keyCode == 37) 
    ship.speed = 0;  
  else if (e.keyCode == 39) 
    ship.speed = 0;
});

window.addEventListener('keydown', function (e) {
  if (e.keyCode == 37) 
    ship.speed = -shipSpeed; 
  else if (e.keyCode == 39) 
    ship.speed = shipSpeed;
});

var gp = navigator.getGamepads()[0]; 
if(gp) {
  app.ticker.add(function() {
    var gp = navigator.getGamepads()[0];
    var reset = true;
    var analogueLR = gp.axes[0];
    if(analogueLR < -0.5) {
      ship.speed = -shipSpeed;  
    } 
    else if(analogueLR > 0.5) {
      ship.speed = shipSpeed; 
    } 
    else {
      ship.speed = 0; 
    }
    if(gp.buttons[0].value == 1) {
      ship.shoot(); 
    }
    else
      ship.reload();
  }); 
}

function handleFire() {
  ship.loaded = true;
  ship.shoot();
}

function handleLeft() {
  ship.speed = -shipSpeed;
}

function handleLeftEnd() {
  ship.speed = 0;
}

function handleRight() {
  ship.speed = shipSpeed;
}

function handleRightEnd() {
  ship.speed = 0;
}