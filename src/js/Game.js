import { Player, Hunter } from './Player.js';
import { GameBoard } from './GameBoard.js';
import { MAP_STATUS } from './helpers/index.js';

export class Game {
  constructor(canvas, ctx, mapTemplate) {
    this._coinPrice = 10;
    this._mapTemplate = mapTemplate;
    this._board = new GameBoard(canvas, ctx, this._mapTemplate);

    const { crossRoadCoords, coordsObstacle, portalCoords, coinCoords, _cellWidth } = this._board;
    this._player = new Player(
      canvas,
      ctx, {
        obstacle: coordsObstacle,
        portal: portalCoords,
        coin: coinCoords,
        map: mapTemplate
      }
    );

    this._hunter1 = new Hunter(
      canvas,
      ctx, {
        obstacle: coordsObstacle,
        portal: portalCoords,
        coin: coinCoords,
        map: mapTemplate,
        crossRoad: crossRoadCoords
      },
      'green'
    );

    this._player.on('eatCoin', ({ x, y }) => {
      const rowIdx = Math.floor(y / _cellWidth);
      const colIdx = Math.floor(x / _cellWidth);
      if (this._mapTemplate[rowIdx][colIdx] === MAP_STATUS.COIN) {
        this._mapTemplate[rowIdx][colIdx] = MAP_STATUS.EMPTY;
        this._player.incScore(this._coinPrice);
      }
    });

    this._board.render(() => {
      this._player.render();
      this._hunter1.render();
    });
  }
}
