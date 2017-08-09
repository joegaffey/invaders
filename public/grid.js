class Grid {
  constructor() {
    this.cells = [];
    this.initCells();
  }

  getCell(x, y) {    
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
        GameAudio.explosionSound();
        Effects.explode(cell.x, cell.y, Props.EXPLOSION_LARGE);
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
  
  removeCell(i) {
    this.cells.splice(i, 1);
  }

  initCells() {
    for(var i = 0; i < Props.GRID_WIDE; i++) {
      for(var j = 0; j < Props.GRID_DEEP; j++) {
        var x = Props.GRID_H_OFFSET + app.renderer.width / 2 - (Props.GRID_WIDE * Props.CELL_WIDTH / 2) + (i * Props.CELL_WIDTH);
        if(j % 2 === 0)
          x += Props.CELL_WIDTH / 2;
        var y = Props.GRID_TOP + (j * Props.CELL_HEIGHT / 2);
        var cell = this.getCell(x, y);
        app.stage.addChild(cell); 
        this.cells.push(cell);
      }
    }
  }

  reset() {
    this.cells.forEach(function(cell) {
      cell.destroy();
    });
    this.cells.splice(0, this.cells.length);
    this.initCells();
  }

  checkCellHit(bullet) {
    this.cells.forEach(function(cell, i) {
      if(bullet && cell && isIntersecting(bullet, cell)) {
        bullet.ticker.stop();
        bullet.destroy(); 
        cell.hit(i);
        return true;
      }
    });
    return false;
  }
}