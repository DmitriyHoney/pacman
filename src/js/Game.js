import { Player } from './Player.js';
import { GameBoard } from './GameBoard.js';

export class Game {
  constructor(canvas, ctx) {
    this._board = new GameBoard(canvas, ctx);
    this._player = new Player(canvas, ctx, this._board.coordsObstacle, this._board.portalCoords);
    this._board.render(() => {
      this._player.render();
    });
  }
}
