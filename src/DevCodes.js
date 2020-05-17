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

    circleEquation(){
        var card = cardGame.card;

        cardGame.cardGroupsController.setCardsInGroup( card.clone(), 1 );
        cardGame.cardGroupsController.setCardsInGroup( card.clone(), 2 );
        cardGame.cardGroupsController.setCardsInGroup( card.clone(), 3 );
        cardGame.cardGroupsController.setCardsInGroup( card.clone(), 4 );
        cardGame.cardGroupsController.setCardsInGroup( card.clone(), 5 );

        // var r1 = 50;
        // var r2 = 75;
        // var interval = 20;
        // var step = 0.4;
        // var start = 0;

        // var positions = [
        //     createPos(cardGame.cardGroupsController.groups[1],  2 * (Math.PI / 5) ),
        //     createPos(cardGame.cardGroupsController.groups[2],  1 * (Math.PI / 5) ),
        //     createPos(cardGame.cardGroupsController.groups[3],  0 * (Math.PI / 5) ),
        //     createPos(cardGame.cardGroupsController.groups[4],  -1 * (Math.PI / 5) ),
        //     createPos(cardGame.cardGroupsController.groups[5],  -2 * (Math.PI / 5) ),
        // ]

        // function createPos(group, angle){
        //     var groupNode = group.node;
        //     var z = r1 * Math.cos( angle );
        //     var x = r2 * Math.sin( angle );
        //     var pos = { x, z, y: 112 };
        //     Object.assign(groupNode.position,pos);

        //     return pos;
        // };
    }

}