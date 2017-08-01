var GameAudio = {};

GameAudio.shootAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fshoot.wav?1499375807873');
GameAudio.moveAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Ffastinvader1.wav?1499375911936');
GameAudio.cellHitAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2FextraShip.wav?1501607283115');
GameAudio.motherHitAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fufo_highpitch.wav?1499375910630');
GameAudio.explosionAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fexplosion.wav?1499375911491');
GameAudio.alienHitAudio = new Audio('https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fsound-frogger-hop.wav?1501606884861');

GameAudio.shootSound = function() {
  this.shootAudio.play();
}

GameAudio.moveSound = function() {
  this.moveAudio.play();
}

GameAudio.alienHitSound = function() {
  this.alienHitAudio.play();
}

GameAudio.motherHitSound = function() {
  this.motherHitAudio.play();
}

GameAudio.cellHitSound = function() {
  this.cellHitAudio.play();
}

GameAudio.explosionSound = function() {
  this.explosionAudio.play();
}