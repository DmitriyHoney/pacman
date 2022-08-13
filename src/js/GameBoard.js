const mazeImg = document.getElementById('maze-map');

export class GameBoard {
  constructor(canvas, ctx) {
    this._ctx = ctx;
    this._canvas = canvas;
    this.interval = undefined;
    this.timeUpdateMS = 10;
  }
  render(cb) {
    this.interval = setInterval(() => {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._canvas.width = mazeImg.width;
      this._canvas.height = mazeImg.height;

      // Рисуем лабиринт
      this._ctx.drawImage(mazeImg, 0, 0);
      this._ctx.stroke();
      cb();
    }, this.timeUpdateMS);
  }
}
