export class Player {
  constructor(canvas, ctx, coordsObstacle = [], coordsPortal = []) {
    this.coordsObstacle = coordsObstacle;
    this.coordsPortal = coordsPortal;
    this._historyKeyDown = undefined;
    this._ctx = ctx;
    this._canvas = canvas;
    this._diffCoords = {
      x: 2,
      y: 2
    };
    this._coords = {
      x: this._canvas.width / 2,
      y: 90
    };
    this._style = {
      color: 'yellow',
      lineWidth: 1,
      radius: 7
    };
    this.KEY_MOVING = [
      'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Space'
    ];
    this.moveInterval = undefined;
    this._figureSize = this._style.radius + (this._style.lineWidth * 2)
    this.initHandleClickEvents();
  }
  initHandleClickEvents() {
    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
  }
  clearMoveInterval() {
    if (this.moveInterval) clearInterval(this.moveInterval);
  }
  stopMoving() {
    this.clearMoveInterval();
    this.clearHistoryKeyDown();
  }
  updateHistoryKeyDown(keyCode) {
    this._historyKeyDown = keyCode;
  }
  clearHistoryKeyDown() {
    this._historyKeyDown = undefined;
  }
  calculateNewCoordsByKeyCode(keyCode) {
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
    const [x, y] = this.calculateNewCoordsByKeyCode(keyCode);
    return !this.checkForCollision(x, y);
  }
  handleMoveClick(keyCode) {

    this.clearMoveInterval();
    this.moveInterval = setInterval(() => {
      if (this._historyKeyDown && this.isNewWayAccess(this._historyKeyDown)) {
        this.handleMoveClick(this._historyKeyDown);
        this.clearHistoryKeyDown();
        return;
      }
      if (keyCode === 'Space') {
        this.stopMoving();
        return;
      }
      let [x, y] = this.calculateNewCoordsByKeyCode(keyCode);
      const newPortalCoords = this.checkPlayerInsidePortal(x, y);
      if (newPortalCoords) {
        x = newPortalCoords[0];
        y = newPortalCoords[1] + 1;
        this.move(x, y);
        return;
      }
      if (this.checkForCollision(x, y) || this.checkCollisionDisplaySize(x, y)) {
        this.stopMoving();
        return;
      }
      this.move(x, y);
    }, 20);
  }
  keyDownHandler(e) {
    if (!this.KEY_MOVING.includes(e.code)) {
      console.warn(`Access keys for moving: ${this.KEY_MOVING}`);
      return;
    }
    if (!this.isNewWayAccess(e.code)) {
      this.updateHistoryKeyDown(e.code);
      return;
    };
    this.handleMoveClick(e.code);
  }
  move(x, y) {
    this._coords = { x, y };
  }
  checkPlayerInsidePortal(x, y) {
    const checkPortal = (coords, limit, isLess = true) => {
      const [x1, x2, y1, y2] = coords;
      const checkPortalX = isLess ? x - this._figureSize < limit : x + this._figureSize > limit;
      const checkPortalY = y - this._figureSize < y2 && y + this._figureSize > y1;
      const checkPortalXY = checkPortalX && checkPortalY;
      return checkPortalXY;
    };
    if (this.coordsPortal.length) {
      const [ leftPortalCoords, rightPortal ] = this.coordsPortal;
      const checkLeftPortal = checkPortal(leftPortalCoords, leftPortalCoords[0]);
      const checkRightPortal = checkPortal(rightPortal, rightPortal[1], false);
      let newPlayerCoords = undefined;
      if (checkLeftPortal) {
        newPlayerCoords = [ rightPortal[0], rightPortal[2] + this._figureSize ]
      } else if (checkRightPortal) {
        newPlayerCoords = [ leftPortalCoords[1], leftPortalCoords[2] + this._figureSize ]
      }
      return checkLeftPortal || checkRightPortal ? newPlayerCoords : undefined;
    }
  }
  checkCollisionDisplaySize(x, y) {
    const checkLimitDisplayX = x - this._figureSize < 0 || x + this._figureSize > this._canvas.width;
    const checkLimitDisplayY = y - this._figureSize < 0 || y + this._figureSize > this._canvas.height;
    const checkLimitDisplay = checkLimitDisplayX || checkLimitDisplayY;
    return checkLimitDisplay;
  }
  checkForCollision(x, y) {
    for (const [ x1, x2, y1, y2 ] of this.coordsObstacle) {
      const checkX = x + this._figureSize >= x1 && x - this._figureSize <= x2;
      const checkY = y + this._figureSize >= y1 && y - this._figureSize <= y2;
      const checkXY = checkX && checkY;
      if (checkXY) return true;
    }
    return false;
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
