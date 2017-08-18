class Lives {
  constructor() {
    this.lives = Props.PLAYER_LIVES;
    this.livesEl = document.querySelector('.lives');
    this.initLives();
  }
  
  initLives() {
    for(var i = 0; i < this.lives; i++) {
      var img = document.createElement('IMG');
      img.src = 'ship.svg';
      img.style.maxHeight = '15px';
      img.style.maxWidth = '15px';
      this.livesEl.appendChild(img);
    }
  }
  
  reset() {
    this.lives = Props.PLAYER_LIVES;
    this.initLIves();
  }
}