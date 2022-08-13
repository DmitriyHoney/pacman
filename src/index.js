import { Game } from './js/Game.js';

const canvas = document.getElementById('pacman-board');
const ctx = canvas.getContext('2d');

new Game(canvas, ctx);
