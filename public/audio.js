var GameAudio = {};

GameAudio.shootAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fshoot.wav?1499375807873');
GameAudio.moveAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Ffastinvader1.wav?1499375911936');
GameAudio.alienHitAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Finvaderkilled.wav?1499375910163');

GameAudio.shootSound = function() {
  this.shootAudio.play();
}

GameAudio.moveSound = function() {
  this.moveAudio.play();
}

GameAudio.alienHitSound = function() {
  this.alienHitAudio.play();
}

GameAudio.cellHitSound = function() {
  this.alienHitAudio.play();
}