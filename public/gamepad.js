var gpIndex = -1;
var pads = navigator.getGamepads();
for(var i in pads) {
  if(pads[i] && pads[i].timestamp > 0) {
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
      Controls.handleLeft();  
      resetSpeed = true;
    } 
    else if(analogueLR > 0.5) {
      Controls.handleRight();
      resetSpeed = true;
    } 
    else if(resetSpeed) {
      Controls.handleStop();
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
        Controls.handlePause();
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
