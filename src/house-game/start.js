import * as BABYLON from '@babylonjs/core';
import * as CANNON from 'cannon';

import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/loaders';
import 'pepjs';

window.BABYLON = BABYLON;
window.CANNON = CANNON;

import { HouseGame } from "./HouseGame";

const houseGame = new HouseGame({ canvas: 'canvas' });

houseGame.start();

window.game = houseGame;