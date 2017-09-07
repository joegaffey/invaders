class Assist extends PIXI.Sprite {
  constructor() {
    super(GameGraphics.getAssistGraphics());
    
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.killCount = 0;
    
    this.ready = false;
    this.entering = false;
    this.exiting = false;
    
    this.size = 0;
    
    this.lazer = new PIXI.Graphics();        
    this.lazer.lineStyle(Props.ASSIST_LAZER_WIDTH, Props.ASSIST_LAZER_COLOR);
    app.stage.addChild(this.lazer);
    
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(this.update, this);    
    this.ticker.start();
  }
  
  update() {
    if(app.paused)
      return;

    if(this.entering) {
      this.animateIn();
      return;
    }
    
    if(this.exiting) {
      this.animateOut();
      return;
    }
    
    if(this.killCount <= 0 || swarm.enemyCount <= 0)
      return;
    
    if(!this.ready) {
      this.enter();
      return;
    }

    if(this.ready && !this.target) {
      this.target = swarm.getRandomEnemy();
      if(this.target)
        this.target.power = Props.ASSIST_LAZER_DURATION;
      return;
    }      

    if(this.ready && this.target && this.target.power > 0) {
      this.lazer.moveTo(this.x, this.y);
      this.lazer.lineTo(this.target.x, this.target.y);    
      this.target.power--;
      return;
    }

    if(this.ready && this.target && this.target.power <= 0) {
      this.lazer.clear();
      this.lazer.lineStyle(Props.ASSIST_LAZER_WIDTH, Props.ASSIST_LAZER_COLOR);
      if(this.target)
        this.target.explode();
      this.target = null;
      this.killCount--;
      if(this.killCount <= 0 || swarm.enemyCount <= 0) 
        this.exit();          
    }
  }
  
  destroy(count) {  
    this.killCount += count;
  }
  
  enter() {
    this.entering = true;
    let sides = [Props.ASSIST_X_PAD, Props.STAGE_HRES - Props.ASSIST_X_PAD];
    this.x = sides[Math.round(Math.random() * 1)];
    this.y = Math.round(Math.random() * (Props.STAGE_VRES - Props.ASSIST_Y_PAD_BOTTOM)) + Props.ASSIST_Y_PAD_TOP;    
    this.scale.x = this.scale.y = 0;
    app.stage.addChild(this);
  }
  
  exit() {
    this.exiting = true;
    this.ready = false;
  }
  
  animateIn() {
    if(app.paused)
      return;
    this.size += Props.ASSIST_APPEAR_RATE;
    this.scale.x = this.scale.y = this.size;
    if(this.size >= 1) {
      this.ready = true;
      this.entering = false;
    }
  }
  
  animateOut() {
    if(app.paused)
      return;
    this.size -= Props.ASSIST_APPEAR_RATE;
    this.scale.x = this.scale.y = this.size;
    if(this.size <= 0) {
      this.exiting = false;
      app.stage.removeChild(this);
    }
  }
}
