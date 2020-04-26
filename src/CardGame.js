import { deepAssign } from "./utils";
import { CardGameModels } from "./CardGameModels";
import { Paths } from "./Paths";
import { Card } from "./Card";

export class CardGame {

    async start(){
        await this.load();
        this.beforeRender();
        this.render();
        // this.applyMotionBlurEffect();
        // this.showDebugLayerIfExists();
        this.setupCard();
    }

    async load(){
        const engine = this.engine;
        const models = this.models;

        engine.displayLoadingUI();
        await models.load();
        engine.hideLoadingUI();
    }

    constructor( config ){
        this.config = config;
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;

        this.setup();
    }

    setup(){
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

    setupCard(){
        this.card = new Card( this );
    }

    setupGameModels(){
        this.paths = new Paths();
        this.models = new CardGameModels( this );
    };

    showDebugLayerIfExists(){
        const scene = this.scene;

        if ( !scene.debugLayer ) return;

        scene.debugLayer.show();
    }

    connectHandlers(){
        this.resizeEngineOnWindowResize();
        this.pickCardOnPointerEvents();
    }

    pickCardOnPointerEvents(){
        const scene = this.scene;

        let startingPoint = null;

        scene.onPointerObservable.add( ( { event, pickInfo, type } ) => {
            const card = this.card;
            const ground = this.models.ground;

            const rightClick = event.which === 3;
            const hit = pickInfo.hit;
            const pickedMeshIsGround = pickInfo.pickedMesh === ground;

            switch ( type ) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if ( !hit || pickedMeshIsGround ) return;

                    if ( rightClick ) {
                        card.flip( pickInfo.pickedMesh );
                        this.deActivateCameraControls();
                        return;
                    }

                    startingPoint = getGroundPosition();

                    if ( startingPoint ) {
                        this.deActivateCameraControls();
                        this.pickedMesh = pickInfo.pickedMesh;
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    this.activateCameraControls();

                    if ( startingPoint ) {
                        this.pickedMesh = null;
                        startingPoint = null;
                        return;
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if ( !startingPoint ) return;

                    const current = getGroundPosition();

                    if ( !current ) return;

                    /**
                     * The most interesting part
                     * @type {Vector3}
                     */
                    const diff = current.subtract( startingPoint );

                    this.pickedMesh.position.addInPlace( diff );

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
                    this.card.flip( pickInfo.pickedMesh );
                    break;
            }
        } );

        const getGroundPosition = () => {
            const ground = this.models.ground;
            const pickInfo = scene.pick( scene.pointerX, scene.pointerY, mesh => mesh === ground );

            if ( pickInfo.hit ) {
                return pickInfo.pickedPoint;
            }

            return null;
        }
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