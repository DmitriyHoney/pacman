import { MAP_STATUS } from './helpers/index.js';

export class GameBoard {
  constructor(canvas, ctx, mapTemplate) {
    this._mapTemplate = mapTemplate;
    this._ctx = ctx;
    this._canvas = canvas;
    this.interval = undefined;
    this.timeUpdateMS = 10;
    this._cellWidth = 20;
    this.mapAllPoints = [];
    this.coordsObstacle = [];
    this.portalCoords = [];
    this.coinCoords = [];
    this.crossRoadCoords = [];
    this.renderFunctionsByKey = {
      0: (x, y) => this.renderEmpty(x, y),
      1: (x, y) => this.renderFigure(x, y),
      2: (x, y) => this.renderPortal(x, y),
      3: (x, y) => this.renderCoin(x, y),
    };
    this.initAllMapPoints();
    this.initPortalCoords();
    this.initCoordsObstacle();
    this.initCoordsCoin();
    this.initCoordsCrossRoad();
  }

  renderFigure(x, y) {
    this._ctx.fillStyle = '#0370e8';
    this._ctx.fillRect(x, y, this._cellWidth, this._cellWidth);
  }
  renderPortal(x, y) {
    this._ctx.fillStyle = 'red';
    this._ctx.fillRect(x, y, this._cellWidth, this._cellWidth);
  }
  renderEmpty(x, y) {
    this._ctx.fillStyle = '#000';
    this._ctx.strokeRect(x, y, this._cellWidth, this._cellWidth);
  }
  renderCoin(x, y) {
    this._ctx.fillStyle = '#000';
    this._ctx.strokeRect(x, y, this._cellWidth, this._cellWidth);
    this._ctx.beginPath();
    this._ctx.arc(x + 9, y + 9, 3, 0, 2 * Math.PI, false);
    this._ctx.fillStyle = 'red';
    this._ctx.fill();
    this._ctx.stroke();
  }
  getIndexPointByCoords(x, y) {
    const geAccessCellByRowAndCol = (x, y) => {
      if (this._mapCoords.map[x] && this._mapCoords.map[x][y] >= 0) {
        return [];
      }
      return false;
    };
    const top = geAccessCellByRowAndCol(x - 1, y);
    const right = geAccessCellByRowAndCol(x, y + 1);
    const bottom = geAccessCellByRowAndCol(x + 1, y);
    const left = geAccessCellByRowAndCol(x, y - 1);
    return [ top, right, bottom, left ];
  }
  initAllMapPoints() {
    this.loopMapTemplate(({ coords, value, index }) => this.mapAllPoints.push({ coords, value, index }));
  }
  initPortalCoords() {
    this.portalCoords = this.mapAllPoints
      .filter(({ value }) => value === MAP_STATUS.PORTAL)
      .map(({ coords: [ x, y ] }) => [x, this._cellWidth + x, y, this._cellWidth + y]);
  }
  initCoordsObstacle() {
    this.coordsObstacle = this.mapAllPoints
      .filter(({ value }) => value === MAP_STATUS.FIGURE)
      .map(({ coords: [ x, y ] }) => [x, this._cellWidth + x, y, this._cellWidth + y]);
  }
  initCoordsCoin() {
    this.coinCoords = this.mapAllPoints
      .filter(({ value }) => value === MAP_STATUS.COIN)
      .map(({ coords: [ x, y ] }) => [x, this._cellWidth + x, y, this._cellWidth + y]);
  }
  initCoordsCrossRoad() {
    const isWayCell = (value) => value === MAP_STATUS.COIN || value === MAP_STATUS.EMPTY;
    const getAccessPoint = (row, col) => {
      if (!this._mapTemplate[row] || this._mapTemplate[row][col] === undefined) return false;
      return isWayCell(this._mapTemplate[row][col]) ? this._mapTemplate[row][col] : false;
    };
    const isCrossRoad = (row, col) => ([
      getAccessPoint(row - 1, col),
      getAccessPoint(row, col + 1),
      getAccessPoint(row + 1, col),
      getAccessPoint(row, col - 1)
    ]);
    this.crossRoadCoords = this.mapAllPoints
      .map((point) => ({
        ...point,
        coordsRange: [
          point.coords[0], this._cellWidth + point.coords[0],
          point.coords[1], this._cellWidth + point.coords[1]],
        accessWays: isCrossRoad(point.index[0], point.index[1])
      }))
      .filter((point) => point.accessWays.filter((el) => el || el === 0).length >= 2);
  }
  loopMapTemplate(cb) {
    const rowLen = this._mapTemplate.length;
    const colLen = this._mapTemplate[0].length;
    for (let y = 0, row = 0; row < rowLen; y += this._cellWidth, row++) {
      for (let x = 0, col = 0; col < colLen; x += this._cellWidth, col++) {
        cb({
          value: this._mapTemplate[row][col],
          coords: [ x, y ],
          index: [ row, col ]
        });
      }
    }
  }
  renderMap() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.loopMapTemplate(({ coords: [ x, y ], value }) => this.renderFunctionsByKey[value](x, y));
  }
  render(cb) {
    this._ctx.strokeStyle = 'black';
    this.interval = setInterval(() => {
      this.renderMap();
      cb();
    }, this.timeUpdateMS);
  }
}
