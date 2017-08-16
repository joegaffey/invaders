document.body.addEventListener('touchstart', showControls);

function showControls() {
  document.querySelector('.controls').style.display = 'block';
  document.body.removeEventListener('touchstart', showControls);
}

var fireButton = document.querySelector('.fireControl');
fireButton.addEventListener('touchstart', handleFire);

var chargeButton = document.querySelector('.chargeControl');
chargeButton.addEventListener('touchstart', handleCharge);

var leftButton = document.querySelector('.leftControl');
leftButton.addEventListener('touchstart', handleLeft);
leftButton.addEventListener('touchend', handleLeftEnd);

var rightButton = document.querySelector('.rightControl');
rightButton.addEventListener('touchstart', handleRight);
rightButton.addEventListener('touchend', handleRightEnd);

window.addEventListener('keyup', function (e) {
  if(e.keyCode == 32) {
    handleFire();
  }
  else if(e.keyCode == 17) {
    handleCharge();
  }
  else if (e.keyCode === 37  && lastKey === 37) 
    ship.speed = 0;  
  else if (e.keyCode === 39 && lastKey === 39) 
    ship.speed = 0;
});

window.addEventListener('keydown', function (e) {
  if (e.keyCode === 37) {
    ship.speed = -Props.SHIP_SPEED;
    lastKey = e.keyCode;
  }
  else if (e.keyCode === 39) { 
    ship.speed = Props.SHIP_SPEED;
    lastKey = e.keyCode;
  }
});

var gp = navigator.getGamepads()[0]; 
if(gp) {
  app.ticker.add(function() {
    var gp = navigator.getGamepads()[0];
    var reset = true;
    var analogueLR = gp.axes[0];
    if(analogueLR < -0.5) {
      ship.speed = -Props.SHIP_SPEED;  
    } 
    else if(analogueLR > 0.5) {
      ship.speed = Props.SHIP_SPEED; 
    } 
    else {
      ship.speed = 0; 
    }
    if(gp.buttons[0].value == 1) {
      ship.shoot(); 
    }
    if(gp.buttons[1].value == 1) {
      ship.charge(); 
    }
    else
      ship.reload();
  }); 
}

function handleFire() {
  if(app.paused)
    app.unPause();
  ship.loaded = true;
  ship.shoot();
}

function handleCharge() {
  if(app.paused)
    app.unPause();
  ship.loaded = true;
  ship.charge();
}

function handleLeft() {
  ship.speed = -Props.SHIP_SPEED;
}

function handleLeftEnd() {
  ship.speed = 0;
}

function handleRight() {
  ship.speed = Props.SHIP_SPEED;
}

function handleRightEnd() {
  ship.speed = 0;
}