import { deepAssign } from "./utils";

export class Game {

    constructor(config){
        this.config = config;
        this.setup();
    }


    async start(){
        await this.callChildLoadMethod();
        this.beforeRender();
        this.render();
        // this.applyMotionBlurEffect();
        // this.showDebugLayerIfExists();
    }

    /**
     * TODO improve abstract methods call
     * @returns {Promise<void>}
     */
    async callChildLoadMethod(){
        const engine = this.engine;

        engine.displayLoadingUI();

        this.callChildMethod('beforeLoad');
        await this.callChildMethodAsync('load');
        this.callChildMethod('afterLoad');

        engine.hideLoadingUI();
    }

    async callChildMethodAsync( method, args ){
        await  this.callChildMethod( method, args );
    }


    callChildMethod( method, args ){
        const func = this[method];

        if( typeof func !== "function") return;

        return func.apply( this, args );
    }

    render(){
        const engine = this.engine;
        const scene = this.scene;
        engine.runRenderLoop( () => {
            scene.render();
        } );
    }

    beforeRender(){
        const scene = this.scene;
        const camera = this.camera;
        const defaultLight = scene.getLightByID( "default light" );
        scene.registerBeforeRender( function(){
            defaultLight.position = camera.position;
        } );
    }

    setup(){
        this.setupCanvas();
        this.setupEngine();
        this.setupScene();
        this.setupCamera();
    }

    applyMotionBlurEffect(){
        const scene = this.scene;
        const camera = this.camera;
        const motionblur = new BABYLON.MotionBlurPostProcess( "mb", scene, 1.0, camera );

        deepAssign( motionblur, {
            motionStrength: 8,
            motionBlurSamples: 12,
        } );

        this.motionblur = motionblur;
    }

    showDebugLayerIfExists(){
        const scene = this.scene;

        if ( !scene.debugLayer ) return;

        scene.debugLayer.show();
    }

    resizeEngineOnWindowResize(){
        const engine = this.engine;

        window.addEventListener( 'resize', () => {
            engine.resize();
        } );
    }

    setupCamera(){
        this.setupArcRotateCamera();
        this.activateCameraControls();
        // this.deActivateCameraControls();
        // this.setupUniversalCamera();
    }

    setupUniversalCamera(){
        const canvas = this.canvas;
        const scene = this.scene;
        const camera = new BABYLON.FreeCamera( 'camera', new BABYLON.Vector3( 0, 5, -10 ), scene );

        camera.setTarget( BABYLON.Vector3.Zero() );

        camera.attachControl( canvas, false );

        this.camera = camera;
    }

    setupArcRotateCamera(){
        const scene = this.scene;

        scene.createDefaultCameraOrLight( true, true, true );

        const camera = scene.activeCamera;

        deepAssign( camera, {
            radius: 300,
            lowerRadiusLimit: 15,
            upperRadiusLimit: 250,
            wheelDeltaPercentage: 0.01,
            autoRotation: false,
            beta: Math.PI / 4,
            alpha: -Math.PI / 2,
            minZ: 1,
            useAutoRotationBehavior: false
        } );

        this.camera = camera;
    }

    activateCameraControls(){
        const { camera, canvas } = this;

        camera.attachControl( canvas, true );
    }

    deActivateCameraControls(){
        const { camera, canvas } = this;

        camera.detachControl( canvas );
    }

    setupScene(){
        const engine = this.engine;
        const scene = new BABYLON.Scene( engine );

        this.scene = scene;
    }

    setupEngine(){
        const canvas = this.canvas;
        const engine = new BABYLON.Engine( canvas, true );

        this.engine = engine;
    }

    setupCanvas(){
        const HTMLCanvasElement = window.HTMLCanvasElement;
        const config = this.config;
        const configCanvas = config.canvas;
        const configCanvasIsCanvasElement = configCanvas instanceof HTMLCanvasElement;
        const canvasIsString = typeof configCanvas === 'string';

        let canvas = null;

        if ( configCanvasIsCanvasElement ) {
            canvas = configCanvas;
        } else if ( canvasIsString ) {
            canvas = document.querySelector( configCanvas ) ||
                document.getElementById( configCanvas ) ||
                document.createElement( 'canvas' )
            ;
        }
        this.canvas = canvas;
    }
}