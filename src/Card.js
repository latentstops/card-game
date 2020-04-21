import {CardAtlas} from "./CardAtlas";

export class Card {

    clone(){
        const card = new Card(this.parent);

        card.position.x += this.position.x + 7;

        return card;
    }

    constructor(parent) {
        this.parent = parent;
        this.scene = parent.scene;
        this.camera = parent.camera;
        this.paths = parent.paths;
        this.setup();
    }

    setup(){
        this.setupCardAtlas();
        this.setupMaterialOrigin();
        this.setupMeshes();
        this.setupPosition();
        this.setFaceTo( 'xA' );
        this.setBack();
        this.setupAnimations();
        // this.setupOnClickHandler();
    }

    playRotationIf( card = this.cardFace ){
        const toBack = this.animRotateToBack;
        const toFront = this.animRotateToFront;
        if(card.isRotated){
            card.animations = [toFront];
            card.isRotated = false;
        } else {
            card.animations = [toBack];
            card.isRotated = true;
        }

        this.playAnimation( card );
    }

    playAnimation(card = this.cardFace){
        const scene = this.scene;
        scene.beginAnimation( card, 0, 10, true );
    }

    stopAnimation(card = this.cardFace){
        const scene = this.scene;
        scene.stopAnimation( card );
    }

    setupAnimations(){
        this.rotationToBack();
        this.rotationToFront();
    }


    rotationToFront() {
        const cardRotateAnimation = new BABYLON.Animation(
            "rotateToFront",
            "rotation.z",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        cardRotateAnimation.setKeys([
            {
                frame: 0,
                value: 3 * Math.PI
            },
            {
                frame: 10,
                value: 0
            }
        ]);

        this.animRotateToFront = cardRotateAnimation;
    }

    rotationToBack() {
        const cardRotateAnimation = new BABYLON.Animation(
            "rotateToBack",
            "rotation.z",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        cardRotateAnimation.setKeys([
            {
                frame: 0,
                value: 0
            },
            {
                frame: 10,
                value: 3 * Math.PI
            }
        ]);

        this.animRotateToBack = cardRotateAnimation;
    }

    setBack() {
        const material = this.material;
        const backSideTexture = this.atlas.getTextureByCardName('backside');

        material.diffuseTexture = backSideTexture;

        this.cardBack.material = material;
    }

    setFaceTo( name ){
        const material = this.material;
        const mesh = this.cardFace;

        const texture = this.atlas.getTextureByCardName( name );

        material.diffuseTexture = texture;

        mesh.material = material;
    }

    setupPosition(){
        this.position = this.cardFace.position;
    }

    setupMaterialOrigin(){
        const scene = this.scene;
        this.materialOrigin = new BABYLON.StandardMaterial("cardMaterial", scene);
    }

    setupMeshes(){
        const cardMeshes = this.parent.cardMeshes;
        const cardFace = cardMeshes[0].clone();
        const cardBack = cardMeshes[1].clone();
        const cardFaceMaterial = cardFace.material;
        const cardBackMaterial = cardBack.material;

        cardFace.visibility = true;
        cardBack.visibility = true;
        cardFace.addChild( cardBack );
        cardFace.isPickable = true;

        this.cardFace = cardFace;
        this.cardBack = cardBack;
        this.cardMeshes = cardMeshes;
        this.cardFaceMaterial = cardFaceMaterial;
        this.cardBackMaterial = cardBackMaterial;
    }

    setupCardAtlas(){
        this.atlas = new CardAtlas(this.parent);
    }

    get material() {
        return this.materialOrigin.clone('mat_clone');
    }

    set position( position ){
        this.cardFace.position = position;
    }

    get position(){
        return this.cardFace.position;
    }

}