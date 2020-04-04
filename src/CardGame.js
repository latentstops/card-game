export class CardGame {
    constructor(config) {
        this.config = config;
        this.init();
    }

    construct() {
        this.config = {};
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
    }

    init() {
        this.initCanvas();
        this.initEngine();
        this.initScene();
        this.initCamera();
        this.connectHandlers();
        this.fillScene();
    }

    fillScene(){
        const scene = this.scene;
        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments:16, diameter:2}, scene);

        // Move the sphere upward 1/2 of its height.
        sphere.position.y = 1;

        const ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:6, width:6, subdivisions: 2}, scene);
    }


    connectHandlers(){
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    initCamera() {
        const canvas = this.canvas;
        const scene = this.scene;
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), scene);

        // Target the camera to scene origin.
        camera.setTarget(BABYLON.Vector3.Zero());

        camera.attachControl(canvas, false);

        this.camera = camera;
    }

    initScene() {
        const engine = this.engine;
        const scene = new BABYLON.Scene(engine);

        this.scene = scene;
    }

    initEngine() {
        const canvas = this.canvas;
        const engine = new BABYLON.Engine(canvas, true);

        this.engine = engine;
    }

    initCanvas() {
        const config = this.config;
        const HTMLCanvasElement = window.HTMLCanvasElement;
        const configCanvas = config.canvas;
        const configCanvasIsCanvasElement = configCanvas instanceof HTMLCanvasElement;
        const canvasIsString = typeof configCanvas === 'string';

        let canvas = null;

        if (configCanvasIsCanvasElement) {
            canvas = configCanvas;
        } else if (canvasIsString) {
            canvas = document.querySelector(configCanvas) ||
                document.getElementById(configCanvas) ||
                document.createElement('canvas')
            ;
        }
        this.canvas = canvas;
    }



    render(){
        const engine = this.engine;
        const scene = this.scene;
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}