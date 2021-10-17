import * as BABYLON from '@babylonjs/core';
import * as CANNON from 'cannon';

import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/loaders';
import 'pepjs';

window.BABYLON = BABYLON;
window.CANNON = CANNON;

import { SpiderLabyrinthShooter } from './SpiderLabyrinthShooter';

const spiderGame = new SpiderLabyrinthShooter({ canvas: 'canvas', cameraType: 'uni' } );

spiderGame.start().then( console.log );

window.game = spiderGame;