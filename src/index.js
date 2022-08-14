import { Game } from './js/Game.js';
import { mapTemplate } from './js/helpers/index.js';

const canvas = document.getElementById('pacman-board');
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx, mapTemplate);

window.game = game;
