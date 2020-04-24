import {joinWithSlash} from "./utils";

export class CardGameModels {
    constructor(root) {
        this.parent = root;
        this.paths = root.paths;
        this.scene = root.scene;
        this.camera = root.camera;
        this.engine = root.engine;

        this.cardAtlas = null;
        this.cardMeshes = [];
    }

    async load(){
        await this.setupAsyncObjects();

        this.setupGround();
        this.beautifyScene();
        // this.setupPointerHandlers();
    }

    async setupAsyncObjects() {
        await this.setupAsyncCard();
        await this.setupAsyncTable();
    }

    beautifyScene() {
        this.correctDefaultLight();
        // this.connectTextures();
    }

    setupGround(){
        const scene = this.scene;
        const ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
        const groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.White();
        ground.material = groundMaterial;
        ground.material.alpha = 0;
        ground.position.y = 94;


        this.ground = ground;
    }

    async setupAsyncTable() {
        const scene = this.scene;
        const tableMeshes = await this.loadAsyncMesh(this.paths.scenePathBabylon);
        const tableDiffuseTexture = await this.loadTextureAsync(joinWithSlash(this.paths.table, 'blackjack_table_mat_baseColor.65452.jpg'));

        const tableMesh = scene.getMeshByName('table');
        const tableMaterial = scene.getMaterialByName('blackjack_table_mat');


        const tableClothDiffuseTexture = await this.loadTextureAsync(this.paths.tableClothTexturePath);
        const tableClothMaterial = scene.getMaterialByName('blackjack_cloth_mat');
        tableClothMaterial.diffuseTexture = tableClothDiffuseTexture;

        this.tableClothDiffuseTexture = tableClothDiffuseTexture;
        this.tableClothMaterial = tableClothMaterial;
        this.tableMeshes = tableMeshes;
        this.tableMesh = tableMesh;
    }

    async setupAsyncCard() {
        this.cardMeshes = await this.loadAsyncMesh(this.paths.cardBabylonPath);
        this.cardAtlasTexture = await this.loadTextureAsync(this.paths.cardAtlasPath);
    }

    correctDefaultLight() {
        const scene = this.scene;
        const defaultLight = scene.getLightByID("default light");
        defaultLight.direction.x = Math.PI / 2;

        this.defaultLight = defaultLight;
    }

    async loadTextureAsync( path ) {
        const scene = this.scene;
        const texture = new BABYLON.Texture(path, scene);

        return new Promise(res => texture.onLoadObservable.add(() => res(texture)));
    }

    async loadAsyncMesh(path) {
        const scene = this.scene;

        return new Promise(res =>
            BABYLON.SceneLoader.ImportMesh('', '/', path, scene, res)
        );
    }

}