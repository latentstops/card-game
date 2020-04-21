import {Card} from "./Card";

export class CardGameModels {
    constructor(game) {
        this.parent = game;
        this.paths = game.paths;
        this.scene = game.scene;
        this.camera = game.camera;
        this.engine = game.engine;

        this.cardAtlas = null;
        this.cardMeshes = [];
    }

    async load(){
        await this.setupAsyncCard();
        await this.setupGround();
        this.setupCard();
        this.setupPointerHandlers();
    }

    setupPointerHandlers(){
        const scene = this.scene;
        let startingPoint = null;
        scene.onPointerObservable.add(({event, pickInfo, type}) => {
            switch (type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if(pickInfo.hit && pickInfo.pickedMesh === this.ground) return;
                    startingPoint = getGroundPosition();

                    if (startingPoint) {
                        setTimeout(() => {
                            this.parent.deActivateCameraControls();
                        }, 0);
                    }
                    if (pickInfo.hit && pickInfo.pickedMesh !== this.ground) {
                        this.pickedMesh = pickInfo.pickedMesh;
                        // this.parent.deActivateCameraControls();
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    if (startingPoint) {
                        setTimeout(() => {
                            this.parent.activateCameraControls();
                        }, 0);
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
                    if (pickInfo.hit) {
                        this.card.playRotationIf(pickInfo.pickedMesh);
                    }
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

    setupCard(){
        this.card = new Card(this);
    }

    setupGround(){
        const scene = this.scene;
        const ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
        const groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.White();
        ground.material = groundMaterial;
        ground.material.alpha = 0;
        ground.position.y = -1;


        this.ground = ground;
    }

    async setupAsyncCard() {
        await this.setupAsyncCardAtlas();
        await this.setupAsyncCardMesh();
        this.correctDefaultLight();
    }

    correctDefaultLight() {
        const scene = this.scene;
        const defaultLight = scene.getLightByID("default light");
        defaultLight.direction.x = Math.PI / 2;

        this.parent.defaultLight = defaultLight;
    }

    async setupAsyncCardAtlas(){
        this.cardAtlas = await this.loadCardAtlas();
    }

    async loadCardAtlas( path = this.paths.cardPathAtlas){
        const scene   = this.scene;
        const texture = new BABYLON.Texture( path, scene );

        return new Promise(res => texture.onLoadObservable.add( () => res(texture) ) );
    }

    async setupAsyncCardMesh(){
        this.cardMeshes = await this.loadCardMesh();
        this.cardMeshes.forEach(m => m.visibility = false);
    }

    async loadCardMesh(path = this.paths.cardPathBabylon ){
        const scene = this.scene;
        const cardPathBabylon = path;

        return new Promise(res =>
            BABYLON.SceneLoader.ImportMesh('', '/', cardPathBabylon, scene, res)
        );
    }

    loadTable(){
        const scene = this.scene;
        const scenePathBabylon = this.paths.scenePathBabylon;
        BABYLON.SceneLoader.ImportMesh('','/', scenePathBabylon, scene, (tableMeshes) => {
            this.tableMeshes = tableMeshes;

        });
    }

}