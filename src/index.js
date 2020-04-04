import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import 'pepjs';

import { CardGame } from "./CardGame";

window.BABYLON = BABYLON;
window.cardGame = new CardGame({canvas: 'canvas'});