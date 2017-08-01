var cells = [];
cells.wide = Props.CELLS_WIDE;
cells.deep = Props.CELLS_DEEP;  

cells.getCell = function(x, y) {    
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
    if(cell.hits > Props.CELL_MAX_HITS) {
      cell.destroy();
      cells.splice(i, 1);
    }
    else {
      cell.scale.x = 1 - (cell.hits * Props.CELL_DECAY_RATE);  
      cell.scale.y = 1 - (cell.hits * Props.CELL_DECAY_RATE);  
      cell.tint = cell.cellTints[cell.hits];
    }
  };
  return cell;
}

cells.initCells = function () {
  for(var i = 0; i < cells.wide; i++) {
    for(var j = 0; j < cells.deep; j++) {
      var x = 20 + app.renderer.width / 2 - (cells.wide * 120 / 2) + (i * 120);
      if(j % 2 == 0)
        x += 60;
      var y = 450 + (j * 20);
      var cell = cells.getCell(x, y);
      app.stage.addChild(cell); 
      cells.push(cell);
    }
  }
}
cells.initCells();

cells.reset = function() {
  cells.forEach(function(cell) {
    cell.destroy();
  });
  cells.splice(0, cells.length);
  cells.initCells();
}

function checkCellHit(bullet) {
  cells.forEach(function(cell, i) {
    if(bullet && cell && isIntersecting(bullet, cell)) {
      bullet.ticker.stop();
      bullet.destroy(); 
      cell.hit(i);
      return;
    }
  });
}