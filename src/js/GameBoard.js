// const mazeImg = document.getElementById('maze-map');
import { mapTemplate } from './helpers/index.js';

export class GameBoard {
  constructor(canvas, ctx) {
    this._ctx = ctx;
    this._canvas = canvas;
    this.interval = undefined;
    this.timeUpdateMS = 10;
    this.coordsObstacle = [];
    this.portalCoords = [];
    this.mapEnumType = {
      FIGURE: 1,
      PORTAL: 2
    }
  }
  renderMap(initRender = false) {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    const { width, height } = this._canvas;
    const cellWidth = 20;
    for (let row = 0, rowIdx = 0; row < width; row += cellWidth, rowIdx++) {
      for (let col = 0, colIdx = 0; col < height; col += cellWidth, colIdx++) {
        if (mapTemplate[colIdx][rowIdx] === this.mapEnumType.FIGURE) {
          this._ctx.fillStyle = '#0370e8';
          this._ctx.fillRect(row, col, cellWidth, cellWidth);
          if (initRender) {
            this.coordsObstacle.push([row, cellWidth + row, col, cellWidth + col]);
          }
        } else if (mapTemplate[colIdx][rowIdx] === this.mapEnumType.PORTAL) { // значит это портал
          this._ctx.fillStyle = 'red';
          this._ctx.fillRect(row, col, cellWidth, cellWidth);
          if (initRender) {
            this.portalCoords.push([row, cellWidth + row, col, cellWidth + col]);
          }
        }
        else {
          this._ctx.fillStyle = '#000';
          this._ctx.strokeRect(row, col, cellWidth, cellWidth);
        }
      }
    }
  }
  render(cb) {
    this._ctx.strokeStyle = 'black';
    this.renderMap(true);
    this.interval = setInterval(() => {
      this.renderMap();
      cb();
    }, this.timeUpdateMS)
  }
}
