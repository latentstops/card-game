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
        this.setupCard();
    }

    setupCard(){
        this.card = new Card(this);
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