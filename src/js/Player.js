export class Player {
  constructor(canvas, ctx) {
    this._ctx = ctx;
    this._canvas = canvas;
    this._diffCoords = {
      x: 2,
      y: 2
    };
    this._coords = {
      x: this._canvas.width / 2,
      y: 95
    };
    this._style = {
      color: 'yellow',
      lineWidth: 1,
      radius: 12
    };
    this.KEY_MOVING = [
      'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Space'
    ];
    this.moveInterval = undefined;
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
  }
  keyDownHandler(e) {
    if (!this.KEY_MOVING.includes(e.code)) {
      console.warn(`Access keys for moving: ${this.KEY_MOVING}`);
      return;
    }
    this.clearMoveInterval();
    this.moveInterval = setInterval(() => {
      let x = this._coords.x;
      let y = this._coords.y;
      switch (e.code) {
      case 'Space':
        this.stopMoving();
        break;
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
      this.moveAndCheckCollision(x, y);
    }, 20);
  }
  moveAndCheckCollision(x, y) {
    if (this.checkForCollision()) {
      this.stopMoving();
      // return;
    }
    this._coords = { x, y };
  }
  checkForCollision() {
    // Перебираем все пиксели лабиринта и инвертируем их цвет
    const { x, y } = this._coords;
    const imgData = this._ctx.getImageData(x - 1, y - 1, 15 + 2, 15 + 2);
    const pixels = imgData.data;

    // Получаем данные для одного пикселя
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];
      // const alpha = pixels[i + 3];
      // Смотрим на наличие черного цвета стены,
      // что указывает на столкновение
      if (red > 30 && green > 30 && blue > 30) {
        return true;
      }
      // Смотрим на наличие серого цвета краев,
      // что указывает на столкновение
      // if (red === 169 && green === 169 && blue === 169) {
      //   return true;
      // }
    }
    // Столкновения не было
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
    this._ctx.strokeStyle = color;
    this._ctx.stroke();
  }
}
