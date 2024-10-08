import { sendEvent, getStage, searchItem } from "./Socket.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  // currentStage = 1000;
  // scorePerSecond = 1;


  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    const stage = getStage() //targetScore, scorePerSecond
    
    // 서버에서 정보를 못 받았을 경우
    if(stage==undefined){
      return console.log("stage undefinded")
    }
    
    this.score += (deltaTime * 0.001 * stage.scorePerSecond);

    // 점수가 기준 점수 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) >= stage.score ) {
      // this.stageChange = false;&& this.stageChange
      sendEvent(11, { currentStage: stage.id, targetStage: stage.id+1})
    }
  }

  getItem(itemId) {
    const item = searchItem(itemId)
    this.score += item.score;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    if(isNaN(this.score)){
      this.score = 0;
    }
    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
