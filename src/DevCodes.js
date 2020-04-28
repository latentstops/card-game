import { Test } from "./test/Test";
import { RobotController } from "./robot/RobotController";

export class DevCodes {
    constructor( game ){
        this.parent = game;
    }

    setupTest(){
        this.test = new Test( this );
    }

    setupRobot(){
        this.robotController = new RobotController( this );
    }

    playWithAnimations(){
        const game = cardGame;
        const scene = cardGame.scene;
        const tableMeshes = game.models.tableMeshes;
        const hasAnimations = mesh => Boolean( mesh.animations.length );
        const animatedMesh = tableMeshes.find( hasAnimations );
        const playAnimation = () => scene.beginAnimation( animatedMesh );
        let requestAnimationFrameId = null;
        const animate = () => {
            requestAnimationFrameId = requestAnimationFrame( animate );
            playAnimation();
        };
        const cancelAnimation = () => cancelAnimationFrame( requestAnimationFrameId );
        const animateAndCancelAfterMs = ( ms = 1000 ) => ( animate(), setTimeout( cancelAnimation, ms ) );

        //animateAndCancelAfterMs();

        // const cardMeshNames = tableMeshes.map( mesh => mesh.name ).filter( name => name.toLowerCase().includes('card') );
        // const cardMeshes = tableMeshes.filter( mesh => cardMeshNames.includes(mesh.name) );
        // const visibleCardMeshes = cardMeshes.filter( m => m.isVisible );
        const cardFirstShoe = tableMeshes.find( m => m.name === 'card_firstshoe' );
        const card = cardFirstShoe;
    }

    setupHakagaz(){
        const scene = this.scene;
        // Load the model
        BABYLON.SceneLoader.Append( "https://www.babylonjs.com/Assets/FlightHelmet/glTF/", "FlightHelmet_Materials.gltf", scene, function( meshes ){
            // Create a camera pointing at your model.
            scene.createDefaultCameraOrLight( true, true, true );
            scene.activeCamera.useAutoRotationBehavior = true;
            scene.activeCamera.lowerRadiusLimit = 15;
            scene.activeCamera.upperRadiusLimit = 180;

            scene.activeCamera.alpha = 0.8;

            scene.lights[ 0 ].dispose();
            var light = new BABYLON.DirectionalLight( "light1", new BABYLON.Vector3( -2, -6, -2 ), scene );
            light.position = new BABYLON.Vector3( 20, 60, 20 );
            light.shadowMinZ = 30;
            light.shadowMaxZ = 180;
            light.intensity = 5;

            var generator = new BABYLON.ShadowGenerator( 512, light );
            generator.useContactHardeningShadow = true;
            generator.bias = 0.01;
            generator.normalBias = 0.05;
            generator.contactHardeningLightSizeUVRatio = 0.08;

            for ( var i = 0; i < scene.meshes.length; i++ ) {
                generator.addShadowCaster( scene.meshes[ i ] );
                scene.meshes[ i ].receiveShadows = true;
                if ( scene.meshes[ i ].material && scene.meshes[ i ].material.bumpTexture ) {
                    scene.meshes[ i ].material.bumpTexture.level = 2;
                }
            }

            var helper = scene.createDefaultEnvironment( {
                skyboxSize: 1500,
                groundShadowLevel: 0.5,
            } );

            helper.setMainColor( BABYLON.Color3.Gray() );

            scene.environmentTexture.lodGenerationScale = 0.6;
        } );

    }

}