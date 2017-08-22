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

var lastKey = -1;

window.addEventListener('keyup', function (e) {
  if(e.keyCode === 32) {
    handleFire();
  }
  else if(e.keyCode === 17) {
    handleCharge();
  }
  else if(e.keyCode === 13) {
    handlePause();        
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

var gpIndex = -1;
var pads = navigator.getGamepads();
for(var i in pads) {
  if(pads[i].timestamp > 0) {
    gpIndex = i;
    break;
  }
} 

var resetPause = true;
var resetCharge = true;
var resetSpeed = false;
function checkGamepad() {
  var gp = navigator.getGamepads()[gpIndex];
  var analogueLR = gp.axes[0];
  try {
    if(analogueLR < -0.5) {
      ship.speed = -Props.SHIP_SPEED;  
      resetSpeed = true;
    } 
    else if(analogueLR > 0.5) {
      ship.speed = Props.SHIP_SPEED;
      resetSpeed = true;
    } 
    else if(resetSpeed) {
      ship.speed = 0; 
      resetSpeed = false;
    }
    if(gp.buttons[0].value === 1) {
      ship.shoot(); 
    }
    else
      ship.reload();
    if(gp.buttons[1].value === 1) {
      if(resetCharge) {
        ship.charge();
        resetCharge = false;
      }
    }
    else
      resetCharge = true;
    if(gp.buttons[9].value === 1) {
      if(resetPause) {
        handlePause();
        resetPause = false;
      }
    }
    else
      resetPause = true;
  }
  catch(e) { console.log(e); }
  window.requestAnimationFrame(checkGamepad);
}
if(gpIndex > -1)
  window.requestAnimationFrame(checkGamepad);

function handleFire() {
  if(app.paused)
    return;
  ship.loaded = true;
  ship.shoot();
}

function handleCharge() {
  if(app.paused)
    return;
  ship.loaded = true;
  ship.charge();
}

function handlePause() {
  if(app.paused)
    app.unPause();
  else
    app.pause();
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