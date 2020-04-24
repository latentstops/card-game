import {CardGameModels} from "./CardGameModels";
import {Paths} from "./Paths";
import {Card} from "./Card";

export class CardGame {

    async start(){
        await this.load();
        this.beforeRender();
        this.render();
        // this.applyMotionBlurEffect();
        this.downDebugLayerIfExists();
        this.setupCard();
    }

    async load(){
        this.engine.displayLoadingUI();
        await this.models.load();
        this.engine.hideLoadingUI();
    }

    constructor(config) {
        this.config = config;
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;

        this.setup();
    }

    setup() {
        this.setupCanvas();
        this.setupEngine();
        this.setupScene();
        this.setupCamera();
        this.connectHandlers();
        this.setupGameModels();
    }

    render(){
        const engine = this.engine;
        const scene = this.scene;
        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    beforeRender(){
        const scene = this.scene;
        const camera = this.camera;
        const defaultLight = scene.getLightByID("default light");
        console.log(defaultLight);
        scene.registerBeforeRender(function () {
            defaultLight.position = camera.position;
        });
    }

    applyMotionBlurEffect(){
        const scene = this.scene;
        const camera = this.camera;
        const motionblur = new BABYLON.MotionBlurPostProcess(
            "mb", // The name of the effect.
            scene, // The scene containing the objects to blur according to their velocity.
            1.0, // The required width/height ratio to downsize to before computing the render pass.
            camera // The camera to apply the render pass to.
        );
        motionblur.motionStrength = 10;
        motionblur.motionBlurSamples = 32;
        this.motionblur = motionblur;
    }

    setupCard(){
        this.card = new Card(this);
    }

    setupGameModels(){
        this.paths = new Paths();
        this.models = new CardGameModels(this);
    };

    downDebugLayerIfExists(){
        const scene = this.scene;
        if(!scene.debugLayer) return;

        scene.debugLayer.show();
    }

    connectHandlers(){
        const scene = this.scene;
        const engine = this.engine;

        window.addEventListener('resize', () => {
            engine.resize();
        });

        let startingPoint = null;
        scene.onPointerObservable.add(({event, pickInfo, type}) => {
            const rightClick = event.which === 3;
            switch (type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:

                    if( pickInfo.hit && pickInfo.pickedMesh === this.ground ) return;

                    if (pickInfo.hit && rightClick) {
                        this.card.flip(pickInfo.pickedMesh);
                        setTimeout(() => {
                            this.deActivateCameraControls();
                        }, 0);
                        return;
                    }

                    startingPoint = getGroundPosition();

                    if (startingPoint) {
                        setTimeout(() => {
                            this.deActivateCameraControls();
                        }, 0);
                    }
                    if (pickInfo.hit && pickInfo.pickedMesh !== this.ground) {
                        this.pickedMesh = pickInfo.pickedMesh;
                        // this.parent.deActivateCameraControls();
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    setTimeout(() => {
                        this.activateCameraControls();
                    }, 0);
                    if (startingPoint) {

                        this.pickedMesh = null;
                        startingPoint = null;
                        return;
                    }

                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if (!startingPoint) {
                        return;
                    }

                    const current = getGroundPosition();

                    if (!current) {
                        return;
                    }

                    /**
                     * The most interesting part
                     * @type {Vector3}
                     */
                    const diff = current.subtract(startingPoint);
                    this.pickedMesh.position.addInPlace(diff);

                    startingPoint = current;

                    break;
                case BABYLON.PointerEventTypes.POINTERWHEEL:
                    // console.log("POINTER WHEEL");
                    break;
                case BABYLON.PointerEventTypes.POINTERPICK:
                    // console.log("POINTER PICK");
                    break;
                case BABYLON.PointerEventTypes.POINTERTAP:
                    // console.log("POINTER TAP");
                    break;
                case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                    // console.log("POINTER DOUNBLE TAP");
                    this.card.flip(pickInfo.pickedMesh);
                    break;
            }
        });

        const getGroundPosition = () => {
            const pickinfo = scene.pick(scene.pointerX, scene.pointerY, mesh=>  mesh === this.ground );
            if (pickinfo.hit) {
                return pickinfo.pickedPoint;
            }

            return null;
        }
    }

    setupCamera() {
        this.setupArcRotateCamera();
        this.activateCameraControls();
        // this.deActivateCameraControls();
        // this.setupUniversalCamera();
    }

    setupUniversalCamera() {
        const canvas = this.canvas;
        const scene = this.scene;
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), scene);

        camera.setTarget(BABYLON.Vector3.Zero());

        camera.attachControl(canvas, false);

        this.camera = camera;
    }

    setupArcRotateCamera() {
        const scene = this.scene;
        scene.createDefaultCameraOrLight(true, true, true);
        const camera = scene.activeCamera;
        camera.radius = 300;
        // camera.lowerRadiusLimit = 2;
        // camera.upperRadiusLimit = 10;
        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 250;
        camera.wheelDeltaPercentage = 0.01;
        camera.autoRotation = false;
        camera.beta = Math.PI / 4;
        camera.alpha = -Math.PI / 2;
        camera.useAutoRotationBehavior = false;

        this.camera = camera;
    }

    activateCameraControls(){
        const { camera, canvas } = this;

        camera.attachControl(canvas, true);
    }
    deActivateCameraControls(){
        const { camera, canvas } = this;

        camera.detachControl(canvas);
    }

    setupScene() {
        const engine = this.engine;
        const scene = new BABYLON.Scene(engine);

        this.scene = scene;
    }

    setupEngine() {
        const canvas = this.canvas;
        const engine = new BABYLON.Engine(canvas, true);

        this.engine = engine;
    }

    setupCanvas() {
        const HTMLCanvasElement = window.HTMLCanvasElement;
        const config = this.config;
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
}