class Assist extends PIXI.Sprite {
  constructor() {
    super(GameGraphics.getAssistGraphics());
    
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.sides = [65, Props.STAGE_HRES - 65];
    this.killCount = 0;
    this.ticker = new PIXI.ticker.Ticker();
    this.lazer = new PIXI.Graphics();        
    this.lazer.lineStyle(3, 0x33FF00);
    this.onScreen = false;
    app.stage.addChild(this.lazer);
    
    this.ticker.add(function() {
      if(app.paused || this.killCount === 0)
        return;
      
      if(!this.target) {
        if(!this.onScreen) {
          this.x = this.sides[Math.round(Math.random() * 1)];
          this.y = Math.round(Math.random() * (Props.STAGE_VRES - 250)) + 100;
          app.stage.addChild(this);
          this.onScreen = true;
        }
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
        if(this.killCount <= 0) {
          app.stage.removeChild(this);
          this.onScreen = false;
        }
      }
      
    }.bind(this));
    
    this.ticker.start();
  }
  
  destroy(count) {  
    this.killCount += count;
  }
}
