import { AsyncLoader } from "./depth";

export class Robot extends AsyncLoader {
    constructor( root ){
        super( root );
        this.root = root;
        this.scene = root.scene;
        this.engine = root.engine;
    }

    idle(){
        this.playAnimation( 'idle' );
    }

    walk(){
        this.playAnimation( 'walk' );
    }

    run(){
        this.positionAnimation();
        this.playAnimation( 'run' );
    }

    left(){
        this.playAnimation( 'left' );
    }

    right(){
        this.playAnimation( 'right' );
    }

    positionAnimation(){
        const mesh = this.mesh;
        const posZ = mesh.position.z;
        const cardRotateAnimation = new BABYLON.Animation(
            "forward",
            "position.z",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        cardRotateAnimation.setKeys( [
            {
                frame: 0,
                value: posZ
            },
            {
                frame: 100,
                value: posZ + 10
            }
        ] );

        this.animRotateToFront = cardRotateAnimation;
    }

    playAnimation( type ){
        const scene = this.scene;
        const skeleton = this.skeleton;
        const animations = this.animations;
        const animationType = `${ type }Range`;
        const animation = animations[ animationType ];

        scene.beginAnimation( skeleton, animation.from, animation.to, true );
    }

    async load(){
        const engine = this.engine;
        const scene = this.scene;

        engine.enableOfflineSupport = false;

        // This is really important to tell Babylon.js to use decomposeLerp and matrix interpolation
        BABYLON.Animation.AllowMatricesInterpolation = true;


        const light = new BABYLON.HemisphericLight( "light1", new BABYLON.Vector3( 0, 1, 0 ), scene );
        light.intensity = 0.6;
        light.specular = BABYLON.Color3.Black();

        const light2 = new BABYLON.DirectionalLight( "dir01", new BABYLON.Vector3( 0, -0.5, -1.0 ), scene );
        light2.position = new BABYLON.Vector3( 0, 5, 5 );

        // Shadows
        const shadowGenerator = new BABYLON.ShadowGenerator( 1024, light2 );
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 1024;

        engine.displayLoadingUI();

        const [meshes, particleSystems, skeletons] = await this.importMeshAsync( 'dummy3.babylon' );

        const mesh = meshes[ 0 ];
        const skeleton = skeletons[ 0 ];

        this.meshes = meshes;
        this.mesh = mesh;
        this.skeletons = skeletons;
        this.skeleton = skeleton;

        shadowGenerator.addShadowCaster( scene.meshes[ 0 ], true );

        for ( let index = 0; index < meshes.length; index++ ) {
            meshes[ index ].receiveShadows = false;
        }

        const helper = scene.createDefaultEnvironment( {
            enableGroundShadow: true
        } );
        helper.setMainColor( BABYLON.Color3.Gray() );
        helper.ground.position.y = 0;

        // ROBOT
        skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        skeleton.animationPropertiesOverride.enableBlending = true;
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton.animationPropertiesOverride.loopMode = 1;

        const idleRange = skeleton.getAnimationRange( "YBot_Idle" );
        const walkRange = skeleton.getAnimationRange( "YBot_Walk" );
        const runRange = skeleton.getAnimationRange( "YBot_Run" );
        const leftRange = skeleton.getAnimationRange( "YBot_LeftStrafeWalk" );
        const rightRange = skeleton.getAnimationRange( "YBot_RightStrafeWalk" );

        this.animations = {
            idleRange,
            walkRange,
            runRange,
            leftRange,
            rightRange,
        };

        // IDLE
        if ( idleRange ) scene.beginAnimation( skeleton, idleRange.from, idleRange.to, true );

        /* // UI
         const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
         const UiPanel = new BABYLON.GUI.StackPanel();
         UiPanel.width = "220px";
         UiPanel.fontSize = "14px";
         UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
         UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
         advancedTexture.addControl(UiPanel);
         // ..
         const button = BABYLON.GUI.Button.CreateSimpleButton("but1", "Play Idle");
         button.paddingTop = "10px";
         button.width = "100px";
         button.height = "50px";
         button.color = "white";
         button.background = "green";
         button.onPointerDownObservable.add(()=> {
             if (idleRange) scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);
         });
         UiPanel.addControl(button);
         // ..
         const button1 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Play Walk");
         button1.paddingTop = "10px";
         button1.width = "100px";
         button1.height = "50px";
         button1.color = "white";
         button1.background = "green";
         button1.onPointerDownObservable.add(()=> {
             if (walkRange) scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
         });
         UiPanel.addControl(button1);
         // ..
         const button1 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Play Run");
         button1.paddingTop = "10px";
         button1.width = "100px";
         button1.height = "50px";
         button1.color = "white";
         button1.background = "green";
         button1.onPointerDownObservable.add(()=> {
             if (runRange) scene.beginAnimation(skeleton, runRange.from, runRange.to, true);
         });
         UiPanel.addControl(button1);
         // ..
         const button1 = BABYLON.GUI.Button.CreateSimpleButton("but4", "Play Left");
         button1.paddingTop = "10px";
         button1.width = "100px";
         button1.height = "50px";
         button1.color = "white";
         button1.background = "green";
         button1.onPointerDownObservable.add(()=> {
             if (leftRange) scene.beginAnimation(skeleton, leftRange.from, leftRange.to, true);
         });
         UiPanel.addControl(button1);
         // ..
         const button1 = BABYLON.GUI.Button.CreateSimpleButton("but5", "Play Right");
         button1.paddingTop = "10px";
         button1.width = "100px";
         button1.height = "50px";
         button1.color = "white";
         button1.background = "green";
         button1.onPointerDownObservable.add(()=> {
             if (rightRange) scene.beginAnimation(skeleton, rightRange.from, rightRange.to, true);
         });
         UiPanel.addControl(button1);
         // ..
         const button1 = BABYLON.GUI.Button.CreateSimpleButton("but6", "Play Blend");
         button1.paddingTop = "10px";
         button1.width = "100px";
         button1.height = "50px";
         button1.color = "white";
         button1.background = "green";
         button1.onPointerDownObservable.add(()=> {
             if (walkRange && leftRange) {
                 scene.stopAnimation(skeleton);
                 const walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 0.5, true);
                 const leftAnim = scene.beginWeightedAnimation(skeleton, leftRange.from, leftRange.to, 0.5, true);

                 // Note: Sync Speed Ratio With Master Walk Animation
                 walkAnim.syncWith(null);
                 leftAnim.syncWith(walkAnim);
             }
         });
         UiPanel.addControl(button1);*/
        engine.hideLoadingUI();
    }


}