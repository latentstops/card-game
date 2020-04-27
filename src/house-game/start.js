import * as BABYLON from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/loaders';
import 'pepjs';

window.BABYLON = BABYLON;

import { HouseGame } from "./HouseGame";

const houseGame = new HouseGame({ canvas: 'canvas' });
houseGame.start();