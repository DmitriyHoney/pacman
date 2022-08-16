
import { MAP_STATUS } from './helpers/index.js';

export class EventEmitter {
  constructor() {
    this._events = {};
  }
  on(eventType, cb) {
    this._events[eventType] = cb;
  }
  emit(eventType, data) {
    if (!this._events[eventType]) {
      console.warn(`Event type ${eventType} does not defined`);
      return;
    }
    this._events[eventType](data);
  }
}

export class PlayerInterface extends EventEmitter {
  static CELL_SIZE = 20;
  constructor(canvas, ctx, { obstacle, portal, coin, map }, color = 'yellow') {
    super();
    this._canvas = canvas;
    this._ctx = ctx;
    this._mapCoords = { obstacle, portal, coin, map };
    this._diffCoords = { x: 2, y: 2 };
    this._style = { color, lineWidth: 1, radius: 7 };
    this._figureSize = this._style.radius + (this._style.lineWidth * 2);
    this._coords = { x: this._canvas.width / 2, y: 90 };
    this.movingInterval = undefined;
    this._moveHistory = [];
    this._historyKeyDown = undefined;
  }
  move(x, y) {
    this._coords = { x, y };
  }
  stopMoving() {
    this.clearMoveInterval();
    this.clearHistoryKeyDown();
  }
  clearMoveInterval() {
    if (this.moveInterval) clearInterval(this.moveInterval);
  }
  updateHistoryKeyDown(keyCode) {
    this._historyKeyDown = keyCode;
  }
  clearHistoryKeyDown() {
    this._historyKeyDown = undefined;
  }
  checkForCollision(x, y) {
    for (const [ x1, x2, y1, y2 ] of this._mapCoords.obstacle) {
      const checkX = x + this._figureSize >= x1 && x - this._figureSize <= x2;
      const checkY = y + this._figureSize >= y1 && y - this._figureSize <= y2;
      const checkXY = checkX && checkY;
      if (checkXY) return true;
    }
    return false;
  }
  checkCollisionDisplaySize(x, y) {
    const checkLimitDisplayX = x - this._figureSize < 0 || x + this._figureSize > this._canvas.width;
    const checkLimitDisplayY = y - this._figureSize < 0 || y + this._figureSize > this._canvas.height;
    const checkLimitDisplay = checkLimitDisplayX || checkLimitDisplayY;
    return checkLimitDisplay;
  }
  checkPlayerInsidePortal(x, y) {
    const checkPortal = (coords, limit, isLess = true) => {
      /*eslint-disable*/
      const [x1, x2, y1, y2] = coords;
      /*eslint-enable*/
      const checkPortalX = isLess ? x - this._figureSize < limit : x + this._figureSize > limit;
      const checkPortalY = y - this._figureSize < y2 && y + this._figureSize > y1;
      const checkPortalXY = checkPortalX && checkPortalY;
      return checkPortalXY;
    };
    if (this._mapCoords.portal.length) {
      const [ leftPortalCoords, rightPortal ] = this._mapCoords.portal;
      const checkLeftPortal = checkPortal(leftPortalCoords, leftPortalCoords[0]);
      const checkRightPortal = checkPortal(rightPortal, rightPortal[1], false);
      let newPlayerCoords = undefined;
      if (checkLeftPortal) {
        newPlayerCoords = [ rightPortal[0], rightPortal[2] + this._figureSize ];
      } else if (checkRightPortal) {
        newPlayerCoords = [ leftPortalCoords[1], leftPortalCoords[2] + this._figureSize ];
      }
      return checkLeftPortal || checkRightPortal ? newPlayerCoords : undefined;
    }
  }
  calcCoordsByKey(keyCode) {
    let x = this._coords.x;
    let y = this._coords.y;
    switch (keyCode) {
    case 'ArrowRight':
      x += this._diffCoords.x;
      break;
    case 'ArrowLeft':
      x -= this._diffCoords.x;
      break;
    case 'ArrowUp':
      y -= this._diffCoords.y;
      break;
    case 'ArrowDown':
      y += this._diffCoords.y;
      break;
    }
    return [x, y];
  }
  isNewWayAccess(keyCode) {
    const [x, y] = this.calcCoordsByKey(keyCode);
    return !this.checkForCollision(x, y);
  }
  updateMoveHistory(keyCode) {
    this._moveHistory.unshift(keyCode);
    this._moveHistory = this._moveHistory.slice(0, 2);
  }
  moveActionByKey(keyCode, cb) {
    return () => {
      const events = {};
      const moveActionWrap = () => {};
      moveActionWrap.on = (eventType, cb) => {
        events[eventType] = cb;
      };
      moveActionWrap.emit = (eventType) => {
        if (!events[eventType]) {
          console.warn(`eventType: ${eventType} does not exist`);
          return;
        }
        events[eventType]();
      };
      this.updateMoveHistory(keyCode);
      this.clearMoveInterval();
      this.moveInterval = setInterval(() => {
        if (this._historyKeyDown && this.isNewWayAccess(this._historyKeyDown)) {
          this.moveActionByKey(this._historyKeyDown, cb);
          this.clearHistoryKeyDown();
          return;
        }
        if (keyCode === 'Space') {
          this.stopMoving();
          return;
        }
        let [x, y] = this.calcCoordsByKey(keyCode);
        const newPortalCoords = this.checkPlayerInsidePortal(x, y);
        if (newPortalCoords) {
          x = newPortalCoords[0];
          y = newPortalCoords[1] + 1;
          this.move(x, y);
          return;
        }
        if (this.checkForCollision(x, y) || this.checkCollisionDisplaySize(x, y)) {
          this.stopMoving();
          moveActionWrap.emit('stopMoving');
          return;
        }
        cb(x, y);
        this.move(x, y);
      }, 20);
      return moveActionWrap;
    };
  }
  render() {
    const { color, radius, lineWidth } = this._style;
    const { x, y } = this._coords;
    this._ctx.beginPath();
    this._ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this._ctx.fillStyle = color;
    this._ctx.fill();
    this._ctx.lineWidth = lineWidth;
    this._ctx.stroke();
  }
}

export class Player extends PlayerInterface {
  static KEY_MOVING = [ 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Space' ];
  constructor(...args) {
    super(...args);
    this.score = 0;
    this.initHandleClickEvents();
  }
  incScore(incValue) {
    this.score += incValue;
  }
  initHandleClickEvents() {
    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
  }
  keyDownHandler(e) {
    if (!Player.KEY_MOVING.includes(e.code)) {
      console.warn(`Access keys for moving: ${Player.KEY_MOVING}`);
      return;
    }
    if (!this.isNewWayAccess(e.code)) {
      this.updateHistoryKeyDown(e.code);
      return;
    }
    this.moveActionByKey(e.code, (x, y) => {
      if (this.checkPlayerInsideCoin(x, y)) {
        this.emit('eatCoin', { x, y });
      }
    });
  }

  checkPlayerInsideCoin(x, y) {
    for (const [ x1, x2, y1, y2 ] of this._mapCoords.coin) {
      const checkX = x + this._figureSize >= x1 && x - this._figureSize <= x2;
      const checkY = y + this._figureSize >= y1 && y - this._figureSize <= y2;
      const checkXY = checkX && checkY;
      if (checkXY) return true;
    }
    return false;
  }
}


export class Hunter extends PlayerInterface {
  static KEY_MOVING = [ 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft' ];
  constructor(...args) {
    super(...args);
    this.initHunterMove();
    this._countRows = this._canvas.width / PlayerInterface.CELL_SIZE;
    this._countCols = this._canvas.height / PlayerInterface.CELL_SIZE;
  }
  initHunterMove() {
    this.getMapPointsByCurrentCords();
  }
  getMapRowColIndexByCoords(x, y) {
    return [
      Math.round(y / PlayerInterface.CELL_SIZE),
      Math.round(x / PlayerInterface.CELL_SIZE),
    ];
  }
  getVectorsByCurrentCoords(row, col) {
    const geAccessCellByRowAndCol = (r, c) => {
      if (this._mapCoords.map[r] && this._mapCoords.map[r][c] >= 0) {
        return [MAP_STATUS.FIGURE].includes(this._mapCoords.map[r][c]);
      }
      return false;
    };
    const top = geAccessCellByRowAndCol(row - 1, col);
    const right = geAccessCellByRowAndCol(row, col + 1);
    const bottom = geAccessCellByRowAndCol(row + 1, col);
    const left = geAccessCellByRowAndCol(row, col - 1);
    return [ top, right, bottom, left ];
  }
  getNewVectorWay([ top, right, bottom, left ], moveHistory) {
    const lastMoveHistory = moveHistory[0];
    const res = [
      { type: 'ArrowDown', value: bottom },
      { type: 'ArrowUp', value: top },
      { type: 'ArrowRight', value: right },
      { type: 'ArrowLeft', value: left },
    //  && keyMove.type !== lastMoveHistory
    ].filter((keyMove) => keyMove.value);
    return res[Math.floor(Math.random() * res.length)].type;
  }
  getMapPointsByCurrentCords() {
    const { x, y } = this._coords;
    const [ row, col ] = this.getMapRowColIndexByCoords(x, y);
    console.log(row, col);
    const [ topV, rightV, bottomV, leftV ] = this.getVectorsByCurrentCoords(row, col);
    const newVectorWay = this.getNewVectorWay([ topV, rightV, bottomV, leftV ], this._moveHistory);
    this.moveActionByKey(newVectorWay, () => {})()
      .on('stopMoving', () => {
        this.getMapPointsByCurrentCords();
      });
  }
  keyDownHandler(e) {
    if (!Player.KEY_MOVING.includes(e.code)) {
      console.warn(`Access keys for moving: ${Player.KEY_MOVING}`);
      return;
    }
    this.moveActionByKey(e.code, () => {});
  }
}
