function Grid() {
  this.cells = [];

  this.getCell = function(x, y) {    
    var cell = new PIXI.Sprite(GameGraphics.getCellGraphics());
    cell.x = x;
    cell.y = y;
    cell.anchor.x = 0.5;
    cell.anchor.y = 0.5;
    cell.hits = 0;
    cell.hit = function(i) {
      GameAudio.cellHitSound();
      cell.hits++;
      if(cell.hits > Props.CELL_MAX_HITS) {
        cell.destroy();
        grid.removeCell(i);
      }
      else {
        cell.scale.x = 1 - (cell.hits * Props.CELL_DECAY_RATE);  
        cell.scale.y = 1 - (cell.hits * Props.CELL_DECAY_RATE);  
        cell.tint = Props.CELL_TINTS[cell.hits];
      }
    };
    return cell;
  }
  
  this.removeCell = function(i) {
    this.cells.splice(i, 1);
  }

  this.initCells = function () {
    for(var i = 0; i < Props.GRID_WIDE; i++) {
      for(var j = 0; j < Props.GRID_DEEP; j++) {
        var x = 20 + app.renderer.width / 2 - (Props.GRID_WIDE * 120 / 2) + (i * 120);
        if(j % 2 == 0)
          x += 60;
        var y = 450 + (j * 20);
        var cell = this.getCell(x, y);
        app.stage.addChild(cell); 
        this.cells.push(cell);
      }
    }
  }
  this.initCells();

  this.reset = function() {
    this.cells.forEach(function(cell) {
      cell.destroy();
    });
    this.cells.splice(0, this.cells.length);
    this.initCells();
  }

  this.checkCellHit = function(bullet) {
    this.cells.forEach(function(cell, i) {
      if(bullet && cell && isIntersecting(bullet, cell)) {
        bullet.ticker.stop();
        bullet.destroy(); 
        cell.hit(i);
        return;
      }
    });
  }
}