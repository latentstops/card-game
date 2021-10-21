import { CardAtlas } from "./CardAtlas";

export class Card {

    clone(){
        const card = new Card( this.root );
        return card;
    }

    constructor( root ){
        this.root = root;
        this.scene = root.scene;
        this.camera = root.camera;
        this.paths = root.paths;
        this.setup();
    }

    setup(){
        this.setupCardAtlas();
        this.setupMaterialOrigin();
        this.setupMeshes();
        this.setupPosition();
        this.setFaceTo( 'qk' );
        this.setBack();
        this.setupAnimations();
    }

    flip( card = this.cardFace ){
        this.setCardAnimations( card );
        this.playAnimation( card );
        this.flipCardIsRotatedFlag( card );
    }

    flipCardIsRotatedFlag( card = this.cardFace ){
        card.isRotated = !card.isRotated;
    }

    setCardAnimations( card = this.cardFace ){
        const toBack = this.animRotateToBack;
        const toFront = this.animRotateToFront;

        card.animations = card.isRotated ? [ toFront ] : [ toBack ];
    }

    playAnimation( card = this.cardFace ){
        const scene = this.scene;
        scene.beginAnimation( card, 0, 10, true );
    }

    stopAnimation( card = this.cardFace ){
        const scene = this.scene;
        scene.stopAnimation( card );
    }

    setupAnimations(){
        this.rotationToBack();
        this.rotationToFront();
    }


    rotationToFront(){
        const cardRotateAnimation = new BABYLON.Animation(
            "rotateToFront",
            "rotation.x",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        cardRotateAnimation.setKeys( [
            {
                frame: 0,
                value: Math.PI / 2
            },
            {
                frame: 10,
                value: -Math.PI / 2
            }
        ] );

        this.animRotateToFront = cardRotateAnimation;
    }

    rotationToBack(){
        const cardRotateAnimation = new BABYLON.Animation(
            "rotateToBack",
            "rotation.x",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        cardRotateAnimation.setKeys( [
            {
                frame: 0,
                value: 0
            },
            {
                frame: 10,
                value: Math.PI / 2
            }
        ] );

        this.animRotateToBack = cardRotateAnimation;
    }

    setBack(name = 'backside'){
        const material = this.material;
        const cardBack = this.cardBack;

        if(!cardBack) return;
    
        const backSideTexture = this.atlas.getBackSide();

        material.diffuseTexture = backSideTexture;

        cardBack.material = material;
    }

    setFaceTo( name ){
        this.name = name;
        const material = this.material;
        const mesh = this.cardFace;

        if(!mesh) return;

        const texture = this.atlas.getTextureByCardName( name );

        material.diffuseTexture = texture;

        mesh.material = material;
    }

    setupPosition(){
        const cardFace = this.cardFace;
        if(!cardFace) return;
        this.position = cardFace.position;
    }

    setupMaterialOrigin(){
        const scene = this.scene;
        this.materialOrigin = new BABYLON.StandardMaterial( "cardMaterial", scene );
    }

    setupMeshes(){
        const cardMeshes = this.root.models.cardMeshes;

        if(!cardMeshes) return;

        const cardFaceOrigin = cardMeshes[ 1 ];
        const cardBackOrigin = cardMeshes[ 2 ];

        if(!cardFaceOrigin || !cardBackOrigin) return;
        cardFaceOrigin.rotationQuaternion = null;
        cardFaceOrigin.rotation.x = -Math.PI / 2;

        cardBackOrigin.rotationQuaternion = null;
        cardBackOrigin.rotation.x = -Math.PI / 2;

        const cardFace = cardFaceOrigin.clone();
        const cardBack = cardBackOrigin.clone();

        const cardFaceMaterial = cardFace.material;
        cardFaceMaterial.specularColor = BABYLON.Color3.White();
        const cardBackMaterial = cardBack.material;
        cardBackMaterial.specularIntensity = BABYLON.Color3.White();


        cardFace.visibility = true;
        cardBack.visibility = true;
        cardFace.isPickable = true;
        cardFace.addChild( cardBack );

        this.cardFace = cardFace;
        this.cardBack = cardBack;
        this.cardMeshes = cardMeshes;
        this.cardFaceMaterial = cardFaceMaterial;
        this.cardBackMaterial = cardBackMaterial;
        this.mesh = cardFace;
    }

    setupCardAtlas(){
        this.atlas = new CardAtlas( this.root );
    }

    get material(){
        return this.materialOrigin.clone( 'mat_clone' );
    }

    set position( position ){
        this.cardFace.position = position;
    }

    get position(){
        return this.cardFace.position;
    }

}