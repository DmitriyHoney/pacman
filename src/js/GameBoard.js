import { MAP_STATUS } from './helpers/index.js';

export class GameBoard {
  constructor(canvas, ctx, mapTemplate) {
    this._mapTemplate = mapTemplate;
    this._ctx = ctx;
    this._canvas = canvas;
    this.interval = undefined;
    this.timeUpdateMS = 10;
    this._cellWidth = 20;
    this.coordsObstacle = [];
    this.portalCoords = [];
    this.coinCoords = [];
    this.renderFunctionsByKey = {
      0: (row, col) => this.renderEmpty(row, col),
      1: (row, col) => this.renderFigure(row, col),
      2: (row, col) => this.renderPortal(row, col),
      3: (row, col) => this.renderCoin(row, col),
    };
    this.initPortalCoords();
    this.initCoordsObstacle();
    this.initCoordsCoin();
  }
  renderFigure(row, col) {
    this._ctx.fillStyle = '#0370e8';
    this._ctx.fillRect(row, col, this._cellWidth, this._cellWidth);
  }
  renderPortal(row, col) {
    this._ctx.fillStyle = 'red';
    this._ctx.fillRect(row, col, this._cellWidth, this._cellWidth);
  }
  renderEmpty(row, col) {
    this._ctx.fillStyle = '#000';
    this._ctx.strokeRect(row, col, this._cellWidth, this._cellWidth);
  }
  renderCoin(row, col) {
    this._ctx.fillStyle = '#000';
    this._ctx.strokeRect(row, col, this._cellWidth, this._cellWidth);
    this._ctx.beginPath();
    this._ctx.arc(row + 9, col + 9, 3, 0, 2 * Math.PI, false);
    this._ctx.fillStyle = 'red';
    this._ctx.fill();
    this._ctx.stroke();
  }
  initCoordsObstacle() {
    this.loopByMapTemplate((row, col, value) => {
      value === MAP_STATUS.FIGURE
        ? this.coordsObstacle.push([row, this._cellWidth + row, col, this._cellWidth + col])
        : undefined;
    });
  }
  initPortalCoords() {
    this.loopByMapTemplate((row, col, value) => {
      value === MAP_STATUS.PORTAL
        ? this.portalCoords.push([row, this._cellWidth + row, col, this._cellWidth + col])
        : undefined;
    });
  }
  initCoordsCoin() {
    this.loopByMapTemplate((row, col, value) => {
      value === MAP_STATUS.COIN
        ? this.coinCoords.push([row, this._cellWidth + row, col, this._cellWidth + col])
        : undefined;
    });
  }
  loopByMapTemplate(cb) {
    const { width, height } = this._canvas;
    for (let row = 0, rowIdx = 0; row < width; row += this._cellWidth, rowIdx++) {
      for (let col = 0, colIdx = 0; col < height; col += this._cellWidth, colIdx++) {
        const value = this._mapTemplate[colIdx][rowIdx];
        cb(row, col, value);
      }
    }
  }
  renderMap() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.loopByMapTemplate((row, col, value) => this.renderFunctionsByKey[value](row, col));
  }
  render(cb) {
    this._ctx.strokeStyle = 'black';
    this.interval = setInterval(() => {
      this.renderMap();
      cb();
    }, this.timeUpdateMS);
  }
}
