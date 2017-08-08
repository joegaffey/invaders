var GameAudio = {};

window.onload = initAudio;

function initAudio() {
  GameAudio.context = new AudioContext();
  
  var bufferLoader = new BufferLoader(GameAudio.context,
    [
      'https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fshoot.wav?1499375807873',
      'https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Ffastinvader1.wav?1499375911936',
      'https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2FextraShip.wav?1501607283115',
      'https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fufo_highpitch.wav?1499375910630',
      'https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fexplosion.wav?1499375911491',
      'https://cdn.glitch.com/1e654918-0ade-40b8-9a8e-674df6feb199%2Fsound-frogger-hop.wav?1501606884861'
    ],
    GameAudio.finishedLoading);
  bufferLoader.load();
}

GameAudio.finishedLoading = function(bufferList) {
  GameAudio.bufferList = bufferList;
}

GameAudio.shootSound = function() {
  GameAudio.playSound(0, 1); 
}

GameAudio.moveSound = function() {
  GameAudio.playSound(1, 1); 
}

GameAudio.alienHitSound = function() {
  GameAudio.playSound(5, 5); 
}

GameAudio.motherHitSound = function() {
  GameAudio.playSound(3, 1); 
}

GameAudio.cellHitSound = function() {
  GameAudio.playSound(2, 1);
}

GameAudio.explosionSound = function() {
  GameAudio.playSound(4, 1);
}

GameAudio.playSound = function(i, gain) {
  var source = GameAudio.context.createBufferSource();
  source.buffer = GameAudio.bufferList[i];
  var gainNode = GameAudio.context.createGain()
  gainNode.gain.value = gain;
  gainNode.connect(GameAudio.context.destination)
  source.connect(gainNode)
  source.start(0);
}