var cells = [];
cells.wide = 5;
cells.deep = 4;  
initCells();

function initCells() {
  for(var i = 0; i < cells.wide; i++) {
    for(var j = 0; j < cells.deep; j++) {
      var x = 20 + app.renderer.width / 2 - (cells.wide * 120 / 2) + (i * 120);
      if(j % 2 == 0)
        x += 60;
      var y = 450 + (j * 20);
      var cell = getCell(x, y);
      app.stage.addChild(cell); 
      cells.push(cell);
    }
  }
}

function getCell(x, y) {    
  var cell = new PIXI.Sprite(GameGraphics.getCellGraphics());
  cell.x = x;
  cell.y = y;
  cell.anchor.x = 0.5;
  cell.anchor.y = 0.5;
  cell.hits = 0;
  cell.cellTints = [0xFFEEEE, 0xFFDDDD, 0xFFCCCC, 0xFFBBBB, 0xFFAAAA, 0xFF9999, 0xFF8888, 0xFF6666, 0xFF5555, 0xFF4444,  0xFF3333, 0xFF2222,  0xFF1111, 0xFF0000];
  cell.hit = function(i) {
    GameAudio.cellHitSound();
    cell.hits++;
    if(cell.hits > 12) {
      cell.destroy();
      cells.splice(i, 1);
    }
    else {
      cell.scale.x = 1 - (cell.hits * 0.05);  
      cell.scale.y = 1 - (cell.hits * 0.05);  
      cell.tint = cell.cellTints[cell.hits];
    }
  };
  return cell;
}

cells.reset = function() {
  cells.forEach(function(cell) {
    cell.destroy();
  });
  cells.splice(0, cells.length);
  initCells();
}

function checkCellHit(bullet) {
  cells.forEach(function(cell, i) {
    if(isIntersecting(bullet, cell)) {
      bullet.ticker.stop();
      bullet.destroy(); 
      cell.hit(i);
      return;
    }
  });
}