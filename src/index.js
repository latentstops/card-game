import * as BABYLON from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/loaders';
import "@babylonjs/inspector";
import 'pepjs';

import { CardGame } from "./CardGame";

window.BABYLON = BABYLON;
window.cardGame = new CardGame({canvas: 'canvas'});