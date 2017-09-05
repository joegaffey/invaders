class Assist extends PIXI.Sprite {
  constructor() {
    super(GameGraphics.getAssistGraphics());
    
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.x = 50;
    this.y = 50;
    this.killCount = 0;
    this.ticker = new PIXI.ticker.Ticker();
    this.lazer = new PIXI.Graphics();        
    this.lazer.lineStyle(3, 0x33FF00);
    app.stage.addChild(this.lazer);
    
    this.ticker.add(function() {
      if(app.paused || this.killCount === 0)
        return;
      
      if(!this.target) {
        this.target = swarm.getRandomEnemy();
        if(!this.target || !this.target.x)
          return;
        this.target.power = 10;
        this.lazer.moveTo(this.x, this.y);
        this.lazer.lineTo(this.target.x, this.target.y);        
      }      
      
      if(this.target.power > 0)
        this.target.power--;
      else {
        this.lazer.clear();
        this.lazer.lineStyle(3, 0x33FF00);
        this.target.explode();
        this.target = null;
        this.killCount--;
      }
      
    }.bind(this));
    
    this.ticker.start();
    app.stage.addChild(this);
  }
  
  destroy(count) {  
    this.killCount += count;
  }
}