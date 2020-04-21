import {RobotController} from "./RobotController";
import {Test} from "./Test";
import {CardGameModels} from "./CardGameModels";
import {Paths} from "./Paths";

export class CardGame {

    async start(){
        await this.load();
        this.beforeRender();
        this.render();
        this.applyMotionBlurEffect();
        // this.downDebugLayerIfExists();
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
        // this.setupRobot();
        // this.setupTest();
        this.connectHandlers();
        // this.setupHakagaz();
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
        motionblur.motionStrength = 8;
        motionblur.motionBlurSamples = 12;
        this.motionblur = motionblur;
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
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    setupHakagaz(){
        const scene = this.scene;
        // Load the model
        BABYLON.SceneLoader.Append("https://www.babylonjs.com/Assets/FlightHelmet/glTF/", "FlightHelmet_Materials.gltf", scene, function (meshes) {
            // Create a camera pointing at your model.
            scene.createDefaultCameraOrLight(true, true, true);
            scene.activeCamera.useAutoRotationBehavior = true;
            scene.activeCamera.lowerRadiusLimit = 15;
            scene.activeCamera.upperRadiusLimit = 180;

            scene.activeCamera.alpha = 0.8;

            scene.lights[0].dispose();
            var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-2, -6, -2), scene);
            light.position = new BABYLON.Vector3(20, 60, 20);
            light.shadowMinZ = 30;
            light.shadowMaxZ = 180;
            light.intensity = 5;

            var generator = new BABYLON.ShadowGenerator(512, light);
            generator.useContactHardeningShadow = true;
            generator.bias = 0.01;
            generator.normalBias= 0.05;
            generator.contactHardeningLightSizeUVRatio = 0.08;

            for (var i = 0; i < scene.meshes.length; i++) {
                generator.addShadowCaster(scene.meshes[i]);
                scene.meshes[i].receiveShadows = true;
                if (scene.meshes[i].material && scene.meshes[i].material.bumpTexture) {
                    scene.meshes[i].material.bumpTexture.level = 2;
                }
            }

            var helper = scene.createDefaultEnvironment({
                skyboxSize: 1500,
                groundShadowLevel: 0.5,
            });

            helper.setMainColor(BABYLON.Color3.Gray());

            scene.environmentTexture.lodGenerationScale = 0.6;
        });

    }

    setupTest(){
        this.test = new Test(this);
    }

    setupRobot(){
        this.robotController = new RobotController(this);
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
        camera.radius = 67;
        // camera.lowerRadiusLimit = 2;
        // camera.upperRadiusLimit = 10;
        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 500;
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